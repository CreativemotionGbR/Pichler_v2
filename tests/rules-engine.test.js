import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluateChange } from "../js/rules-engine.js";

const rules = JSON.parse(await readFile(new URL("../data/rules.json", import.meta.url), "utf8"));

function change(overrides = {}) {
  return {
    change_type: "Software-Update ohne Datenbezug",
    security_change: "Nein",
    personal_data: "Nein",
    customers_affected: "Nein",
    external_parties: "Nein",
    ...overrides,
  };
}

test("Software-Update ohne Datenbezug ist Low", () => {
  const result = evaluateChange(change(), rules);
  assert.equal(result.impact_level, "Low");
  assert.deepEqual(result.affected_documents, ["Änderungshistorie"]);
});

test("API entfernt ist Medium", () => {
  assert.equal(evaluateChange(change({ change_type: "API entfernt" }), rules).impact_level, "Medium");
});

test("System wird abgeschaltet ist Medium", () => {
  assert.equal(evaluateChange(change({ change_type: "System wird abgeschaltet" }), rules).impact_level, "Medium");
});

test("Neuer Dienstleister ist High und AVV-relevant", () => {
  const result = evaluateChange(change({ change_type: "Neuer Dienstleister", external_parties: "Ja", personal_data: "Ja" }), rules);
  assert.equal(result.impact_level, "High");
  assert.ok(result.affected_documents.includes("AVV"));
});

test("API-Änderung mit Datenübertragung ist High und betrifft AVV/TOM", () => {
  const result = evaluateChange(change({ change_type: "API-Änderung", personal_data: "Ja" }), rules);
  assert.equal(result.impact_level, "High");
  assert.ok(result.affected_documents.includes("AVV"));
  assert.ok(result.affected_documents.includes("TOM"));
});

test("Verschlüsselungsänderung ist High und TOM-relevant", () => {
  const result = evaluateChange(change({ change_type: "Verschlüsselung geändert", security_change: "Ja" }), rules);
  assert.equal(result.impact_level, "High");
  assert.ok(result.affected_documents.includes("TOM"));
});

test("Mehrdeutige Typzuordnung bleibt nachvollziehbar und prüfpflichtig", () => {
  const result = evaluateChange(change({ change_type: "Backup geändert", security_change: "Ja" }), rules);
  assert.equal(result.impact_level, "Medium");
  assert.equal(result.manual_review_required, true);
  assert.ok(result.warnings.some((warning) => warning.includes("Medium/High")));
});

test("Unbekannte und unklare Angaben verlangen mindestens manuelle Prüfung", () => {
  const result = evaluateChange(change({ change_type: "Unbekannter Typ", personal_data: "Unklar" }), rules);
  assert.equal(result.impact_level, "Medium");
  assert.equal(result.manual_review_required, true);
  assert.ok(result.matched_rules.some((rule) => rule.id === "impact-unknown"));
});

test("evaluateChange verändert die Eingabedaten nicht", () => {
  const input = Object.freeze(change({ change_type: "Neuer Dienstleister" }));
  evaluateChange(input, rules);
  assert.deepEqual(input, change({ change_type: "Neuer Dienstleister" }));
});
