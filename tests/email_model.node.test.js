"use strict";

/*
 * Prüft das lokal trainierte Modell (Naive Bayes über Wort- und Zeichen-n-Gramme)
 * für die E-Mail-Zuordnung. Kern: Umschreibungen werden erkannt, ohne dass bei
 * NICHT erwähnten Feldern falsch geraten wird (Relevanz-Gate).
 *
 * Ausführen:  node tests/email_model.node.test.js
 */

const assert = require("assert");
const path = require("path");
const { classifyEmailFields, extractAffectedSystems, evaluateChange } = require(path.join(__dirname, "..", "script.js"));

let passed = 0;
const failures = [];
function check(name, fn) { try { fn(); passed += 1; } catch (e) { failures.push(`${name}: ${e.message}`); } }

const MAILS = {
  A: "auf den internen Druckservern wird die Drucksoftware auf Version 2.8 aktualisiert. Es werden keine personenbezogenen Daten verarbeitet. Es sind keine Kunden betroffen. Es werden keine externen Dienstleister eingebunden. Zugriffe, Berechtigungen und Sicherheitsmaßnahmen bleiben unverändert.",
  B: "Wir binden ab nächster Woche die Firma Meier IT als neuen Cloud-Anbieter ein. Dort werden die Stammdaten unserer Kunden gespeichert.",
  C: "Das neue Modul wertet Bestellhistorien und Kontaktinformationen der Auftraggeber aus.",
  D: "Wir spielen ein Wartungsrelease der internen Buchhaltung ein; nichts an Zugriffen ändert sich.",
  E: "Die Ablage wird ab sofort mit einem stärkeren Kryptoverfahren geschützt.",
  F: "Unser Hosting-Partner zieht einen weiteren Unterauftragnehmer für den Support hinzu.",
  G: "Das Meeting wurde auf Donnerstag verschoben, die Agenda folgt.",
  H: "Wir überarbeiten das Berechtigungskonzept und vergeben neue Rollen an das Team.",
};

check("A: klare Mail bleibt korrekt (alles Nein, Software-Update ohne Datenbezug)", () => {
  const f = classifyEmailFields("", MAILS.A);
  assert.strictEqual(f.personal_data, "Nein");
  assert.strictEqual(f.customers_affected, "Nein");
  assert.strictEqual(f.external_parties, "Nein");
  assert.strictEqual(f.security_change, "Nein");
  assert.strictEqual(f.change_type, "Software-Update ohne Datenbezug");
});

check("B: Paraphrase (Stammdaten unserer Kunden) wird erkannt", () => {
  const f = classifyEmailFields("", MAILS.B);
  assert.strictEqual(f.personal_data, "Ja");
  assert.strictEqual(f.customers_affected, "Ja");
  assert.strictEqual(f.external_parties, "Ja");
  assert.strictEqual(f.change_type, "Neuer Dienstleister");
});

check("C: Umschreibung -> Personen-/Kundendaten erkannt, KEINE Falsch-Positive", () => {
  const f = classifyEmailFields("", MAILS.C);
  assert.strictEqual(f.personal_data, "Ja");
  assert.strictEqual(f.customers_affected, "Ja");
  assert.notStrictEqual(f.security_change, "Ja");   // nicht angesprochen
  assert.notStrictEqual(f.external_parties, "Ja");  // nicht angesprochen
});

check("D: interne Wartung -> keine Sicherheitsänderung, Software-Update ohne Datenbezug", () => {
  const f = classifyEmailFields("", MAILS.D);
  assert.notStrictEqual(f.security_change, "Ja");
  assert.notStrictEqual(f.personal_data, "Ja");
  assert.notStrictEqual(f.external_parties, "Ja");
});

check("E: Kryptoverfahren -> Sicherheit Ja + Verschlüsselung, sonst keine Falsch-Positive", () => {
  const f = classifyEmailFields("", MAILS.E);
  assert.strictEqual(f.security_change, "Ja");
  assert.strictEqual(f.change_type, "Verschlüsselung geändert");
  assert.notStrictEqual(f.personal_data, "Ja");
  assert.notStrictEqual(f.customers_affected, "Ja");
  assert.notStrictEqual(f.external_parties, "Ja");
});

