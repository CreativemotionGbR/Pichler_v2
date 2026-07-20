"use strict";

/*
 * Prüft die JS-Regel-Engine aus script.js gegen dieselbe Excel-Wahrheitstabelle
 * (tests/rule_catalog.json) wie die Python-Tests. So bleiben Browser-App und
 * Python-MVP konsistent zum Blatt "Regelkatalog".
 *
 * Ausführen ohne zusätzliche Abhängigkeiten:  node tests/rules_catalog.node.test.js
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { evaluateChange } = require(path.join(__dirname, "..", "script.js"));
const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, "rule_catalog.json"), "utf-8")
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

function isSubset(required, actual) {
  const set = new Set(actual);
  return required.every((doc) => set.has(doc));
}

let passed = 0;
const failures = [];

for (const testCase of catalog.baseline) {
  const result = evaluateChange(baselineChange(testCase.change_type));
  try {
    assert.strictEqual(
      result.impact_level,
      testCase.min_impact,
      `${testCase.change_type}: erwartet ${testCase.min_impact}, erhalten ${result.impact_level}`
    );
    assert.ok(
      isSubset(testCase.required_documents, result.affected_documents),
      `${testCase.change_type}: Dokumente ${JSON.stringify(
        testCase.required_documents
      )} nicht in ${JSON.stringify(result.affected_documents)}`
    );
    passed += 1;
  } catch (error) {
    failures.push(error.message);
  }
}

for (const testCase of catalog.escalations) {
  const result = evaluateChange(
    baselineChange(testCase.change_type, testCase.overrides)
  );
  try {
    assert.strictEqual(
      result.impact_level,
      testCase.expected_impact,
      `${testCase.name}: erwartet ${testCase.expected_impact}, erhalten ${result.impact_level}`
    );
    assert.ok(
      isSubset(testCase.required_documents, result.affected_documents),
      `${testCase.name}: Dokumente ${JSON.stringify(
        testCase.required_documents
      )} nicht in ${JSON.stringify(result.affected_documents)}`
    );
    passed += 1;
  } catch (error) {
    failures.push(error.message);
  }
}

if (failures.length > 0) {
  console.error(`FEHLGESCHLAGEN: ${failures.length} Fall/Fälle`);
  for (const message of failures) console.error("  - " + message);
  process.exit(1);
}

console.log(`OK: ${passed} Regelkatalog-Fälle bestanden (JS-Engine).`);
