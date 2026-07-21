import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { evaluateChange } from "../js/rules-engine.js";
import { loadScriptTestApi } from "./helpers/load-script-test-api.js";

const rules = JSON.parse(
  await readFile(new URL("../data/rules.json", import.meta.url), "utf8")
);
const scriptSource = await readFile(new URL("../script.js", import.meta.url), "utf8");
const indexSource = await readFile(new URL("../index.html", import.meta.url), "utf8");

function change(overrides = {}) {
  return {
    change_id: "INT-001",
    date: "2026-07-21",
    change_type: "Software-Update ohne Datenbezug",
    description: "Internes Update ohne Datenbezug",
    security_change: "Nein",
    affected_systems: "Internes System",
    personal_data: "Nein",
    customers_affected: "Nein",
    external_parties: "Nein",
    number_of_customers: 0,
    ...overrides,
  };
}

test("Browser-App lädt script.js als Modul und das zentrale JSON-Regelwerk", () => {
  assert.match(indexSource, /<script\s+type="module"\s+src="script\.js"><\/script>/);
  assert.match(scriptSource, /import\s+\{\s*evaluateChange\s*\}\s+from\s+"\.\/js\/rules-engine\.js"/);
  assert.match(scriptSource, /new URL\("\.\/data\/rules\.json",\s*import\.meta\.url\)/);
  assert.doesNotMatch(scriptSource, /function\s+evaluateChange\s*\(/);
});

test("Formular, CSV-Import und Fallback-Beispiele verwenden den zentralen Bewertungsadapter", () => {
  assert.match(scriptSource, /lastEvaluation\s*=\s*\{\s*\.\.\.change,\s*\.\.\.evaluateWithCentralRules\(change\)/);
  assert.match(scriptSource, /FALLBACK_SAMPLE_CHANGES\.map\(\(change\)\s*=>\s*\(\{\s*\.\.\.change,\s*\.\.\.evaluateWithCentralRules\(change\)/);
  assert.match(scriptSource, /imported\.push\(\{\s*\.\.\.change,\s*\.\.\.evaluateWithCentralRules\(change\)/);
  assert.match(scriptSource, /return\s+evaluateChange\(change,\s*centralRules\)/);
});

test("Manuelle und per E-Mail vorbelegte identische Felder ergeben dasselbe Ergebnis", async () => {
  const { classifyEmailFields } = await loadScriptTestApi();
  const emailText = [
    "Internes Software-Update ohne Datenbezug.",
    "Keine personenbezogenen Daten.",
    "Keine Kunden betroffen.",
    "Keine externen Dienstleister.",
    "Sicherheitsmaßnahmen bleiben unverändert.",
  ].join(" ");
  const emailFields = classifyEmailFields("Software-Update", emailText);
  const manualChange = change();
  const emailChange = change(emailFields);

  assert.deepEqual(
    evaluateChange(emailChange, rules),
    evaluateChange(manualChange, rules)
  );
});

test("Zentrales Engine-Ergebnis bleibt mit Darstellung und Historie kompatibel", () => {
  const result = evaluateChange(change(), rules);
  assert.equal(result.impact_level, "Low");
  assert.ok(Array.isArray(result.affected_documents));
  assert.ok(Array.isArray(result.measures));
  assert.ok(Array.isArray(result.warnings));
  assert.equal(typeof result.customer_information_required, "boolean");
  assert.equal(typeof result.manual_review_required, "boolean");
  assert.match(scriptSource, /function\s+renderResult\s*\(result/);
  assert.match(scriptSource, /history\.push\(\{\s*\.\.\.lastEvaluation,\s*saved_at:/);
});
