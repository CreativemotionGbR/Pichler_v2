const IMPACT_ORDER = Object.freeze({ Low: 1, Medium: 2, High: 3 });
const REQUIRED_DECISION_FIELDS = Object.freeze([
  "security_change",
  "personal_data",
  "customers_affected",
  "external_parties",
]);

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function maximumImpact(current, candidate) {
  return IMPACT_ORDER[candidate] > IMPACT_ORDER[current] ? candidate : current;
}

function conditionMatches(change, condition) {
  if (condition.all) return condition.all.every((entry) => conditionMatches(change, entry));
  if (condition.any_required_value !== undefined) {
    return REQUIRED_DECISION_FIELDS.some((field) => change[field] === condition.any_required_value);
  }
  return change[condition.field] === condition.equals;
}

function ambiguityWarning(changeType) {
  return `Das PDF ordnet '${changeType}' als Medium/High ein, definiert aber keine Abgrenzungsbedingung. Medium wird als belegte Mindeststufe verwendet; manuelle Prüfung ist erforderlich.`;
}

export function evaluateChange(change, rules) {
  if (!change || typeof change !== "object") throw new TypeError("change muss ein Objekt sein.");
  if (!rules || typeof rules !== "object") throw new TypeError("rules muss ein Regelobjekt sein.");

  const typeRule = rules.change_types?.[change.change_type];
  const warnings = [];
  const matchedRules = [];
  let impact = "Low";
  let documents = [];
  let measures = [];

  if (typeRule) {
    impact = typeRule.default_impact || typeRule.impact;
    documents = [...(typeRule.documents || [])];
    measures = [...(typeRule.measures || [])];
    matchedRules.push({
      id: `change-type:${change.change_type}`,
      source: "change_types",
      impact: typeRule.impact,
      description: typeRule.description,
    });

    if (typeRule.ambiguous) warnings.push(ambiguityWarning(change.change_type));
    if (typeRule.possible_documents?.length) {
      warnings.push(`Möglicherweise zusätzlich betroffene Dokumente: ${typeRule.possible_documents.join(", ")}. Das PDF nennt hierfür keine eindeutige Bedingung.`);
    }
  } else {
    impact = "Medium";
    warnings.push("Änderungstyp ist unbekannt oder unklar; manuelle Prüfung erforderlich.");
    matchedRules.push({ id: "change-type:unknown", source: "decision_logic", impact: "Medium" });
  }

  for (const rule of rules.impact_model?.operational_rules || []) {
    if (!conditionMatches(change, rule.when)) continue;
    impact = maximumImpact(impact, rule.minimum_impact);
    matchedRules.push({ id: rule.id, source: "impact_model.operational_rules", impact: rule.minimum_impact, description: rule.description });
    if (rule.ambiguous) warnings.push(`'${rule.description}' ist laut PDF nur als Spannbreite beschrieben; eine höhere Einstufung erfordert eine manuelle Prüfung.`);
  }

  if (change.external_parties === "Ja") {
    documents.push("AVV");
    matchedRules.push({ id: "decision:external-parties", source: "decision_logic", description: "Externe Beteiligte = Ja; AVV prüfen" });
  }
  if (change.security_change === "Ja") {
    documents.push("TOM");
    matchedRules.push({ id: "decision:security-change", source: "decision_logic", description: "Sicherheitsänderung = Ja; TOM prüfen" });
  }
  if (change.personal_data === "Ja") {
    matchedRules.push({ id: "decision:personal-data", source: "decision_logic", description: "Personenbezogene Daten = Ja; DSGVO prüfen" });
  }

  const communication = rules.measures_catalog?.communication || [];
  if (impact === "Medium" || impact === "High") {
    measures.push(communication.find((entry) => entry.measure === "interne Info vorbereiten")?.measure);
  }

  const customerInformationRequired = change.customers_affected === "Ja";
  if (customerInformationRequired) {
    measures.push(communication.find((entry) => entry.measure === "Kundeninformation vorbereiten")?.measure);
    if (impact === "High") measures.push(communication.find((entry) => entry.measure === "Mail-Template generieren")?.measure);
  } else if (impact === "Low" && change.external_parties === "Nein") {
    measures.push(communication.find((entry) => entry.measure === "keine Kundeninfo nötig")?.measure);
  }

  documents = unique(documents);
  measures = unique(measures);
  const manualReviewRequired = impact !== "Low" || warnings.length > 0;
  const gdprRelevance = impact === "Low"
    ? "Keine direkte DSGVO-Relevanz"
    : impact === "Medium"
      ? "DSGVO-Bezug möglich"
      : "DSGVO-relevant";

  return {
    impact_level: impact,
    gdpr_relevance: gdprRelevance,
    affected_documents: documents,
    measures,
    customer_information_required: customerInformationRequired,
    manual_review_required: manualReviewRequired,
    summary: `${change.change_type || "Unbekannte Änderung"} wurde als ${impact} bewertet. Betroffene Dokumente: ${documents.join(", ") || "keine eindeutige Zuordnung"}.`,
    warnings: unique(warnings),
    matched_rules: matchedRules,
  };
}
