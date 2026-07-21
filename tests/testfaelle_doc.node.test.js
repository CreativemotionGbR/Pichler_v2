"use strict";

/*
 * End-to-End-Regressionstests für die E-Mail-Testfälle aus
 * "DSGVO_Prototyp_Testfaelle.docx" (die E-Mail-basierten Fälle 1,3,5,7,8,9,12).
 * Erwartungen stammen 1:1 aus dem Dokument (Vorbelegung + Bewertung).
 *
 * Ausführen:  node tests/testfaelle_doc.node.test.js
 */

const assert = require("assert");
const path = require("path");
const { classifyEmailFields, extractAffectedSystems } = require(path.join(__dirname, "..", "script.js"));
const { evaluateChange } = require(path.join(__dirname, "..", "js", "rules-engine.js"));
const rules = require(path.join(__dirname, "..", "data", "rules.json"));

let passed = 0;
const failures = [];

function run(name, mail, expectFields, expectImpact, expectDocs) {
  try {
    const fields = classifyEmailFields("", mail);
    const change = Object.assign(
      { change_id: "DOC", date: "2026-01-01", description: mail, affected_systems: extractAffectedSystems(mail), number_of_customers: 0 },
      fields
    );
    const result = evaluateChange(change, rules);
    for (const [key, value] of Object.entries(expectFields)) {
      assert.strictEqual(fields[key], value, `${key}: erwartet ${value}, ist ${fields[key] || "(offen)"}`);
    }
    assert.strictEqual(result.impact_level, expectImpact, `Impact: erwartet ${expectImpact}, ist ${result.impact_level}`);
    (expectDocs || []).forEach((doc) => {
      assert.ok(result.affected_documents.includes(doc), `Dokument "${doc}" fehlt (${result.affected_documents.join(", ")})`);
    });
    passed += 1;
  } catch (e) {
    failures.push(`${name}: ${e.message}`);
  }
}

run("Fall 1 – LOW Software-Update ohne Datenbezug",
  "Betreff: Technisches Wartungsupdate der internen Drucksoftware. auf den internen Druckservern wird die Drucksoftware auf Version 2.8 aktualisiert. Die Aktualisierung dient ausschließlich der Fehlerbehebung und Stabilität. Es werden keine personenbezogenen Daten verarbeitet. Es sind keine Kunden betroffen. Es werden keine externen Dienstleister eingebunden. Zugriffe, Berechtigungen und Sicherheitsmaßnahmen bleiben unverändert.",
  { change_type: "Software-Update ohne Datenbezug", personal_data: "Nein", customers_affected: "Nein", external_parties: "Nein", security_change: "Nein" },
  "Low", ["Änderungshistorie"]);

run("Fall 3 – MEDIUM System wird abgeschaltet",
  "Betreff: Stilllegung des alten Archivsystems. das bisherige interne Archivsystem wird zum 31.07.2026 außer Betrieb genommen. Es wird kein neues System eingeführt und kein neuer Dienstleister beauftragt. Vor der Abschaltung sollen bestehende Zugänge entfernt und die Dokumentation bereinigt werden. Bitte prüfen Sie außerdem, ob bestehende AVV- oder TOM-Unterlagen angepasst werden müssen.",
  { change_type: "System wird abgeschaltet", external_parties: "Nein" },
  "Medium", ["Änderungshistorie", "AVV", "TOM"]);

run("Fall 5 – HIGH Neuer Dienstleister",
  "Betreff: Neuer Hosting-Dienstleister für Kundenportal. ab dem 01.08.2026 wird für unser Kundenportal ein neuer Hosting-Dienstleister eingesetzt. Der Dienstleister erhält Zugriff auf personenbezogene Kundendaten, darunter Namen, E-Mail-Adressen und Vertragsdaten. Vor der Inbetriebnahme muss ein neuer Auftragsverarbeitungsvertrag abgeschlossen werden. Bitte prüfen Sie außerdem die technischen und organisatorischen Maßnahmen und dokumentieren Sie den neuen Dienstleister.",
  { change_type: "Neuer Dienstleister", personal_data: "Ja", customers_affected: "Ja", external_parties: "Ja" },
  "High", ["AVV"]);

run("Fall 7 – HIGH Neuer Subunternehmer",
  "Betreff: Information über neuen Subunternehmer. wir informieren Sie darüber, dass wir ab dem 01.08.2026 einen neuen Subunternehmer für den technischen Plattformbetrieb einsetzen. Der Subunternehmer kann im Rahmen seiner Tätigkeit Zugriff auf personenbezogene Daten erhalten. Bitte prüfen Sie die bestehende Subunternehmerliste sowie die vertraglichen Regelungen und ob eine Kundeninformation oder Freigabe erforderlich ist.",
  { change_type: "Neuer Subunternehmer", personal_data: "Ja", external_parties: "Ja" },
  "High", ["AVV"]);

run("Fall 8 – HIGH Freelancer mit Zugriff",
  "Betreff: Externer Freelancer erhält Zugriff auf CRM. für ein dreimonatiges Projekt erhält ein externer Freelancer Zugriff auf unser CRM-System. Im CRM befinden sich personenbezogene Kunden- und Kontaktdaten. Der Freelancer benötigt Zugriff auf ausgewählte Datensätze. Bitte prüfen Sie Vertragsstatus, Zugriffsrechte und die relevanten technischen und organisatorischen Maßnahmen.",
  { change_type: "Freelancer mit Zugriff", security_change: "Nein", personal_data: "Ja", customers_affected: "Ja", external_parties: "Ja" },
  "High", ["AVV", "TOM"]);

run("Fall 9 – HIGH API-Änderung mit Datenübertragung",
  "Betreff: Neue API zwischen CRM und Kundenportal. zwischen dem CRM-System und dem Kundenportal wird eine neue API eingerichtet. Über die Schnittstelle werden künftig personenbezogene Kundendaten wie Name, E-Mail-Adresse und Vertragsinformationen automatisch übertragen. Es wird kein neuer Dienstleister eingebunden. Bitte prüfen Sie den Datenfluss, die Zugriffskontrollen sowie die technischen und organisatorischen Maßnahmen.",
  { change_type: "API-Änderung", security_change: "Ja", personal_data: "Ja", customers_affected: "Ja", external_parties: "Nein" },
  "High", ["TOM"]);

run("Fall 12 – HIGH Datenschutzvorfall / Sicherheitsereignis",
  "Betreff: Sicherheitsvorfall: Unautorisierter Zugriff auf Kundendaten. heute Morgen wurde ein unautorisierter Zugriff auf das CRM-System festgestellt. Nach aktuellem Stand könnten personenbezogene Kundendaten betroffen sein. Der Zugriff wurde gesperrt und die Untersuchung läuft. Bitte starten Sie unverzüglich den Incident-Prozess und prüfen Sie die erforderliche Datenschutzdokumentation sowie mögliche Anpassungen der technischen und organisatorischen Maßnahmen.",
  { change_type: "Datenschutzvorfall / Sicherheitsereignis", security_change: "Ja", personal_data: "Ja" },
  "High", ["TOM"]);

if (failures.length > 0) {
  console.error(`FEHLGESCHLAGEN: ${failures.length} Fall/Fälle`);
  for (const message of failures) console.error("  - " + message);
  process.exit(1);
}
console.log(`OK: ${passed} Testfälle aus dem Dokument bestanden.`);
