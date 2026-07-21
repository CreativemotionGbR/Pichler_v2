"""Prüft die Python-Regel-Engine gegen die Excel-Wahrheitstabelle (Regelkatalog).

Die Fälle stammen aus tests/rule_catalog.json und werden von der JS-Engine
(tests/rules_catalog.node.test.js) gegen dieselbe Datei geprüft, damit beide
Implementierungen konsistent zum Blatt 'Regelkatalog' bleiben.
"""
import json
from pathlib import Path

import pytest

from src.rules import evaluate_change

CATALOG = json.loads((Path(__file__).parent / "rule_catalog.json").read_text(encoding="utf-8"))


def _baseline_change(change_type: str, **overrides) -> dict:
    change = {
        "change_id": "CAT",
        "date": "2026-01-01",
        "change_type": change_type,
        "description": "",
        "security_change": "Nein",
        "affected_systems": "System",
        "personal_data": "Nein",
        "customers_affected": "Nein",
        "external_parties": "Nein",
        "number_of_customers": 0,
    }
    change.update(overrides)
    return change


@pytest.mark.parametrize("case", CATALOG["baseline"], ids=lambda c: c["change_type"])
def test_baseline_impact_matches_regelkatalog(case):
    result = evaluate_change(_baseline_change(case["change_type"]))
    assert result["impact_level"] == case["min_impact"]
    assert set(case["required_documents"]).issubset(set(result["affected_documents"]))


@pytest.mark.parametrize("case", CATALOG["escalations"], ids=lambda c: c["name"])
def test_escalations_match_regelkatalog(case):
    result = evaluate_change(_baseline_change(case["change_type"], **case["overrides"]))
    assert result["impact_level"] == case["expected_impact"]
    assert set(case["required_documents"]).issubset(set(result["affected_documents"]))
