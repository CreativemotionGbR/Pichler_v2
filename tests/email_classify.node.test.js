import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { evaluateChange } from "../js/rules-engine.js";
import { loadScriptTestApi } from "./helpers/load-script-test-api.js";

const { classifyEmailFields, extractAffectedSystems } = await loadScriptTestApi();
const rules = JSON.parse(
  await readFile(new URL("../data/rules.json", import.meta.url), "utf8")
);

const druckserverMail = [
  "auf den internen Druckservern wird die Drucksoftware auf Version 2.8 aktualisiert.",
  "Die Aktualisierung dient ausschließlich der Fehlerbehebung und Stabilität.",
  "Es werden keine personenbezogenen Daten verarbeitet. Es sind keine Kunden betroffen.",
  "Es werden keine externen Dienstleister eingebunden.",
  "Zugriffe, Berechtigungen und Sicherheitsmaßnahmen bleiben unverändert.",
].join(" ");

test("Druckserver-Update: alle Felder korrekt verneint", () => {
  const fields = classifyEmailFields("Drucksoftware Update", druckserverMail);
  assert.equal(fields.security_change, "Nein");
  assert.equal(fields.personal_data, "Nein");
  assert.equal(fields.customers_affected, "Nein");
  assert.equal(fields.external_parties, "Nein");
  assert.equal(fields.change_type, "Software-Update ohne Datenbezug");
});

test("Druckserver-Update: betroffene Systeme werden erkannt", () => {
  const systems = extractAffectedSystems(druckserverMail);
  assert.match(systems, /Druckserver/);
  assert.match(systems, /Drucksoftware/);
});

test("Druckserver-Update: Gesamtbewertung ist Low", () => {
  const fields = classifyEmailFields("", druckserverMail);
  const change = Object.assign(
    {
      change_id: "CHG-005",
      date: "2026-07-13",
      description: druckserverMail,
      number_of_customers: 0,
    },
    fields
  );
  const result = evaluateChange(change, rules);
  assert.equal(result.impact_level, "Low");
  assert.deepEqual(Array.from(result.affected_documents), ["Änderungshistorie"]);
});

test("Verschlüsselungsumstellung wird als Sicherheitsänderung erkannt", () => {
  const mail =
    "Wir stellen die Verschlüsselung der Datenbank auf AES-256 um. Die Zugriffsrechte werden angepasst.";
  const fields = classifyEmailFields("Verschlüsselung", mail);
  assert.equal(fields.security_change, "Ja");
  assert.equal(fields.change_type, "Verschlüsselung geändert");
});

test("Neuer Dienstleister mit Kundendaten füllt AVV-relevante Felder", () => {
  const mail =
    "Wir setzen einen neuen Cloud-Dienstleister ein, der Kundendaten verarbeitet. Kunden sind betroffen.";
  const fields = classifyEmailFields("Neuer Anbieter", mail);
  assert.equal(fields.change_type, "Neuer Dienstleister");
  assert.equal(fields.external_parties, "Ja");
  assert.equal(fields.personal_data, "Ja");
  assert.equal(fields.customers_affected, "Ja");
});
