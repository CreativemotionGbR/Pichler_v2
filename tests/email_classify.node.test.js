"use strict";

/*
 * Prüft die automatische Feldableitung aus E-Mail-Text (classifyEmailFields)
 * und die Extraktion betroffener Systeme (extractAffectedSystems) aus script.js.
 * Kernfall: Verneinungen wie "keine ..." / "bleiben unverändert" dürfen NICHT
 * fälschlich als Ja gewertet werden.
 *
 * Ausführen:  node tests/email_classify.node.test.js
 */

const assert = require("assert");
const path = require("path");

const { classifyEmailFields, extractAffectedSystems } = require(
  path.join(__dirname, "..", "script.js")
);
const { evaluateChange } = require(path.join(__dirname, "..", "js", "rules-engine.js"));
const rules = require(path.join(__dirname, "..", "data", "rules.json"));

let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed += 1;
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
  }
}

// 1) Der reale Testfall: internes Software-Update ohne Datenbezug.
const druckserverMail = [
  "auf den internen Druckservern wird die Drucksoftware auf Version 2.8 aktualisiert.",
  "Die Aktualisierung dient ausschließlich der Fehlerbehebung und Stabilität.",
  "Es werden keine personenbezogenen Daten verarbeitet. Es sind keine Kunden betroffen.",
  "Es werden keine externen Dienstleister eingebunden.",
  "Zugriffe, Berechtigungen und Sicherheitsmaßnahmen bleiben unverändert.",
].join(" ");

check("Druckserver-Update: alle Felder korrekt verneint", () => {
  const f = classifyEmailFields("Drucksoftware Update", druckserverMail);
  assert.strictEqual(f.security_change, "Nein", "security_change muss Nein sein (bleibt unverändert)");
  assert.strictEqual(f.personal_data, "Nein");
  assert.strictEqual(f.customers_affected, "Nein");
  assert.strictEqual(f.external_parties, "Nein");
  assert.strictEqual(f.change_type, "Software-Update ohne Datenbezug");
});

check("Druckserver-Update: betroffene Systeme werden erkannt", () => {
  const systems = extractAffectedSystems(druckserverMail);
  assert.ok(/Druckserver/.test(systems), `Systeme sollten Druckserver enthalten: ${systems}`);
  assert.ok(/Drucksoftware/.test(systems), `Systeme sollten Drucksoftware enthalten: ${systems}`);
});

check("Druckserver-Update: Gesamtbewertung ist Low", () => {
  const f = classifyEmailFields("", druckserverMail);
  const change = Object.assign(
    { change_id: "CHG-005", date: "2026-07-13", description: druckserverMail, number_of_customers: 0 },
    f
  );
  const result = evaluateChange(change, rules);
  assert.strictEqual(result.impact_level, "Low");
  assert.deepStrictEqual(result.affected_documents, ["Änderungshistorie"]);
});

// 2) Gegentest: echte Sicherheitsänderung darf NICHT verneint werden.
check("Verschlüsselungsumstellung wird als Sicherheitsänderung erkannt", () => {
  const mail = "Wir stellen die Verschlüsselung der Datenbank auf AES-256 um. Die Zugriffsrechte werden angepasst.";
  const f = classifyEmailFields("Verschlüsselung", mail);
  assert.strictEqual(f.security_change, "Ja");
  assert.strictEqual(f.change_type, "Verschlüsselung geändert");
});

// 3) Gegentest: neuer Dienstleister mit Kundendaten.
check("Neuer Dienstleister mit Kundendaten füllt AVV-relevante Felder", () => {
  const mail = "Wir setzen einen neuen Cloud-Dienstleister ein, der Kundendaten verarbeitet. Kunden sind betroffen.";
  const f = classifyEmailFields("Neuer Anbieter", mail);
  assert.strictEqual(f.change_type, "Neuer Dienstleister");
  assert.strictEqual(f.external_parties, "Ja");
  assert.strictEqual(f.personal_data, "Ja");
  assert.strictEqual(f.customers_affected, "Ja");
});

check("Regression 1: 'Kunden sind nicht betroffen' bleibt Low", () => {
  const mail = [
    "Auf den internen Druckservern wird die Drucksoftware aktualisiert.",
    "Es werden keine personenbezogenen Daten verarbeitet.",
    "Kunden sind nicht betroffen.",
    "Es werden keine externen Dienstleister eingebunden.",
    "Sicherheitsmaßnahmen bleiben unverändert.",
  ].join(" ");
  const fields = classifyEmailFields("Internes Software-Update", mail);
  const result = evaluateChange(Object.assign({ change_type: fields.change_type }, fields), rules);
  assert.strictEqual(fields.change_type, "Software-Update ohne Datenbezug");
  assert.strictEqual(fields.security_change, "Nein");
  assert.strictEqual(fields.personal_data, "Nein");
  assert.strictEqual(fields.customers_affected, "Nein");
  assert.strictEqual(fields.external_parties, "Nein");
  assert.strictEqual(result.impact_level, "Low");
});

check("Regression 2: API-Entfernung erkennt beide Systeme ohne Sicherheitsänderung", () => {
  const mail = [
    "Die API zwischen dem Altsystem und dem Reporting-System wird entfernt.",
    "Es wird keine neue Schnittstelle eingeführt und kein neuer Dienstleister beauftragt.",
    "Die technischen Zugriffsrechte werden im Zuge der Abschaltung entfernt.",
    "Personenbezogene Daten und Kunden sind nicht betroffen.",
  ].join(" ");
  const fields = classifyEmailFields("API wird entfernt", mail);
  const systems = extractAffectedSystems(mail);
  const result = evaluateChange(Object.assign({ change_type: fields.change_type }, fields), rules);
  assert.strictEqual(fields.change_type, "API entfernt");
  assert.notStrictEqual(fields.security_change, "Ja");
  assert.strictEqual(fields.personal_data, "Nein");
  assert.strictEqual(fields.customers_affected, "Nein");
  assert.strictEqual(fields.external_parties, "Nein");
  assert.ok(systems.split(", ").includes("Altsystem"), systems);
  assert.ok(systems.split(", ").includes("Reporting-System"), systems);
  assert.strictEqual(result.impact_level, "Medium");
});

check("Regression 3: neuer CRM-Dienstleister extrahiert CRM-System", () => {
  const mail = [
    "Ein neuer externer Dienstleister übernimmt Support und Wartung für das CRM-System.",
    "Er erhält Zugriff auf personenbezogene Kundendaten. Kunden sind betroffen.",
  ].join(" ");
  const fields = classifyEmailFields("Neuer Dienstleister für CRM", mail);
  const systems = extractAffectedSystems(mail);
  const result = evaluateChange(Object.assign({ change_type: fields.change_type }, fields), rules);
  assert.strictEqual(fields.change_type, "Neuer Dienstleister");
  assert.strictEqual(fields.security_change, "Nein");
  assert.strictEqual(fields.personal_data, "Ja");
  assert.strictEqual(fields.customers_affected, "Ja");
  assert.strictEqual(fields.external_parties, "Ja");
  assert.ok(systems.split(", ").includes("CRM-System"), systems);
  assert.strictEqual(result.impact_level, "High");
});

if (failures.length > 0) {
  console.error(`FEHLGESCHLAGEN: ${failures.length} Fall/Fälle`);
  for (const message of failures) console.error("  - " + message);
  process.exit(1);
}

console.log(`OK: ${passed} E-Mail-Klassifikations-Fälle bestanden.`);
