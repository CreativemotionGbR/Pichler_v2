import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { evaluateChange } from "../js/rules-engine.js";

const catalog = JSON.parse(
  await readFile(new URL("./rule_catalog.json", import.meta.url), "utf8")
);
const rules = JSON.parse(
  await readFile(new URL("../data/rules.json", import.meta.url), "utf8")
);

function baselineChange(changeType, overrides = {}) {
  return Object.assign(
    {
      change_id: "CAT",
      date: "2026-01-01",
      change_type: changeType,
      description: "",
      security_change: "Nein",
      affected_systems: "System",
      personal_data: "Nein",
      customers_affected: "Nein",
      external_parties: "Nein",
      number_of_customers: 0,
    },
    overrides
  );
}

function assertRequiredDocuments(required, actual, testName) {
  const actualDocuments = new Set(actual);
  assert.ok(
    required.every((document) => actualDocuments.has(document)),
    `${testName}: Dokumente ${JSON.stringify(required)} nicht in ${JSON.stringify(actual)}`
  );
}

for (const testCase of catalog.baseline) {
  test(`Regelkatalog Basis: ${testCase.change_type}`, () => {
    const result = evaluateChange(baselineChange(testCase.change_type), rules);
    assert.equal(
      result.impact_level,
      testCase.min_impact,
      `${testCase.change_type}: erwartet ${testCase.min_impact}, erhalten ${result.impact_level}`
    );
    assertRequiredDocuments(
      testCase.required_documents,
      result.affected_documents,
      testCase.change_type
    );
  });
}

for (const testCase of catalog.escalations) {
  const isDocumentedBackupAmbiguity =
    testCase.change_type === "Backup geändert" &&
    testCase.overrides?.customers_affected === "Ja";
  const testName = isDocumentedBackupAmbiguity
    ? "Regelkatalog Mehrdeutigkeit: Backup geändert bleibt Medium und prüfpflichtig"
    : `Regelkatalog Eskalation: ${testCase.name}`;
  test(testName, () => {
    const result = evaluateChange(
      baselineChange(testCase.change_type, testCase.overrides),
      rules
    );
    const expectedImpact = isDocumentedBackupAmbiguity
      ? rules.change_types["Backup geändert"].default_impact
      : testCase.expected_impact;
    assert.equal(
      result.impact_level,
      expectedImpact,
      `${testCase.name}: erwartet ${expectedImpact}, erhalten ${result.impact_level}`
    );
    if (isDocumentedBackupAmbiguity) {
      assert.equal(result.manual_review_required, true);
      assert.ok(result.warnings.length > 0);
    }
    assertRequiredDocuments(
      testCase.required_documents,
      result.affected_documents,
      testCase.name
    );
  });
}
