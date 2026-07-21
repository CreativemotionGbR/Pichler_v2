import assert from "node:assert/strict";
import test from "node:test";
import { classifyEmail } from "../js/email-classifier.js";

test("Negationen werden als Nein erkannt und nicht als positive Signale", () => {
  const result = classifyEmail("Internes Software-Update. Keine personenbezogenen Daten. Keine Kunden betroffen. Keine externen Beteiligten. Keine Sicherheitsänderung.");
  assert.equal(result.change_type, "Software-Update ohne Datenbezug");
  assert.equal(result.personal_data, "Nein");
  assert.equal(result.customers_affected, "Nein");
  assert.equal(result.external_parties, "Nein");
  assert.equal(result.security_change, "Nein");
});

test("Systemabschaltung wird strukturiert erkannt, aber nicht bewertet", () => {
  const result = classifyEmail("Abschaltung eines alten internen Archivsystems. Kein neues System und kein neuer Dienstleister.");
  assert.equal(result.change_type, "System wird abgeschaltet");
  assert.equal(result.external_parties, "Nein");
  assert.equal("impact_level" in result, false);
  assert.equal("affected_documents" in result, false);
  assert.equal("measures" in result, false);
});

test("Neuer Dienstleister mit Zugriff auf personenbezogene Daten wird vorbelegt", () => {
  const result = classifyEmail("Ein neuer externer Dienstleister erhält Zugriff auf personenbezogene Daten im CRM.");
  assert.equal(result.change_type, "Neuer Dienstleister");
  assert.equal(result.external_parties, "Ja");
  assert.equal(result.personal_data, "Ja");
  assert.equal(result.affected_systems, "CRM");
});

test("Reine Erwähnung von Sicherheitsbegriffen setzt keine Sicherheitsänderung", () => {
  const result = classifyEmail("Die Dokumentation erwähnt TOM, Backup und Protokollierung, beschreibt aber keine Änderung.");
  assert.equal(result.security_change, "Unklar");
  assert.notEqual(result.change_type, "Verschlüsselung geändert");
});
