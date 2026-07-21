function classifyPersonalData(text) {
  if (/(?:keine|keinen|ohne)\s+(?:verarbeitung\s+)?personenbezogene[nr]?\s+daten|personenbezogene[nr]?\s+daten.{0,50}(?:nicht|keine|keinen)\s+(?:verarbeitet|gespeichert|übertragen|genutzt|betroffen)/i.test(text)) return "Nein";
  if (/(?:verarbeitet|speichert|überträgt|nutzt|enthält|zugriff\s+auf).{0,50}personenbezogene[nr]?\s+daten|personenbezogene[nr]?\s+daten.{0,50}(?:verarbeitet|gespeichert|übertragen|genutzt|betroffen)/i.test(text)) return "Ja";
  return "Unklar";
}

function classifyCustomers(text) {
  if (/(?:keine|keinen)\s+(?:kunden|kundendaten).{0,30}(?:betroffen|beeinträchtigt)|(?:kunden|kundendaten).{0,40}(?:nicht|keine|keinen)\s+(?:betroffen|beeinträchtigt)/i.test(text)) return "Nein";
  if (/(?:kunden|kundendaten).{0,30}(?:sind|werden)?\s*(?:betroffen|beeinträchtigt)|betrifft.{0,30}(?:kunden|kundendaten)/i.test(text)) return "Ja";
  return "Unklar";
}

function hasExternalNegation(text) {
  return /(kein|keine|keinen).{0,80}(neuer|neuen|neue|änderung|wechsel|zusätzlicher|weiterer).{0,80}(dienstleister|subunternehmer|unterauftragnehmer|anbieter|provider)/i.test(text) ||
    /(dienstleister|subunternehmer|unterauftragnehmer|anbieter|provider).{0,80}(ändert sich nicht|ändern sich nicht|nicht geändert|nicht verändert|bleibt unverändert|bleiben unverändert|keine änderung)/i.test(text);
}

function mentionsNewSubprocessor(text) {
  return !hasExternalNegation(text) && (/(neuer|neuen|neue|zusätzlicher|weiterer|eingeführt|beauftragt|eingesetzt).{0,80}(subunternehmer|unterauftragnehmer)/i.test(text) ||
    /(subunternehmer|unterauftragnehmer).{0,80}(neu|hinzu|eingeführt|beauftragt|eingesetzt)/i.test(text));
}

function mentionsNewProvider(text) {
  return !hasExternalNegation(text) && (/(neuer|neuen|neue|zusätzlicher|weiterer|eingeführt|beauftragt|eingesetzt).{0,80}(dienstleister|anbieter|provider)/i.test(text) ||
    /(dienstleister|anbieter|provider).{0,80}(neu|hinzu|eingeführt|beauftragt|eingesetzt)/i.test(text));
}

function mentionsProviderChange(text) {
  return !hasExternalNegation(text) && /(wechsel|ersetzt|ablösung|abgelöst).{0,60}(dienstleister|anbieter|provider)|(dienstleister|anbieter|provider).{0,60}(wechselt|gewechselt|ersetzt|abgelöst)/i.test(text);
}

function mentionsFreelancerAccess(text) {
  return !hasExternalNegation(text) && /(freelancer|freiberufler|externe[rn]?).{0,60}(zugriff|berechtigung)|(zugriff|berechtigung).{0,60}(freelancer|freiberufler)/i.test(text);
}

function classifyExternalParties(text) {
  if (hasExternalNegation(text) || /(?:keine|ohne)\s+externe[nr]?\s+(?:beteiligte|dienstleister|zugriffe?)/i.test(text)) return "Nein";
  if (mentionsNewSubprocessor(text) || mentionsNewProvider(text) || mentionsProviderChange(text) || mentionsFreelancerAccess(text)) return "Ja";
  return "Unklar";
}

function classifySecurityChange(text) {
  if (/(?:keine|keinen|ohne)\s+(?:(?:änderung(?:en)?\s+(?:an|bei)\s+)?(?:zugriffen?|berechtigungen?|rollen?|rechten?|sicherheitsmaßnahmen|verschlüsselung|backups?|protokollierung)|sicherheitsänderung(?:en)?)|(?:zugriffe?|berechtigungen?|rollen?|rechte|sicherheitsmaßnahmen|verschlüsselung|backups?|protokollierung).{0,50}(?:unverändert|nicht geändert|nicht verändert|bleibt unverändert|bleiben unverändert)/i.test(text)) return "Nein";
  if (/(?:ändert|geändert|angepasst|eingeführt|entfernt|umgestellt|deaktiviert|aktiviert).{0,60}(?:zugriffe?|berechtigungen?|rollen?|rechte|sicherheitsmaßnahmen|verschlüsselung|backups?|protokollierung|mfa|login)|(?:zugriffe?|berechtigungen?|rollen?|rechte|sicherheitsmaßnahmen|verschlüsselung|backups?|protokollierung|mfa|login).{0,60}(?:ändert|geändert|angepasst|eingeführt|entfernt|umgestellt|deaktiviert|aktiviert)/i.test(text)) return "Ja";
  return "Unklar";
}