check("F: Unterauftragnehmer -> Externe Ja + Neuer Subunternehmer", () => {
  const f = classifyEmailFields("", MAILS.F);
  assert.strictEqual(f.external_parties, "Ja");
  assert.strictEqual(f.change_type, "Neuer Subunternehmer");
});

check("G: rein organisatorische Mail -> nichts geraten", () => {
  const f = classifyEmailFields("", MAILS.G);
  assert.strictEqual(Object.keys(f).length, 0, `es wurde etwas gesetzt: ${JSON.stringify(f)}`);
});

check("H: Rollen/Berechtigungen -> Sicherheit Ja + Rechte-/Rollenkonzept geändert", () => {
  const f = classifyEmailFields("", MAILS.H);
  assert.strictEqual(f.security_change, "Ja");
  assert.strictEqual(f.change_type, "Rechte-/Rollenkonzept geändert");
});

// --- Echte Beispiel-Mails (anonymisiert) als End-to-End-Regressionstests ---
const REAL_1 = `Hallo zusammen,
auf den internen Druckservern wird die Drucksoftware auf Version 2.8 aktualisiert.
Die Aktualisierung dient ausschließlich der Fehlerbehebung und Stabilität. Es werden keine personenbezogenen Daten verarbeitet. Es sind keine Kunden betroffen. Es werden keine externen Dienstleister eingebunden. Zugriffe, Berechtigungen und Sicherheitsmaßnahmen bleiben unverändert.
Viele Grüße
IT-Abteilung`;

const REAL_2 = `Hallo zusammen,
ab dem 01.08.2026 wird für unser Kundenportal ein neuer Hosting-Dienstleister eingesetzt.
Der Dienstleister erhält Zugriff auf personenbezogene Kundendaten, darunter Namen, E-Mail-Adressen und Vertragsdaten. Vor der Inbetriebnahme muss ein neuer Auftragsverarbeitungsvertrag abgeschlossen werden. Bitte prüfen Sie außerdem die technischen und organisatorischen Maßnahmen und dokumentieren Sie den neuen Dienstleister.
Viele Grüße
Einkauf & Datenschutz`;

function evaluateMail(body) {
  const fields = classifyEmailFields("", body);
  const change = Object.assign(
    { change_id: "REAL", date: "2026-01-01", description: body, affected_systems: extractAffectedSystems(body), number_of_customers: 0 },
    fields
  );
  return { fields, result: evaluateChange(change) };
}

check("Reale Mail 1 (Druckserver-Update) -> Low, alles Nein", () => {
  const { fields, result } = evaluateMail(REAL_1);
  assert.strictEqual(fields.personal_data, "Nein");
  assert.strictEqual(fields.customers_affected, "Nein");
  assert.strictEqual(fields.external_parties, "Nein");
  assert.strictEqual(fields.security_change, "Nein");
  assert.strictEqual(fields.change_type, "Software-Update ohne Datenbezug");
  assert.strictEqual(result.impact_level, "Low");
});

check("Reale Mail 2 (neuer Hosting-Dienstleister mit Kundendaten) -> High + AVV/TOM/Kundeninfo", () => {
  const { fields, result } = evaluateMail(REAL_2);
  assert.strictEqual(fields.personal_data, "Ja");
  assert.strictEqual(fields.customers_affected, "Ja");
  assert.strictEqual(fields.external_parties, "Ja");
  assert.strictEqual(fields.change_type, "Neuer Dienstleister");
  assert.strictEqual(result.impact_level, "High");
  assert.ok(result.affected_documents.includes("AVV"), "AVV erwartet");
  assert.ok(result.affected_documents.includes("TOM"), "TOM erwartet");
  assert.ok(result.affected_documents.includes("Kundeninformation"), "Kundeninformation erwartet");
});

if (failures.length > 0) {
  console.error(`FEHLGESCHLAGEN: ${failures.length} Fall/Fälle`);
  for (const message of failures) console.error("  - " + message);
  process.exit(1);
}
console.log(`OK: ${passed} Modell-Fälle bestanden.`);
