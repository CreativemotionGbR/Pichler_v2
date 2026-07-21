"use strict";

/*
 * Prüft die lokale Ähnlichkeits-Klassifikation (kNN / nächster Schwerpunkt),
 * die greift, wenn die deterministischen Regeln nicht anschlagen – also bei
 * Umschreibungen, in denen die exakten Schlüsselwörter fehlen.
 *
 * Kernidee: lieber "Unklar"/keine Zuordnung als eine selbstbewusst falsche.
 *
 * Ausführen:  node tests/email_similarity.node.test.js
 */

const assert = require("assert");
const path = require("path");

const { classifyEmailFields } = require(path.join(__dirname, "..", "script.js"));

let passed = 0;
const failures = [];
function check(name, fn) {
  try { fn(); passed += 1; } catch (e) { failures.push(`${name}: ${e.message}`); }
}

const MAILS = {
  A: "auf den internen Druckservern wird die Drucksoftware auf Version 2.8 aktualisiert. Es werden keine personenbezogenen Daten verarbeitet. Es sind keine Kunden betroffen. Es werden keine externen Dienstleister eingebunden. Zugriffe, Berechtigungen und Sicherheitsmaßnahmen bleiben unverändert.",
  B: "Wir binden ab nächster Woche die Firma Meier IT als neuen Cloud-Anbieter ein. Dort werden die Stammdaten unserer Kunden gespeichert.",
  C: "Das neue Modul wertet Bestellhistorien und Kontaktinformationen der Auftraggeber aus.",
  D: "Wir spielen ein Wartungsrelease der internen Buchhaltung ein; nichts an Zugriffen ändert sich.",
  E: "Die Ablage wird ab sofort mit einem stärkeren Kryptoverfahren geschützt.",
  F: "Unser Hosting-Partner zieht einen weiteren Unterauftragnehmer für den Support hinzu.",
};

// A: klare Formulierung – Regeln entscheiden alles (unverändert korrekt).
check("A: klare Mail bleibt korrekt (alles Nein, Software-Update ohne Datenbezug)", () => {
  const f = classifyEmailFields("", MAILS.A);
  assert.strictEqual(f.personal_data, "Nein");
  assert.strictEqual(f.customers_affected, "Nein");
  assert.strictEqual(f.external_parties, "Nein");
  assert.strictEqual(f.security_change, "Nein");
  assert.strictEqual(f.change_type, "Software-Update ohne Datenbezug");
});

// B: Umschreibung ohne die exakten Wörter -> Ähnlichkeit erkennt es trotzdem.
check("B: Paraphrase (Stammdaten unserer Kunden) wird korrekt zugeordnet", () => {
  const f = classifyEmailFields("", MAILS.B);
  assert.strictEqual(f.personal_data, "Ja");
  assert.strictEqual(f.customers_affected, "Ja");
  assert.strictEqual(f.external_parties, "Ja");
  assert.strictEqual(f.change_type, "Neuer Dienstleister");
});

// E: "Kryptoverfahren" -> Sicherheitsänderung + Verschlüsselung.
check("E: Kryptoverfahren wird als Verschlüsselungsänderung erkannt", () => {
  const f = classifyEmailFields("", MAILS.E);
  assert.strictEqual(f.security_change, "Ja");
  assert.strictEqual(f.change_type, "Verschlüsselung geändert");
});

// F: Subunternehmer über Hosting-Partner.
check("F: Unterauftragnehmer -> Neuer Subunternehmer + externe Beteiligte", () => {
  const f = classifyEmailFields("", MAILS.F);
  assert.strictEqual(f.external_parties, "Ja");
  assert.strictEqual(f.change_type, "Neuer Subunternehmer");
});

// C + D: schwierige/mehrdeutige Fälle dürfen NICHT selbstbewusst falsch raten.
check("C: mehrdeutige Mail erzeugt keinen falschen Änderungstyp", () => {
  const f = classifyEmailFields("", MAILS.C);
  assert.ok(!f.change_type, `change_type sollte offen bleiben, war: ${f.change_type}`);
});

check("D: interne Wartung wird nicht als Sicherheitsänderung Ja gewertet", () => {
  const f = classifyEmailFields("", MAILS.D);
  assert.notStrictEqual(f.security_change, "Ja");
  assert.ok(!f.change_type, `change_type sollte offen bleiben, war: ${f.change_type}`);
});

if (failures.length > 0) {
  console.error(`FEHLGESCHLAGEN: ${failures.length} Fall/Fälle`);
  for (const message of failures) console.error("  - " + message);
  process.exit(1);
}
console.log(`OK: ${passed} Ähnlichkeits-Klassifikations-Fälle bestanden.`);