function detectChangeType(text, facts) {
  if (/(datenschutzvorfall|sicherheitsvorfall|sicherheitsereignis|datenpanne|unautorisiert(?:er|en)?\s+zugriff|datenverlust)/i.test(text)) return "Datenschutzvorfall / Sicherheitsereignis";
  if (mentionsProviderChange(text)) return "Wechsel Dienstleister";
  if (mentionsNewSubprocessor(text)) return "Neuer Subunternehmer";
  if (mentionsNewProvider(text)) return "Neuer Dienstleister";
  if (mentionsFreelancerAccess(text)) return "Freelancer mit Zugriff";
  if (/(system|tool|anwendung|archivsystem).{0,60}(abgeschaltet|stillgelegt|deaktiviert|außer betrieb|nicht mehr genutzt)|(abschaltung|stilllegung|außerbetriebnahme).{0,60}(system|tool|anwendung|archivsystem)/i.test(text)) return "System wird abgeschaltet";
  if (/(api|schnittstelle|endpunkt).{0,60}(entfernt|deaktiviert|abgeschaltet|stillgelegt|entfällt)|(entfernung|abschaltung|stilllegung).{0,60}(api|schnittstelle|endpunkt)/i.test(text)) return "API entfernt";
  if (/(api|schnittstelle|endpunkt).{0,60}(geändert|angepasst|erweitert|neu|neue datenfelder)|(änderung|anpassung|erweiterung).{0,60}(api|schnittstelle|endpunkt)/i.test(text)) return "API-Änderung";
  if (facts.security_change === "Ja" && /verschlüsselung.{0,60}(geändert|angepasst|eingeführt|entfernt|umgestellt)|(änderung|anpassung|umstellung).{0,60}verschlüsselung/i.test(text)) return "Verschlüsselung geändert";
  if (facts.security_change === "Ja" && /(rechte|rollen|berechtigungen).{0,60}(geändert|angepasst|eingeführt|entfernt)|(änderung|anpassung).{0,60}(rechte|rollen|berechtigungen)/i.test(text)) return "Rechte-/Rollenkonzept geändert";
  if (facts.security_change === "Ja" && /(backup|datensicherung|wiederherstellung).{0,60}(geändert|angepasst|umgestellt|verlegt)|(änderung|anpassung|umstellung).{0,60}(backup|datensicherung|wiederherstellung)/i.test(text)) return "Backup geändert";
  if (/(infrastruktur|server|hosting|firewall|netzwerk).{0,60}(geändert|angepasst|umgestellt|migriert)|(änderung|anpassung|umstellung|migration).{0,60}(infrastruktur|server|hosting|firewall|netzwerk)/i.test(text)) return "Infrastrukturänderung";
  if (/(software[-\s]?update|update|bugfix|patch|wartung)/i.test(text)) {
    if (facts.personal_data === "Nein") return "Software-Update ohne Datenbezug";
    if (facts.personal_data === "Ja") return "Software-Update mit Datenbezug";
  }
  if (!/(kein|keine|keinen|ohne).{0,30}(neues|neuen|neue).{0,30}(system|tool|anwendung)/i.test(text) && /(neues|neuen|neue).{0,30}(system|tool|anwendung)/i.test(text)) return "Neues System";
  return "Sonstiges / Unklar";
}

function extractAffectedSystems(originalText) {
  const labelled = originalText.match(/(?:betroffene(?:s|n)?\s+systeme?|system)\s*:\s*([^\r\n.;]+)/i);
  if (labelled) return labelled[1].trim();
  const matches = originalText.match(/\b(?:archivsystem|ticketsystem|crm|api|schnittstelle|backup-system|server|firewall|netzwerk)\b/gi);
  return matches ? [...new Set(matches)].join(", ") : "Aus E-Mail zu prüfen";
}

export function classifyEmail(emailText) {
  const originalText = String(emailText || "").trim();
  const text = originalText.toLowerCase();
  const classificationNotes = [];
  const facts = {
    security_change: classifySecurityChange(text),
    personal_data: classifyPersonalData(text),
    customers_affected: classifyCustomers(text),
    external_parties: classifyExternalParties(text),
  };
  const changeType = detectChangeType(text, facts);
  const affectedSystems = extractAffectedSystems(originalText);

  for (const [field, value] of Object.entries(facts)) {
    if (value === "Unklar") classificationNotes.push(`${field}: keine eindeutige Aussage erkannt`);
  }
  if (changeType === "Sonstiges / Unklar") classificationNotes.push("change_type: kein eindeutiger Änderungstyp erkannt");
  if (affectedSystems === "Aus E-Mail zu prüfen") classificationNotes.push("affected_systems: kein eindeutiges System erkannt");

  return {
    change_type: changeType,
    ...facts,
    affected_systems: affectedSystems,
    classification_notes: classificationNotes,
  };
}
