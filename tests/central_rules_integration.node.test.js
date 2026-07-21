"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const { evaluateChange } = require(path.join(root, "js", "rules-engine.js"));
const { classifyEmailFields } = require(path.join(root, "script.js"));
const rules = require(path.join(root, "data", "rules.json"));
const scriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");

let passed = 0;
const failures = [];
function check(name, fn) {
  try { fn(); passed += 1; }
  catch (error) { failures.push(`${name}: ${error.message}`); }
}

function change(changeType, overrides = {}) {
  return Object.assign({
    change_id: "CENTRAL",
    date: "2026-07-22",
    change_type: changeType,
    description: "Integrationstest",
    security_change: "Nein",
    affected_systems: "System",
    personal_data: "Nein",
    customers_affected: "Nein",
    external_parties: "Nein",
    number_of_customers: 0,
  }, overrides);
}

[
  ["LOW", change("Software-Update ohne Datenbezug"), "Low"],
  ["MEDIUM API entfernt", change("API entfernt"), "Medium"],
  ["MEDIUM Systemabschaltung", change("System wird abgeschaltet"), "Medium"],
  ["HIGH neuer Dienstleister", change("Neuer Dienstleister", { external_parties: "Ja", personal_data: "Ja" }), "High"],
  ["HIGH API-Änderung", change("API-Änderung", { personal_data: "Ja" }), "High"],
  ["HIGH Verschlüsselung", change("Verschlüsselung geändert", { security_change: "Ja" }), "High"],
].forEach(([name, input, expected]) => {
  check(name, () => assert.strictEqual(evaluateChange(input, rules).impact_level, expected));
});

check("Manuelle und per E-Mail vorbelegte Felder werden identisch bewertet", () => {
  const mail = "Internes Software-Update ohne Datenbezug. Keine personenbezogenen Daten. Keine Kunden betroffen. Keine externen Dienstleister. Sicherheitsmaßnahmen bleiben unverändert.";
  const emailFields = classifyEmailFields("Software-Update", mail);
  const manual = change("Software-Update ohne Datenbezug");
  assert.deepStrictEqual(
    evaluateChange(Object.assign({}, manual, emailFields), rules),
    evaluateChange(manual, rules)
  );
});

check("Browser lädt Engine vor der unveränderten Hauptanwendung", () => {
  assert.ok(indexSource.indexOf('src="js/rules-engine.js"') < indexSource.indexOf('src="script.js"'));
});

check("Formular, CSV und Fallback-Beispiele verwenden denselben Adapter", () => {
  assert.match(scriptSource, /lastEvaluation\s*=\s*\{\s*\.\.\.change,\s*\.\.\.evaluateWithCentralRules\(change\)/);
  assert.match(scriptSource, /imported\.push\(\{\s*\.\.\.change,\s*\.\.\.evaluateWithCentralRules\(change\)/);
  assert.match(scriptSource, /FALLBACK_SAMPLE_CHANGES\.map\(\(change\)\s*=>\s*\(\{\s*\.\.\.change,\s*\.\.\.evaluateWithCentralRules\(change\)/);
  assert.doesNotMatch(scriptSource, /function\s+evaluateChange\s*\(/);
});

check("Engine-Ergebnis bleibt mit Darstellung und Historie kompatibel", () => {
  const result = evaluateChange(change("Software-Update ohne Datenbezug"), rules);
  assert.ok(Array.isArray(result.affected_documents));
  assert.ok(Array.isArray(result.measures));
  assert.ok(Array.isArray(result.warnings));
  assert.match(scriptSource, /function\s+renderResult\s*\(result/);
  assert.match(scriptSource, /history\.push\(\{\s*\.\.\.lastEvaluation,\s*saved_at:/);
});

if (failures.length) {
  console.error(`FEHLGESCHLAGEN: ${failures.length} Fall/Fälle`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`OK: ${passed} zentrale Integrationsfälle bestanden.`);
