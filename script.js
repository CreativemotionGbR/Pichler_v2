(() => {
  "use strict";

  const STORAGE_KEY = "dsgvoChangeHistory.v2";
  const TOM_STORAGE_KEY = "dsgvo.tom.current";
  const CUSTOMER_AVVS_STORAGE_KEY = "dsgvo.customerAvvs";
  const REQUIRED_FIELDS = [
    "change_id",
    "date",
    "change_type",
    "description",
    "security_change",
    "affected_systems",
    "personal_data",
    "customers_affected",
    "external_parties",
  ];
  const INPUT_FIELDS = [
    ...REQUIRED_FIELDS,
    "source",
    "source_url",
    "number_of_customers",
    "old_text",
    "new_text",
    "notes",
    "email_sender",
    "email_subject",
    "email_received_at",
  ];
  const OUTPUT_FIELDS = [
    "impact_level",
    "gdpr_relevance",
    "affected_documents",
    "measures",
    "customer_information_required",
    "manual_review_required",
    "summary",
    "warnings",
  ];
  const TABLE_COLUMNS = [
    "change_id",
    "date",
    "change_type",
    "impact_level",
    "gdpr_relevance",
    "affected_documents",
    "measures",
    "customer_information_required",
    "manual_review_required",
    "summary",
    "warnings",
  ];
  const DATE_FIELDS = new Set(["date", "saved_at", "email_received_at", "valid_from", "contract_date", "last_review"]);
  const FIELD_LABELS = {
    change_id: "Änderungs-ID",
    date: "Datum",
    change_type: "Änderungstyp",
    description: "Beschreibung",
    security_change: "Sicherheitsänderung",
    affected_systems: "Betroffene Systeme",
    personal_data: "Personenbezogene Daten",
    customers_affected: "Kunden betroffen",
    external_parties: "Externe Beteiligte",
    source: "Quelle",
    source_url: "Quellen-URL",
    number_of_customers: "Anzahl Kunden",
    old_text: "Alter Text",
    new_text: "Neuer Text",
    notes: "Notizen",
    email_sender: "E-Mail-Absender",
    email_subject: "E-Mail-Betreff",
    email_received_at: "E-Mail-Eingang",
    impact_level: "Bewertung",
    gdpr_relevance: "DSGVO-Relevanz",
    affected_documents: "Betroffene Dokumente",
    measures: "Maßnahmen",
    customer_information_required: "Kundeninformation erforderlich",
    manual_review_required: "Manuelle Prüfung erforderlich",
    summary: "Zusammenfassung",
    warnings: "Hinweise",
    saved_at: "Gespeichert am",
    customer_avv_id: "Kunden-AVV-ID",
    customer_id: "Kunden-ID",
    customer_name: "Kunde",
    avv_title: "AVV-Titel",
    avv_version: "AVV-Version",
    contract_date: "Vertragsdatum",
    status: "Status",
    data_categories: "Datenkategorien",
    processor_name: "Auftragsverarbeiter",
    source_file: "Quelldatei",
    file_hash: "Datei-Hash",
    last_review: "Letzte Prüfung",
    review_status: "Prüfstatus",
    action: "Aktion",
  };
  const KNOWN_CHANGE_TYPES = [
    "Neuer Dienstleister",
    "Wechsel Dienstleister",
    "Neuer Subunternehmer",
    "Freelancer mit Zugriff",
    "Software-Update ohne Datenbezug",
    "Software-Update mit Datenbezug",
    "API-Änderung",
    "API entfernt",
    "Infrastrukturänderung",
    "Backup geändert",
    "Rechte-/Rollenkonzept geändert",
    "Verschlüsselung geändert",
    "Neues System",
    "System wird abgeschaltet",
    "Datenschutzvorfall / Sicherheitsereignis",
    "Sonstiges / Unklar",
  ];
  const YES_NO_UNKNOWN = ["Ja", "Nein", "Unklar"];
  const HIGH_CHANGE_TYPES = new Set([
    "Neuer Dienstleister",
    "Wechsel Dienstleister",
    "Neuer Subunternehmer",
    "Freelancer mit Zugriff",
    "API-Änderung",
    "API entfernt",
    "Infrastrukturänderung",
    "Backup geändert",
    "Rechte-/Rollenkonzept geändert",
    "Verschlüsselung geändert",
    "Datenschutzvorfall / Sicherheitsereignis",
  ]);
  const AVV_CHANGE_TYPES = new Set([
    "Neuer Dienstleister",
    "Wechsel Dienstleister",
    "Neuer Subunternehmer",
    "Freelancer mit Zugriff",
  ]);
  const TOM_CHANGE_TYPES = new Set([
    "Backup geändert",
    "Rechte-/Rollenkonzept geändert",
    "Verschlüsselung geändert",
    "Infrastrukturänderung",
    "Datenschutzvorfall / Sicherheitsereignis",
  ]);
  const FALLBACK_SAMPLE_CHANGES = [
    {
      change_id: "CHG-001",
      date: "2026-06-09",
      change_type: "Neuer Dienstleister",
      description: "Ein neuer lokaler IT-Dienstleister verarbeitet Kundendaten für das Ticketsystem.",
      security_change: "Nein",
      affected_systems: "Ticketsystem",
      personal_data: "Ja",
      customers_affected: "Ja",
      external_parties: "Ja",
      source: "Fallback-Beispieldaten",
      source_url: "",
      number_of_customers: "12",
      old_text: "",
      new_text: "",
      notes: "Anonymisierte Beispieldaten",
      email_sender: "",
      email_subject: "",
      email_received_at: "",
    },
    {
      change_id: "CHG-002",
      date: "2026-06-09",
      change_type: "Software-Update ohne Datenbezug",
      description: "Update einer internen Bibliothek ohne Verarbeitung personenbezogener Daten.",
      security_change: "Nein",
      affected_systems: "Build-System",
      personal_data: "Nein",
      customers_affected: "Nein",
      external_parties: "Nein",
      source: "Fallback-Beispieldaten",
      source_url: "",
      number_of_customers: "0",
      old_text: "",
      new_text: "",
      notes: "Low-Beispiel",
      email_sender: "",
      email_subject: "",
      email_received_at: "",
    },
    {
      change_id: "CHG-003",
      date: "2026-06-09",
      change_type: "API-Änderung",
      description: "CRM API überträgt personenbezogene Kundendaten an ein externes System.",
      security_change: "Ja",
      affected_systems: "CRM API",
      personal_data: "Ja",
      customers_affected: "Ja",
      external_parties: "Ja",
      source: "Fallback-Beispieldaten",
      source_url: "",
      number_of_customers: "5",
      old_text: "",
      new_text: "",
      notes: "API-Beispiel",
      email_sender: "",
      email_subject: "",
      email_received_at: "",
    },
  ];

  let history = [];
  let currentTom = null;
  let customerAvvs = [];
  let selectedCustomerAvvId = "";
  let lastEvaluation = null;
  let tomPreviewUrl = "";
  let avvPreviewUrl = "";

  const $ = (id) => document.getElementById(id);
  const form = $("changeForm");

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    populateSelect("change_type", KNOWN_CHANGE_TYPES);
    populateSelect("security_change", YES_NO_UNKNOWN, "Nein");
    populateSelect("personal_data", YES_NO_UNKNOWN, "Nein");
    populateSelect("customers_affected", YES_NO_UNKNOWN, "Nein");
    populateSelect("external_parties", YES_NO_UNKNOWN, "Nein");
    $("date").value = formatDateForDisplay(new Date().toISOString().slice(0, 10));
    $("source").value = "Manuelle Eingabe";

    if (!isLocalStorageAvailable()) {
      showMessage("storageWarning", "localStorage ist nicht verfügbar. Bewertungen funktionieren, aber gespeicherte Daten bleiben nach dem Schließen möglicherweise nicht erhalten.", "warning");
    }

    history = loadHistory();
    currentTom = loadTom();
    customerAvvs = loadCustomerAvvs();
    renderHistory();
    renderTom();
    renderCustomerAvvs();
    loadWebScanResults();
    bindEvents();
    if (history.length === 0) loadSampleData(true);
  }

  function bindEvents() {
    $("evaluateBtn").addEventListener("click", evaluateCurrentForm);
    $("saveBtn").addEventListener("click", saveLastEvaluation);
    $("resetFormBtn").addEventListener("click", resetForm);
    $("loadSamplesBtn").addEventListener("click", loadSampleData);
    $("csvUpload").addEventListener("change", importCsvFile);
    $("exportJsonBtn").addEventListener("click", exportJson);
    $("exportCsvBtn").addEventListener("click", exportCsv);
    $("clearDataBtn").addEventListener("click", clearLocalData);
    $("applyEmailTextBtn").addEventListener("click", applyEmailText);
    $("emlUpload").addEventListener("change", importEmlFile);
    $("tomPdfUpload").addEventListener("change", importTomPdf);
    $("saveTomBtn").addEventListener("click", saveTomFromForm);
    $("markTomAffectedBtn").addEventListener("click", markTomAsAffected);
    $("focusTomTextBtn").addEventListener("click", () => $("tom_current_text").focus());
    $("exportTomCsvBtn").addEventListener("click", exportTomCsv);
    $("exportTomJsonBtn").addEventListener("click", exportTomJson);
    $("deleteTomBtn").addEventListener("click", deleteTom);
    $("customerAvvCsvUpload").addEventListener("change", importCustomerAvvCsvFile);
    $("customerAvvPdfUpload").addEventListener("change", importCustomerAvvPdf);
    $("exportCustomerAvvsCsvBtn").addEventListener("click", exportCustomerAvvsCsv);
    $("customerAvvSearch").addEventListener("input", renderCustomerAvvs);
    $("customerAvvStatusFilter").addEventListener("change", renderCustomerAvvs);
    $("reloadWebScanBtn").addEventListener("click", loadWebScanResults);
  }

  function populateSelect(id, options, selectedValue) {
    const select = $(id);
    select.innerHTML = "";
    options.forEach((option) => {
      const item = document.createElement("option");
      item.value = option;
      item.textContent = option;
      if (option === selectedValue) item.selected = true;
      select.appendChild(item);
    });
  }

  function isLocalStorageAvailable() {
    try {
      const key = "__dsgvo_test__";
      localStorage.setItem(key, "1");
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadHistory() {
    if (!isLocalStorageAvailable()) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      showMessage("storageWarning", "Gespeicherte lokale Daten konnten nicht gelesen werden. Bitte exportiere vorhandene Daten regelmäßig als Sicherung.", "warning");
      return [];
    }
  }

  function persistHistory() {
    if (!isLocalStorageAvailable()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function getFormData() {
    const data = {};
    INPUT_FIELDS.forEach((field) => {
      const element = $(field);
      data[field] = element ? getFieldValue(field, element.value) : "";
    });
    return data;
  }

  function getFieldValue(field, value) {
    const text = String(value || "").trim();
    return DATE_FIELDS.has(field) ? normalizeDateInput(text) : text;
  }

  function setFormData(data) {
    INPUT_FIELDS.forEach((field) => {
      const element = $(field);
      if (!element) return;
      element.value = DATE_FIELDS.has(field) ? formatDateForDisplay(data[field]) : data[field] || "";
    });
  }

  function normalizeDateInput(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    const germanMatch = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(.*)$/);
    if (germanMatch) {
      const [, day, month, year, rest] = germanMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}${rest || ""}`;
    }
    return text;
  }

  function formatDateForDisplay(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    if (/^\d{1,2}\.\d{1,2}\.\d{4}/.test(text)) return text;

    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/);
    if (isoMatch) {
      const [, year, month, day, hour, minute] = isoMatch;
      return `${day}.${month}.${year}${hour && minute ? ` ${hour}:${minute}` : ""}`;
    }

    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) {
      const date = parsed.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
      const hasTime = /\d{1,2}:\d{2}/.test(text);
      return hasTime ? `${date} ${parsed.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}` : date;
    }

    return text;
  }

  function normalizeChange(change) {
    const normalized = {};
    INPUT_FIELDS.forEach((field) => {
      const value = String(change[field] ?? "").trim();
      normalized[field] = DATE_FIELDS.has(field) ? normalizeDateInput(value) : value;
    });
    return normalized;
  }

  function validateChange(change) {
    const errors = [];
    REQUIRED_FIELDS.forEach((field) => {
      if (!change[field]) errors.push(`Pflichtfeld '${fieldLabel(field)}' fehlt.`);
    });
    if (change.date && Number.isNaN(Date.parse(`${change.date}T00:00:00`))) {
      errors.push("Pflichtfeld 'Datum' enthält kein gültiges Datum.");
    }
    ["security_change", "personal_data", "customers_affected", "external_parties"].forEach((field) => {
      if (change[field] && !YES_NO_UNKNOWN.includes(change[field])) {
        errors.push(`Feld '${fieldLabel(field)}' muss Ja, Nein oder Unklar sein.`);
      }
    });
    if (change.number_of_customers) {
      const number = Number(change.number_of_customers);
      if (!Number.isFinite(number) || number < 0) {
        errors.push("Feld 'Anzahl Kunden' muss eine nicht-negative Zahl sein.");
      }
    }
    return errors;
  }

  function evaluateCurrentForm() {
    const change = normalizeChange(getFormData());
    const errors = validateChange(change);
    if (errors.length > 0) {
      lastEvaluation = null;
      $("saveBtn").disabled = true;
      showMessage("validationErrors", errors.join("<br>"), "danger");
      renderEmptyResult("Bitte korrigiere die Validierungsfehler und bewerte erneut.");
      return;
    }
    hideMessage("validationErrors");
    lastEvaluation = { ...change, ...evaluateChange(change) };
    renderResult(lastEvaluation);
    $("saveBtn").disabled = false;
  }

  function evaluateChange(change) {
    const warnings = [];
    let score = 1;
    const changeType = change.change_type;
    const customerCount = Number(change.number_of_customers || 0);

    if (change.external_parties === "Ja" && change.personal_data === "Ja") score = Math.max(score, 3);
    if (HIGH_CHANGE_TYPES.has(changeType)) score = Math.max(score, 3);
    if (change.customers_affected === "Ja" && customerCount > 10) score = Math.max(score, 3);

    const gdprFields = [change.security_change, change.personal_data, change.customers_affected, change.external_parties];
    if (gdprFields.includes("Unklar")) score = Math.max(score, 2);
    if (!KNOWN_CHANGE_TYPES.includes(changeType) || changeType === "Sonstiges / Unklar") {
      score = Math.max(score, 2);
      warnings.push("Änderungstyp ist unbekannt oder unklar; manuelle Prüfung erforderlich.");
    }
    if (
      change.personal_data === "Nein" &&
      change.external_parties === "Nein" &&
      change.customers_affected === "Nein" &&
      change.security_change === "Nein" &&
      score === 1
    ) {
      score = 1;
    }
    if (change.old_text && change.new_text && change.old_text === change.new_text) {
      warnings.push("Alter und neuer Text sind identisch; keine Textänderung erkannt.");
    }

    const impact = score === 3 ? "High" : score === 2 ? "Medium" : "Low";
    const avv = isAvvAffected(change);
    const tom = isTomAffected(change);
    const customerInfo = impact === "High" && change.customers_affected === "Ja";
    const documents = ["Änderungshistorie"];
    if (avv) documents.push("AVV");
    if (tom) documents.push("TOM");
    if (customerInfo) documents.push("Kundeninformation");
    if (change.change_type === "Datenschutzvorfall / Sicherheitsereignis") documents.push("Incident-Dokumentation");

    const measures = deriveMeasures(change, documents, impact, customerInfo);
    const manualReview = impact !== "Low" || warnings.length > 0;

    return {
      impact_level: impact,
      gdpr_relevance: impact === "Low" ? "Keine direkte DSGVO-Relevanz" : "DSGVO-relevant",
      affected_documents: documents,
      measures,
      customer_information_required: customerInfo,
      manual_review_required: manualReview,
      summary: `${change.change_type} wurde als ${impact} bewertet. Betroffene Dokumente: ${documents.join(", ")}.`,
      warnings,
    };
  }

  function buildSummary(change, impact, documents) {
    const changeType = cleanText(change.change_type || "Nicht angegeben");
    const affectedDocuments = documents.length ? formatList(documents.map(cleanText)) : "keine Dokumente";
    return `${describeChange(changeType)} ${explainImpact(change, impact, changeType)} Betroffene Dokumente sind ${affectedDocuments}.`;
  }

  function describeChange(changeType) {
    const descriptions = {
      "Neuer Dienstleister": "Es wurde ein neuer Dienstleister eingeführt.",
      "Wechsel Dienstleister": "Es wurde ein Dienstleisterwechsel erfasst.",
      "Neuer Subunternehmer": "Es wurde ein neuer Subunternehmer aufgenommen.",
      "Freelancer mit Zugriff": "Es wurde ein Freelancer mit Zugriff auf relevante Systeme erfasst.",
      "Software-Update ohne Datenbezug": "Es wurde ein Software-Update ohne erkennbaren Datenbezug erfasst.",
      "Software-Update mit Datenbezug": "Es wurde ein Software-Update mit Datenbezug erfasst.",
      "API-Änderung": "Es wurde eine API-Änderung erfasst.",
      "API entfernt": "Es wurde die Entfernung einer API erfasst.",
      "Infrastrukturänderung": "Es wurde eine Infrastrukturänderung erfasst.",
      "Backup geändert": "Es wurde eine Änderung am Backup erfasst.",
      "Rechte-/Rollenkonzept geändert": "Es wurde eine Änderung am Rechte- oder Rollenkonzept erfasst.",
      "Verschlüsselung geändert": "Es wurde eine Änderung an der Verschlüsselung erfasst.",
      "Neues System": "Es wurde ein neues System erfasst.",
      "System wird abgeschaltet": "Es wurde die Abschaltung eines Systems erfasst.",
      "Datenschutzvorfall / Sicherheitsereignis": "Es wurde ein Datenschutzvorfall oder Sicherheitsereignis erfasst.",
      "Sonstiges / Unklar": "Es wurde eine sonstige oder noch unklare Änderung erfasst.",
    };
    return descriptions[changeType] || `Es wurde eine Änderung vom Typ '${changeType}' erfasst.`;
  }

  function explainImpact(change, impact, changeType) {
    const reasons = [];
    const customerCount = Number(change.number_of_customers || 0);
    const needsDataProtectionReview = ["Neuer Dienstleister", "Wechsel Dienstleister", "Neuer Subunternehmer", "Freelancer mit Zugriff", "API-Änderung", "API entfernt", "Infrastrukturänderung", "Backup geändert", "Rechte-/Rollenkonzept geändert", "Verschlüsselung geändert", "Datenschutzvorfall / Sicherheitsereignis"].includes(changeType);
    if (change.external_parties === "Ja" && change.personal_data === "Ja") reasons.push("personenbezogene Daten durch externe Beteiligte verarbeitet werden");
    if (change.customers_affected === "Ja" && customerCount > 10) reasons.push("mehr als zehn Kunden betroffen sind");
    if ([change.security_change, change.personal_data, change.customers_affected, change.external_parties].includes("Unklar")) reasons.push("einzelne Angaben noch unklar sind");
    if (changeType === "Sonstiges / Unklar") reasons.push("der Änderungstyp noch nicht eindeutig eingeordnet ist");
    if (!reasons.length && impact === "Low") reasons.push("keine direkten Hinweise auf personenbezogene Daten, externe Beteiligte, Kundenbetroffenheit oder Sicherheitsänderungen vorliegen");
    if (!reasons.length) reasons.push("die erfassten Angaben diese Einstufung auslösen");
    return `Die Änderung wurde als ${translateImpact(impact)} eingestuft, da ${formatList(reasons)}.${needsDataProtectionReview ? " Daher ist eine datenschutzrechtliche Prüfung erforderlich." : ""}`;
  }

  function translateImpact(impact) {
    return { High: "hoch", Medium: "mittel", Low: "niedrig" }[impact] || String(impact || "").toLowerCase();
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/Ãƒâ€ž/g, "Ä")
      .replace(/Ãƒâ€“/g, "Ö")
      .replace(/ÃƒÅ“/g, "Ü")
      .replace(/ÃƒÂ¤/g, "ä")
      .replace(/ÃƒÂ¶/g, "ö")
      .replace(/ÃƒÂ¼/g, "ü")
      .replace(/ÃƒÅ¸/g, "ß")
      .replace(/Ã„/g, "Ä")
      .replace(/Ã–/g, "Ö")
      .replace(/Ãœ/g, "Ü")
      .replace(/Ã¤/g, "ä")
      .replace(/Ã¶/g, "ö")
      .replace(/Ã¼/g, "ü")
      .replace(/ÃŸ/g, "ß");
  }

  function formatList(items) {
    if (items.length <= 1) return items[0] || "";
    return `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
  }

  function isAvvAffected(change) {
    return AVV_CHANGE_TYPES.has(change.change_type) || (change.external_parties === "Ja" && change.personal_data === "Ja");
  }

  function isTomAffected(change) {
    return change.security_change === "Ja" || TOM_CHANGE_TYPES.has(change.change_type);
  }

  function deriveMeasures(change, documents, impact, customerInfo) {
    const measures = [];
    if (documents.includes("AVV")) {
      measures.push("AVV prüfen", "AVV aktualisieren");
      if (["Neuer Dienstleister", "Wechsel Dienstleister"].includes(change.change_type)) measures.push("AVV neu abschließen");
      if (change.change_type === "Neuer Subunternehmer") measures.push("Subunternehmerliste prüfen");
      if (change.personal_data === "Ja") measures.push("Datenarten aktualisieren");
    }
    if (documents.includes("TOM")) {
      measures.push("Zugriffskontrolle prüfen");
      if (["Rechte-/Rollenkonzept geändert", "Datenschutzvorfall / Sicherheitsereignis"].includes(change.change_type)) measures.push("Zugangskontrolle prüfen");
      if (change.change_type === "Verschlüsselung geändert") measures.push("Verschlüsselung prüfen");
      if (change.change_type === "Backup geändert") measures.push("Backup-Konzept prüfen");
      if (change.change_type === "Infrastrukturänderung") measures.push("Netzwerk-/Firewallregel prüfen");
      if (change.change_type === "Datenschutzvorfall / Sicherheitsereignis") measures.push("Protokollierung prüfen");
    }
    if (customerInfo) {
      measures.push("Kundeninformation vorbereiten", "Mail-Template generieren");
    } else {
      measures.push("keine Kundeninfo nötig");
    }
    if (impact === "Medium" || impact === "High") measures.push("interne Info vorbereiten");
    if (impact === "Medium") measures.push("manuelle Prüfung durchführen");
    if (change.email_subject || change.email_sender) measures.push("Anhang prüfen");
    return [...new Set(measures)];
  }

  function saveLastEvaluation() {
    if (!lastEvaluation) return;
    history.push({ ...lastEvaluation, saved_at: new Date().toISOString() });
    persistHistory();
    renderHistory();
    $("saveBtn").disabled = true;
    renderResult(lastEvaluation, "Änderung wurde lokal im Browser gespeichert.");
  }

  function renderResult(result, savedMessage = "") {
    const levelClass = result.impact_level.toLowerCase();
    const guidance = result.impact_level === "High"
      ? "Hohe Relevanz: deutliche Prüfung von AVV/TOM und ggf. Kundeninformation erforderlich."
      : result.impact_level === "Medium"
        ? "Manuelle Prüfung erforderlich."
        : "Low: nur dokumentieren.";

    $("resultBox").className = "result-card";
    $("resultBox").innerHTML = `
      <span class="impact-badge impact-${levelClass}">${escapeHtml(result.impact_level)}</span>
      <div class="result-message ${levelClass}">${escapeHtml(guidance)}</div>
      ${savedMessage ? `<div class="alert warning">${escapeHtml(savedMessage)}</div>` : ""}
      <div><strong>DSGVO-Relevanz:</strong> ${escapeHtml(result.gdpr_relevance)}</div>
      <div><strong>Betroffene Dokumente:</strong>${renderChipList(result.affected_documents)}</div>
      <div><strong>Maßnahmen:</strong>${renderChipList(result.measures)}</div>
      <div><strong>Kundeninformation erforderlich:</strong> ${result.customer_information_required ? "Ja" : "Nein"}</div>
      <div><strong>Manuelle Prüfung erforderlich:</strong> ${result.manual_review_required ? "Ja" : "Nein"}</div>
      <div><strong>Zusammenfassung:</strong> ${escapeHtml(buildSummary(result, result.impact_level, result.affected_documents || []))}</div>
      ${renderAffectedReviewBox(result)}
      ${result.warnings.length ? `<div class="alert warning"><strong>Warnungen:</strong><br>${result.warnings.map(escapeHtml).join("<br>")}</div>` : ""}
    `;
    const customerButton = $("markCustomerAvvsReviewBtn");
    if (customerButton) customerButton.addEventListener("click", () => markRelevantCustomerAvvs(result.impact_level === "High"));
    const tomButton = $("markTomReviewFromResultBtn");
    if (tomButton) tomButton.addEventListener("click", () => markTomAsAffected(result.impact_level === "High"));
  }

  function renderEmptyResult(message) {
    $("resultBox").className = "empty-state";
    $("resultBox").textContent = message;
  }

  function renderChipList(items) {
    return `<ul class="chip-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderHistory() {
    const thead = document.querySelector("#historyTable thead");
    const tbody = document.querySelector("#historyTable tbody");
    thead.innerHTML = `<tr>${TABLE_COLUMNS.map((column) => `<th>${escapeHtml(fieldLabel(column))}</th>`).join("")}</tr>`;
    if (history.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${TABLE_COLUMNS.length}">Noch keine Änderungen gespeichert. Nutze das Formular oder lade Beispieldaten.</td></tr>`;
      return;
    }
    tbody.innerHTML = history.map((entry) => `
      <tr>
        ${TABLE_COLUMNS.map((column) => `<td>${formatTableValue(column, entry[column])}</td>`).join("")}
      </tr>
    `).join("");
  }

  function formatTableValue(column, value) {
    if (column === "impact_level") {
      const level = String(value || "").toLowerCase();
      return `<span class="table-impact impact-${level}">${escapeHtml(value || "")}</span>`;
    }
    if (DATE_FIELDS.has(column)) return escapeHtml(formatDateForDisplay(value));
    if (Array.isArray(value)) return escapeHtml(value.join("; "));
    if (typeof value === "boolean") return value ? "Ja" : "Nein";
    return escapeHtml(value ?? "");
  }

  async function loadSampleData(isAutomatic = false) {
    hideMessage("importErrors");
    try {
      const response = await fetch("data/sample_changes.csv", { cache: "no-store" });
      if (!response.ok) throw new Error("Beispieldatei konnte nicht geladen werden.");
      const text = await response.text();
      importRows(parseCsv(text), "CSV-Beispieldatei");
    } catch (error) {
      const evaluated = FALLBACK_SAMPLE_CHANGES.map((change) => ({ ...change, ...evaluateChange(change), saved_at: new Date().toISOString() }));
      history = [...history, ...evaluated];
      persistHistory();
      renderHistory();
      showMessage("importErrors", isAutomatic ? "Beim direkten Öffnen per Doppelklick konnte data/sample_changes.csv eventuell nicht geladen werden. Fallback-Beispieldaten aus script.js wurden lokal geladen." : "Browser konnte data/sample_changes.csv nicht direkt laden. Fallback-Beispieldaten aus script.js wurden geladen.", "warning");
    }
  }

  function importCsvFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importRows(parseCsv(String(reader.result || "")), file.name);
      } catch (error) {
        showMessage("importErrors", `CSV konnte nicht gelesen werden: ${escapeHtml(error.message)}`, "danger");
      } finally {
        event.target.value = "";
      }
    };
    reader.onerror = () => showMessage("importErrors", "CSV-Datei konnte nicht gelesen werden.", "danger");
    reader.readAsText(file, "utf-8");
  }

  function importRows(rows, sourceName) {
    hideMessage("importErrors");
    if (!rows.length) {
      showMessage("importErrors", "Die CSV-Datei ist leer.", "danger");
      return;
    }
    const missingColumns = REQUIRED_FIELDS.filter((field) => !(field in rows[0]));
    if (missingColumns.length) {
      showMessage("importErrors", `Ungültige CSV-Spalten. Fehlende Pflichtspalten: ${missingColumns.map(fieldLabel).join(", ")}`, "danger");
      return;
    }

    const imported = [];
    const errors = [];
    rows.forEach((row, index) => {
      const change = normalizeChange(row);
      const validationErrors = validateChange(change);
      if (validationErrors.length) {
        errors.push(`Zeile ${index + 2}: ${validationErrors.join("; ")}`);
        return;
      }
      imported.push({ ...change, ...evaluateChange(change), saved_at: new Date().toISOString() });
    });

    if (imported.length) {
      history = [...history, ...imported];
      persistHistory();
      renderHistory();
    }
    const message = `${imported.length} Einträge aus ${escapeHtml(sourceName)} importiert.${errors.length ? " Fehler: " + errors.map(escapeHtml).join(" | ") : ""}`;
    showMessage("importErrors", message, "warning");
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;
    const normalizedText = text.replace(/^\uFEFF/, "");

    for (let i = 0; i < normalizedText.length; i += 1) {
      const char = normalizedText[i];
      const next = normalizedText[i + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") i += 1;
        row.push(cell);
        if (row.some((value) => value.trim() !== "")) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    if (!rows.length) return [];

    const headers = rows[0].map((header) => header.trim());
    return rows.slice(1).map((values) => {
      const object = {};
      headers.forEach((header, index) => {
        object[header] = values[index] || "";
      });
      return object;
    });
  }

  function toCsv(rows, columns) {
    const escapeCell = (value) => {
      const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
      return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    return [columns.join(","), ...rows.map((row) => columns.map((column) => escapeCell(formatExportValue(column, row[column]))).join(","))].join("\n");
  }

  function formatExportValue(column, value) {
    return DATE_FIELDS.has(column) ? formatDateForDisplay(value) : value;
  }

  function formatDisplayValue(column, value) {
    return DATE_FIELDS.has(column) ? formatDateForDisplay(value) : value || "";
  }

  function fieldLabel(field) {
    return FIELD_LABELS[field] || field;
  }

  function exportJson() {
    const backup = {
      exported_at: new Date().toISOString(),
      changes: history,
      change_history: history,
      document_library: [],
      tom: currentTom,
      customer_avvs: customerAvvs,
      versions: history.map((entry) => ({ change_id: entry.change_id, saved_at: entry.saved_at, impact_level: entry.impact_level })),
      change_suggestions: history.map((entry) => ({ change_id: entry.change_id, measures: entry.measures || [] })),
    };
    downloadFile("dsgvo_change_manager_backup.json", JSON.stringify(backup, null, 2), "application/json");
  }

  function exportCsv() {
    downloadFile("dsgvo-change-history.csv", toCsv(history, [...INPUT_FIELDS, ...OUTPUT_FIELDS, "saved_at"]), "text/csv;charset=utf-8");
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function clearLocalData() {
    if (!confirm("Lokale Änderungshistorie wirklich löschen? Exportiere die Daten vorher, wenn du sie behalten möchtest.")) return;
    history = [];
    currentTom = null;
    customerAvvs = [];
    selectedCustomerAvvId = "";
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOM_STORAGE_KEY);
      localStorage.removeItem(CUSTOMER_AVVS_STORAGE_KEY);
    }
    renderHistory();
    renderTom();
    renderCustomerAvvs();
    renderEmptyResult("Lokale Änderungshistorie, TOM-Daten und Kunden-AVVs wurden geleert.");
  }

  function resetForm() {
    form.reset();
    populateSelect("security_change", YES_NO_UNKNOWN, "Nein");
    populateSelect("personal_data", YES_NO_UNKNOWN, "Nein");
    populateSelect("customers_affected", YES_NO_UNKNOWN, "Nein");
    populateSelect("external_parties", YES_NO_UNKNOWN, "Nein");
    $("date").value = formatDateForDisplay(new Date().toISOString().slice(0, 10));
    $("source").value = "Manuelle Eingabe";
    lastEvaluation = null;
    $("saveBtn").disabled = true;
    hideMessage("validationErrors");
    renderEmptyResult("Noch keine Bewertung. Fülle das Formular aus und klicke auf „Änderung bewerten“.");
  }

  function applyEmailText() {
    const text = $("emailText").value.trim();
    if (!text) return;
    const parsed = parseEmlText(text);
    applyEmailData(parsed, text);
  }

  function importEmlFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      applyEmailData(parseEmlText(text), text);
      event.target.value = "";
    };
    reader.onerror = () => showMessage("validationErrors", ".eml-Datei konnte nicht gelesen werden.", "danger");
    reader.readAsText(file, "utf-8");
  }

  function parseEmlText(text) {
    const getHeader = (name) => {
      const regex = new RegExp(`^${name}:\\s*(.+)$`, "im");
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };
    const body = text.includes("\n\n") ? text.split(/\r?\n\r?\n/).slice(1).join("\n\n").trim() : text.trim();
    return {
      sender: getHeader("From") || getHeader("Absender"),
      subject: getHeader("Subject") || getHeader("Betreff"),
      date: getHeader("Date") || getHeader("Datum"),
      body,
    };
  }

  function applyEmailData(parsed, originalText) {
    $("email_sender").value = parsed.sender || $("email_sender").value;
    $("email_subject").value = parsed.subject || $("email_subject").value;
    $("email_received_at").value = formatDateForDisplay(parsed.date) || $("email_received_at").value;
    $("source").value = "Manuell eingefügte E-Mail";
    if (!$("description").value.trim()) $("description").value = parsed.body || originalText;
    if (!$("change_id").value.trim()) $("change_id").value = `EMAIL-${Date.now()}`;
    if (!$("affected_systems").value.trim()) $("affected_systems").value = "Aus E-Mail zu prüfen";
    const combined = `${parsed.subject} ${parsed.body}`.toLowerCase();
    if (combined.includes("dienstleister")) $("change_type").value = "Neuer Dienstleister";
    if (combined.includes("subunternehmer")) $("change_type").value = "Neuer Subunternehmer";
    if (combined.includes("kundendaten") || combined.includes("personenbezogen")) {
      $("personal_data").value = "Ja";
      $("customers_affected").value = "Ja";
    }
    if (["Neuer Dienstleister", "Neuer Subunternehmer"].includes($("change_type").value)) $("external_parties").value = "Ja";
    $("notes").value = [$("notes").value, "E-Mail-Inhalt wurde manuell übernommen; vor dem Speichern prüfen."].filter(Boolean).join("\n");
  }


  function loadTom() {
    if (!isLocalStorageAvailable()) return null;
    try { return JSON.parse(localStorage.getItem(TOM_STORAGE_KEY) || "null"); } catch { return null; }
  }

  function persistTom() {
    if (!isLocalStorageAvailable()) return;
    if (currentTom) localStorage.setItem(TOM_STORAGE_KEY, JSON.stringify(currentTom));
    else localStorage.removeItem(TOM_STORAGE_KEY);
  }

  function loadCustomerAvvs() {
    if (!isLocalStorageAvailable()) return [];
    try { return JSON.parse(localStorage.getItem(CUSTOMER_AVVS_STORAGE_KEY) || "[]"); } catch { return []; }
  }

  function persistCustomerAvvs() {
    if (isLocalStorageAvailable()) localStorage.setItem(CUSTOMER_AVVS_STORAGE_KEY, JSON.stringify(customerAvvs));
  }

  function getTomFromForm() {
    return {
      tom_id: $("tom_id").value.trim() || "TOM-001",
      title: $("tom_title").value.trim() || "Technisch-organisatorische Maßnahmen",
      version: $("tom_version").value.trim(),
      valid_from: normalizeDateInput($("tom_valid_from").value),
      file_name: $("tom_file_name").value.trim(),
      file_type: $("tom_file_type").value.trim(),
      file_size: Number(String($("tom_file_size").value).replace(/[^0-9]/g, "")) || 0,
      hash: $("tom_hash").value.trim(),
      status: $("tom_status").value,
      current_text: $("tom_current_text").value.trim(),
      notes: $("tom_notes").value.trim(),
    };
  }

  function renderTom() {
    const tom = currentTom || {};
    $("tom_id").value = tom.tom_id || "TOM-001";
    $("tom_title").value = tom.title || "Technisch-organisatorische Maßnahmen";
    $("tom_version").value = tom.version || "";
    $("tom_valid_from").value = formatDateForDisplay(tom.valid_from);
    $("tom_file_name").value = tom.file_name || "";
    $("tom_file_type").value = tom.file_type || "";
    $("tom_file_size").value = tom.file_size ? `${tom.file_size} Byte` : "";
    $("tom_hash").value = tom.hash || "";
    $("tom_status").value = tom.status || "Aktiv";
    $("tom_current_text").value = tom.current_text || "";
    $("tom_notes").value = tom.notes || "";
    $("tomSummaryVersion").textContent = tom.version ? `${tom.title || "TOM"} · ${tom.version}` : "Keine TOM gespeichert";
    $("tomSummaryStatus").textContent = `Status: ${tom.status || "–"}`;
  }

  async function importTomPdf(event) {
    const file = event.target.files[0];
    if (!file) return;
    const hash = await calculateSha256(file);
    currentTom = { ...getTomFromForm(), file_name: file.name, file_type: file.type || "application/pdf", file_size: file.size, hash, status: getTomFromForm().status || "Aktiv" };
    persistTom();
    renderTom();
    setPdfPreview(file, "tomPdfPreview", "tomPreviewFallback", "tom");
    showMessage("tomMessage", "TOM-PDF lokal registriert. Metadaten und Hash wurden gespeichert; der PDF-Text kann bei Bedarf manuell eingefügt werden.", "warning");
    event.target.value = "";
  }

  function saveTomFromForm() {
    currentTom = getTomFromForm();
    persistTom();
    renderTom();
    showMessage("tomMessage", "TOM-Metadaten wurden lokal gespeichert.", "warning");
  }

  function markTomAsAffected(highImpact = false) {
    currentTom = { ...(currentTom || getTomFromForm()), status: highImpact ? "Prüfung offen" : "Prüfung offen" };
    persistTom();
    renderTom();
    showMessage("tomMessage", "Aktuelle TOM wurde zur Prüfung markiert.", "warning");
  }

  function deleteTom() {
    if (!confirm("Aktuelle TOM wirklich löschen?")) return;
    currentTom = null;
    persistTom();
    renderTom();
    showMessage("tomMessage", "Aktuelle TOM wurde gelöscht.", "warning");
  }

  function exportTomCsv() { downloadFile("tom_export.csv", toCsv([currentTom || getTomFromForm()], ["tom_id","title","version","valid_from","file_name","file_type","file_size","hash","status","notes"]), "text/csv;charset=utf-8"); }
  function exportTomJson() { downloadFile("tom_export.json", JSON.stringify(currentTom || getTomFromForm(), null, 2), "application/json"); }

  const CUSTOMER_AVV_COLUMNS = ["customer_avv_id","customer_id","customer_name","avv_title","avv_version","contract_date","status","affected_systems","data_categories","processor_name","source_file","file_hash","last_review","review_status","notes"];

  function normalizeCustomerAvv(row, index) {
    const customerName = String(row.customer_name || "").trim();
    if (!customerName) throw new Error(`Zeile ${index + 2}: Kunde fehlt.`);
    return {
      customer_avv_id: String(row.customer_avv_id || `CAVV-${Date.now()}-${index + 1}`).trim(),
      customer_id: String(row.customer_id || "").trim(),
      customer_name: customerName,
      avv_title: String(row.avv_title || `AVV ${customerName}`).trim(),
      avv_version: String(row.avv_version || "").trim(),
      contract_date: normalizeDateInput(row.contract_date),
      status: String(row.status || "Aktiv").trim(),
      affected_systems: String(row.affected_systems || "").trim(),
      data_categories: String(row.data_categories || "").trim(),
      processor_name: String(row.processor_name || "").trim(),
      source_file: String(row.source_file || "").trim(),
      file_hash: String(row.file_hash || "").trim(),
      file_size: Number(row.file_size || 0) || 0,
      file_type: String(row.file_type || "").trim(),
      last_review: normalizeDateInput(row.last_review),
      review_status: String(row.review_status || "OK").trim(),
      notes: String(row.notes || "").trim(),
      avv_text: String(row.avv_text || "").trim(),
    };
  }

  function importCustomerAvvCsvFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const errors = [];
      const imported = [];
      parseCsv(String(reader.result || "")).forEach((row, index) => {
        try { imported.push(normalizeCustomerAvv(row, index)); } catch (error) { errors.push(error.message); }
      });
      imported.forEach((entry) => {
        const existing = customerAvvs.findIndex((item) => item.customer_avv_id === entry.customer_avv_id);
        if (existing >= 0) customerAvvs[existing] = { ...customerAvvs[existing], ...entry };
        else customerAvvs.push(entry);
      });
      persistCustomerAvvs();
      renderCustomerAvvs();
      showMessage("customerAvvMessage", `${imported.length} Kunden-AVV-Datensätze importiert.${errors.length ? " Fehler: " + errors.map(escapeHtml).join(" | ") : ""}`, errors.length ? "danger" : "warning");
      event.target.value = "";
    };
    reader.onerror = () => showMessage("customerAvvMessage", "Kunden-AVV-CSV konnte nicht gelesen werden.", "danger");
    reader.readAsText(file, "utf-8");
  }

  function renderCustomerAvvs() {
    const query = ($("customerAvvSearch").value || "").toLowerCase();
    const status = $("customerAvvStatusFilter").value;
    const filtered = customerAvvs.filter((item) => (!status || item.status === status) && Object.values(item).join(" ").toLowerCase().includes(query));
    $("avvCountTotal").textContent = customerAvvs.length;
    $("avvCountOpen").textContent = customerAvvs.filter((item) => item.status === "Prüfung offen").length;
    $("avvCountUpdate").textContent = customerAvvs.filter((item) => item.status === "Aktualisierung nötig").length;
    $("avvCountActive").textContent = customerAvvs.filter((item) => item.status === "Aktiv").length;
    const columns = ["customer_name","customer_id","avv_title","avv_version","contract_date","status","affected_systems","data_categories","processor_name","last_review","source_file","file_hash","action"];
    document.querySelector("#customerAvvTable thead").innerHTML = `<tr>${columns.map((c) => `<th>${escapeHtml(fieldLabel(c))}</th>`).join("")}</tr>`;
    document.querySelector("#customerAvvTable tbody").innerHTML = filtered.length ? filtered.map((item) => `<tr>${columns.map((column) => `<td>${column === "action" ? `<button class="secondary avv-select" type="button" data-id="${escapeHtml(item.customer_avv_id)}">Auswählen</button>` : formatCustomerAvvCell(column, item[column])}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}">Keine Kunden-AVVs vorhanden.</td></tr>`;
    document.querySelectorAll(".avv-select").forEach((button) => button.addEventListener("click", () => selectCustomerAvv(button.dataset.id)));
    renderCustomerAvvDetail();
  }

  function formatCustomerAvvCell(column, value) {
    if (DATE_FIELDS.has(column)) return escapeHtml(formatDateForDisplay(value));
    if (column === "status" || column === "review_status") return `<span class="status-badge ${statusClass(value)}">${escapeHtml(value || "")}</span>`;
    return escapeHtml(value || "");
  }

  function statusClass(value) {
    const text = String(value || "").toLowerCase();
    if (text.includes("aktiv") || text === "ok") return "status-active";
    if (text.includes("high") || text.includes("aktualisierung")) return "status-high";
    if (text.includes("prüf") || text.includes("tom")) return "status-open";
    return "";
  }

  function selectCustomerAvv(id) { selectedCustomerAvvId = id; renderCustomerAvvDetail(); }

  function renderCustomerAvvDetail() {
    const item = customerAvvs.find((entry) => entry.customer_avv_id === selectedCustomerAvvId);
    if (!item) { $("customerAvvDetail").className = "empty-state"; $("customerAvvDetail").textContent = "Noch kein Kunden-AVV ausgewählt."; return; }
    $("customerAvvDetail").className = "";
    $("customerAvvDetail").innerHTML = `<div class="detail-grid">${CUSTOMER_AVV_COLUMNS.map((column) => `<div><strong>${escapeHtml(fieldLabel(column))}</strong>${escapeHtml(formatDisplayValue(column, item[column]))}</div>`).join("")}</div><label>AVV-Text aus PDF hier einfügen<textarea id="selectedAvvText" rows="5">${escapeHtml(item.avv_text || "")}</textarea></label><div class="button-row"><button id="saveSelectedAvvTextBtn" type="button">AVV-Text speichern</button><button id="markSelectedAvvReviewBtn" class="secondary" type="button">Zur Prüfung markieren</button></div><div id="avvPdfPreviewBox" class="empty-state">PDF-Vorschau ist nur direkt nach dem Import verfügbar.</div>`;
    $("saveSelectedAvvTextBtn").addEventListener("click", () => { item.avv_text = $("selectedAvvText").value.trim(); persistCustomerAvvs(); renderCustomerAvvDetail(); });
    $("markSelectedAvvReviewBtn").addEventListener("click", () => { item.status = "Prüfung offen"; item.review_status = "Prüfen"; persistCustomerAvvs(); renderCustomerAvvs(); });
  }

  async function importCustomerAvvPdf(event) {
    const file = event.target.files[0];
    const item = customerAvvs.find((entry) => entry.customer_avv_id === selectedCustomerAvvId);
    if (!file || !item) { showMessage("customerAvvMessage", "Bitte zuerst einen Kunden-AVV-Datensatz auswählen und dann die PDF importieren.", "danger"); return; }
    item.source_file = file.name;
    item.file_type = file.type || "application/pdf";
    item.file_size = file.size;
    item.file_hash = await calculateSha256(file);
    persistCustomerAvvs();
    renderCustomerAvvs();
    showMessage("customerAvvMessage", "AVV-PDF wurde lokal registriert. Metadaten und Hash wurden gespeichert.", "warning");
    event.target.value = "";
  }

  function exportCustomerAvvsCsv() { downloadFile("kunden_avvs_export.csv", toCsv(customerAvvs, CUSTOMER_AVV_COLUMNS), "text/csv;charset=utf-8"); }

  function renderAffectedReviewBox(result) {
    const affected = Array.isArray(result.affected_documents) ? result.affected_documents : [];
    const parts = [];
    if (affected.includes("AVV")) {
      const relevant = customerAvvs.filter((item) => ["Aktiv", "Prüfung offen"].includes(item.status));
      parts.push(`<div><strong>Betroffene Kunden-AVVs prüfen</strong>${renderChipList(relevant.map((item) => `${item.customer_name} (${item.status})`))}<button id="markCustomerAvvsReviewBtn" class="secondary" type="button">Kunden-AVVs zur Prüfung markieren</button></div>`);
    }
    if (affected.includes("TOM")) parts.push(`<div><strong>Aktuelle TOM prüfen</strong><button id="markTomReviewFromResultBtn" class="secondary" type="button">TOM zur Prüfung markieren</button></div>`);
    return parts.length ? `<div class="review-actions">${parts.join("")}</div>` : "";
  }

  function markRelevantCustomerAvvs(highImpact) {
    customerAvvs = customerAvvs.map((item) => ["Aktiv", "Prüfung offen"].includes(item.status) ? { ...item, status: "Prüfung offen", review_status: highImpact ? "High Impact prüfen" : "Prüfen" } : item);
    persistCustomerAvvs();
    renderCustomerAvvs();
    renderResult(lastEvaluation || { affected_documents: [], warnings: [] }, "Kunden-AVVs wurden zur Prüfung markiert.");
  }

  async function loadWebScanResults() {
    hideMessage("webScanMessage");
    const target = $("webScanResults");
    target.className = "web-scan-results empty-state";
    target.textContent = "Beiträge werden geladen ...";
    try {
      const response = await fetch("data/web_scan_results.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Scan-Datei konnte nicht geladen werden.");
      renderWebScanResults(await response.json());
    } catch (error) {
      target.className = "web-scan-results empty-state";
      target.textContent = "Keine Beiträge verfügbar.";
      showMessage("webScanMessage", "Die Demo-Beiträge konnten nicht geladen werden. Falls die App direkt per Doppelklick geöffnet wurde, blockiert der Browser möglicherweise lokale JSON-Dateien.", "warning");
    }
  }

  function renderWebScanResults(results) {
    const target = $("webScanResults");
    const entries = Array.isArray(results) ? results : [];
    if (!entries.length) {
      target.className = "web-scan-results empty-state";
      target.textContent = "Noch keine Demo-Beiträge vorhanden.";
      return;
    }
    target.className = "web-scan-results";
    target.innerHTML = entries.map((entry) => `
      <article class="scan-result">
        <div class="scan-result-header">
          <span class="table-impact impact-${escapeHtml(String(entry.relevance_estimate || "").toLowerCase())}">${escapeHtml(entry.relevance_estimate || "Low")}</span>
          <strong>${escapeHtml(entry.title || "Ohne Titel")}</strong>
        </div>
        <p><strong>Quelle:</strong> ${escapeHtml(entry.source || "Unbekannt")} · <strong>Datum:</strong> ${escapeHtml(formatDateForDisplay(entry.published_date)) || "–"}</p>
        <p><strong>Kurzbeschreibung:</strong> ${escapeHtml(entry.summary || "Keine Kurzbeschreibung vorhanden.")}</p>
        <p><strong>Relevanz:</strong> ${escapeHtml(entry.relevance_estimate || "Low")}</p>
        <p><strong>Empfohlene Aktion:</strong> ${escapeHtml(entry.recommended_action || "Sichten und bei Bedarf bewerten.")}</p>
        ${entry.link ? `<a href="${escapeHtml(entry.link)}" target="_blank" rel="noopener noreferrer">Quelle öffnen</a>` : ""}
      </article>
    `).join("");
  }

  async function calculateSha256(file) {
    if (!crypto || !crypto.subtle) return "SHA-256 im aktuellen Browser nicht verfügbar";
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function setPdfPreview(file, frameId, fallbackId, type) {
    if (type === "tom" && tomPreviewUrl) URL.revokeObjectURL(tomPreviewUrl);
    if (type === "avv" && avvPreviewUrl) URL.revokeObjectURL(avvPreviewUrl);
    const url = URL.createObjectURL(file);
    if (type === "tom") tomPreviewUrl = url; else avvPreviewUrl = url;
    $(frameId).src = url;
    $(frameId).classList.remove("hidden");
    $(fallbackId).classList.add("hidden");
  }

  function showMessage(id, html, type) {
    const element = $(id);
    element.className = `alert ${type}`;
    element.innerHTML = html;
  }

  function hideMessage(id) {
    const element = $(id);
    element.className = "alert hidden";
    element.textContent = "";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
