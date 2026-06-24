(() => {
  "use strict";

  const STORAGE_KEY = "dsgvoChangeHistory.v2";
  const TOM_STORAGE_KEY = "dsgvo.tom.current";
  const TOM_VERSION_STORAGE_KEY = "dsgvo.tom.versions";
  const CUSTOMER_AVVS_STORAGE_KEY = "dsgvo.customerAvvs";
  const FALLBACK_SAMPLE_TOM = {
    "tom_id": "TOM-001",
    "title": "Technisch-organisatorische Maßnahmen",
    "version": "V5",
    "valid_from": "2024-06-11",
    "status": "Aktiv",
    "file_name": "PTS DSGVO TOM V5.pdf",
    "file_type": "application/pdf",
    "file_size": 0,
    "file_hash": "",
    "source": "Beispiel-TOM aus data/sample_tom.json",
    "notes": "Beispielhafte aktuelle TOM für lokale Bearbeitung.",
    "current_text": "Technisch-organisatorische Maßnahmen\nVersion: V5\nGültig ab: 2024-06-11\n\n1. Vertraulichkeit\nDie Vertraulichkeit personenbezogener Daten wird durch organisatorische und technische Maßnahmen geschützt. Mitarbeitende werden auf Vertraulichkeit verpflichtet und erhalten nur Zugriff auf Daten, die sie zur Aufgabenerfüllung benötigen.\n\nZutrittskontrolle\nBüroräume und Arbeitsbereiche sind gegen unbefugten Zutritt geschützt. Schlüssel und Zugangsmittel werden kontrolliert ausgegeben und bei Austritt oder Rollenwechsel zurückgenommen. Besucher werden begleitet oder erhalten nur kontrollierten Zugang.\n\nZugangskontrolle\nIT-Systeme sind durch individuelle Benutzerkonten, sichere Passwörter und, soweit verfügbar, Mehr-Faktor-Authentifizierung geschützt. Nicht mehr benötigte Zugänge werden zeitnah deaktiviert.\n\nZugriffskontrolle\nBerechtigungen werden nach dem Need-to-know-Prinzip vergeben. Rollen und Rechte werden regelmäßig geprüft. Administrative Zugriffe sind auf berechtigte Personen beschränkt und werden dokumentiert.\n\nTrennungskontrolle\nDaten unterschiedlicher Kunden, Zwecke und Systeme werden logisch getrennt verarbeitet. Test- und Produktivdaten werden getrennt gehalten; produktive personenbezogene Daten werden in Tests nur genutzt, wenn dies erforderlich und zulässig ist.\n\n2. Integrität\nDie Integrität der Daten wird durch kontrollierte Änderungen, Protokollierung, Berechtigungskonzepte und Schutz vor unbefugter Manipulation gesichert.\n\nWeitergabekontrolle\nÜbermittlungen personenbezogener Daten erfolgen nur auf definierten Wegen und an berechtigte Empfänger. Externe Dienstleister werden vor Einsatz geprüft und vertraglich eingebunden.\n\nEingabekontrolle\nSoweit technisch möglich, werden Eingaben, Änderungen und Löschungen nachvollziehbar protokolliert. Verantwortlichkeiten für Datenänderungen sind intern festgelegt.\n\n3. Verfügbarkeit und Belastbarkeit\nSysteme werden durch Datensicherungen, Wiederherstellungsverfahren und Schutzmaßnahmen gegen Ausfall abgesichert. Backups werden regelmäßig erstellt und Wiederherstellungen stichprobenartig geprüft.\n\nVerfügbarkeitskontrolle\nWichtige Systeme werden gegen Verlust, unbeabsichtigte Zerstörung und technische Störungen geschützt. Wartungen und Updates erfolgen kontrolliert und werden dokumentiert.\n\n4. Verfahren zur regelmäßigen Überprüfung, Bewertung und Evaluierung\nDie Wirksamkeit der technischen und organisatorischen Maßnahmen wird regelmäßig überprüft und bei relevanten Änderungen angepasst. Ergebnisse werden dokumentiert.\n\nDatenschutzmanagement\nDatenschutzrelevante Prozesse, Zuständigkeiten und Dokumentationen werden gepflegt. Änderungen mit Datenschutzbezug werden bewertet und in der Änderungshistorie dokumentiert.\n\nIncident-Response-Management\nSicherheitsereignisse werden bewertet, dokumentiert und nach einem definierten Verfahren bearbeitet. Bei Bedarf werden Melde- und Informationspflichten geprüft.\n\nDatenschutzfreundliche Voreinstellungen\nSysteme und Prozesse werden soweit möglich datensparsam und mit datenschutzfreundlichen Voreinstellungen betrieben.\n\nAuftragskontrolle\nAuftragsverarbeiter werden sorgfältig ausgewählt, vertraglich geregelt und bei relevanten Änderungen überprüft. AVVs und Unterauftragsverhältnisse werden dokumentiert.\n\nVersion\nV1: Erstfassung.\nV5: Aktualisierte Beispiel-TOM für lokale Bearbeitung und TOM-Versionierung.",
    "sections": [
      {
        "section_id": "tom-vertraulichkeit",
        "title": "1. Vertraulichkeit",
        "text": "Die Vertraulichkeit personenbezogener Daten wird durch organisatorische und technische Maßnahmen geschützt."
      },
      {
        "section_id": "tom-zutrittskontrolle",
        "title": "Zutrittskontrolle",
        "text": "Büroräume und Arbeitsbereiche sind gegen unbefugten Zutritt geschützt."
      },
      {
        "section_id": "tom-zugangskontrolle",
        "title": "Zugangskontrolle",
        "text": "IT-Systeme sind durch individuelle Benutzerkonten, sichere Passwörter und, soweit verfügbar, Mehr-Faktor-Authentifizierung geschützt."
      },
      {
        "section_id": "tom-zugriffskontrolle",
        "title": "Zugriffskontrolle",
        "text": "Berechtigungen werden nach dem Need-to-know-Prinzip vergeben."
      },
      {
        "section_id": "tom-trennungskontrolle",
        "title": "Trennungskontrolle",
        "text": "Daten unterschiedlicher Kunden, Zwecke und Systeme werden logisch getrennt verarbeitet."
      },
      {
        "section_id": "tom-integritaet",
        "title": "2. Integrität",
        "text": "Die Integrität der Daten wird durch kontrollierte Änderungen, Protokollierung und Berechtigungskonzepte gesichert."
      },
      {
        "section_id": "tom-weitergabekontrolle",
        "title": "Weitergabekontrolle",
        "text": "Übermittlungen personenbezogener Daten erfolgen nur auf definierten Wegen und an berechtigte Empfänger."
      },
      {
        "section_id": "tom-eingabekontrolle",
        "title": "Eingabekontrolle",
        "text": "Soweit technisch möglich, werden Eingaben, Änderungen und Löschungen nachvollziehbar protokolliert."
      },
      {
        "section_id": "tom-verfuegbarkeit",
        "title": "3. Verfügbarkeit und Belastbarkeit",
        "text": "Systeme werden durch Datensicherungen, Wiederherstellungsverfahren und Schutzmaßnahmen gegen Ausfall abgesichert."
      },
      {
        "section_id": "tom-datenschutzmanagement",
        "title": "4. Verfahren zur regelmäßigen Überprüfung, Bewertung und Evaluierung",
        "text": "Die Wirksamkeit der technischen und organisatorischen Maßnahmen wird regelmäßig überprüft."
      },
      {
        "section_id": "tom-incident-response",
        "title": "Incident-Response-Management",
        "text": "Sicherheitsereignisse werden bewertet, dokumentiert und nach einem definierten Verfahren bearbeitet."
      },
      {
        "section_id": "tom-auftragskontrolle",
        "title": "Auftragskontrolle",
        "text": "Auftragsverarbeiter werden sorgfältig ausgewählt, vertraglich geregelt und bei relevanten Änderungen überprüft."
      },
      {
        "section_id": "tom-version",
        "title": "Version",
        "text": "V1: Erstfassung. V5: Aktualisierte Beispiel-TOM für lokale Bearbeitung und TOM-Versionierung."
      }
    ],
    "created_at": "2024-06-11T00:00:00.000Z",
    "updated_at": "2024-06-11T00:00:00.000Z"
  };
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

  async function init() {
    populateSelect("change_type", KNOWN_CHANGE_TYPES);
    populateSelect("security_change", YES_NO_UNKNOWN, "Nein");
    populateSelect("personal_data", YES_NO_UNKNOWN, "Nein");
    populateSelect("customers_affected", YES_NO_UNKNOWN, "Nein");
    populateSelect("external_parties", YES_NO_UNKNOWN, "Nein");
    $("date").value = new Date().toISOString().slice(0, 10);
    $("source").value = "Manuelle Eingabe";

    if (!isLocalStorageAvailable()) {
      showMessage("storageWarning", "localStorage ist nicht verfügbar. Bewertungen funktionieren, aber gespeicherte Daten bleiben nach dem Schließen möglicherweise nicht erhalten.", "warning");
    }

    history = loadHistory();
    currentTom = await loadTomForStartup();
    customerAvvs = loadCustomerAvvs();
    renderHistory();
    renderTom();
    renderCustomerAvvs();
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
    $("saveTomTextBtn").addEventListener("click", saveTomText);
    $("createTomVersionBtn").addEventListener("click", createTomVersion);
    $("resetTomSampleBtn").addEventListener("click", resetTomToSample);
    $("markTomAffectedBtn").addEventListener("click", markTomAsAffected);
    $("focusTomTextBtn").addEventListener("click", () => $("tomFullTextEditor").focus());
    $("exportTomCsvBtn").addEventListener("click", exportTomCsv);
    $("exportTomJsonBtn").addEventListener("click", exportTomJson);
    $("deleteTomBtn").addEventListener("click", deleteTom);
    $("customerAvvCsvUpload").addEventListener("change", importCustomerAvvCsvFile);
    $("customerAvvPdfUpload").addEventListener("change", importCustomerAvvPdf);
    $("exportCustomerAvvsCsvBtn").addEventListener("click", exportCustomerAvvsCsv);
    $("customerAvvSearch").addEventListener("input", renderCustomerAvvs);
    $("customerAvvStatusFilter").addEventListener("change", renderCustomerAvvs);
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
      data[field] = element ? String(element.value || "").trim() : "";
    });
    return data;
  }

  function setFormData(data) {
    INPUT_FIELDS.forEach((field) => {
      const element = $(field);
      if (!element) return;
      element.value = data[field] || "";
    });
  }

  function normalizeChange(change) {
    const normalized = {};
    INPUT_FIELDS.forEach((field) => {
      normalized[field] = String(change[field] ?? "").trim();
    });
    return normalized;
  }

  function validateChange(change) {
    const errors = [];
    REQUIRED_FIELDS.forEach((field) => {
      if (!change[field]) errors.push(`Pflichtfeld '${field}' fehlt.`);
    });
    if (change.date && Number.isNaN(Date.parse(`${change.date}T00:00:00`))) {
      errors.push("Pflichtfeld 'date' enthält kein gültiges Datum.");
    }
    ["security_change", "personal_data", "customers_affected", "external_parties"].forEach((field) => {
      if (change[field] && !YES_NO_UNKNOWN.includes(change[field])) {
        errors.push(`Feld '${field}' muss Ja, Nein oder Unklar sein.`);
      }
    });
    if (change.number_of_customers) {
      const number = Number(change.number_of_customers);
      if (!Number.isFinite(number) || number < 0) {
        errors.push("Feld 'number_of_customers' muss eine nicht-negative Zahl sein.");
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
      <div><strong>Zusammenfassung:</strong> ${escapeHtml(result.summary)}</div>
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
    thead.innerHTML = `<tr>${TABLE_COLUMNS.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>`;
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
      showMessage("importErrors", `Ungültige CSV-Spalten. Fehlende Pflichtspalten: ${missingColumns.join(", ")}`, "danger");
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
    return [columns.join(","), ...rows.map((row) => columns.map((column) => escapeCell(row[column])).join(","))].join("\n");
  }

  function exportJson() {
    const backup = {
      exported_at: new Date().toISOString(),
      changes: history,
      change_history: history,
      document_library: [],
      tom: currentTom,
      customer_avvs: customerAvvs,
      tom_versions: loadTomVersions(),
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
      localStorage.removeItem(TOM_VERSION_STORAGE_KEY);
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
    $("date").value = new Date().toISOString().slice(0, 10);
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
    $("email_received_at").value = parsed.date || $("email_received_at").value;
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


  async function loadTomForStartup(forceSample = false) {
    if (!forceSample) {
      const stored = loadTom();
      if (stored) return normalizeTom(stored);
    }
    const sampleTom = await loadSampleTom();
    const normalized = normalizeTom(sampleTom || FALLBACK_SAMPLE_TOM);
    currentTom = normalized;
    persistTom();
    return normalized;
  }

  async function loadSampleTom() {
    try {
      const response = await fetch("data/sample_tom.json", { cache: "no-store" });
      if (!response.ok) throw new Error("sample_tom.json konnte nicht geladen werden.");
      return await response.json();
    } catch (error) {
      return { ...FALLBACK_SAMPLE_TOM, source: "Fallback-Beispiel-TOM aus script.js" };
    }
  }

  function normalizeTom(tom) {
    const text = String(tom?.current_text || "");
    const hash = String(tom?.file_hash || tom?.hash || "");
    const sections = Array.isArray(tom?.sections) && tom.sections.length ? tom.sections : parseTomSections(text);
    return {
      tom_id: String(tom?.tom_id || "TOM-001"),
      title: String(tom?.title || "Technisch-organisatorische Maßnahmen"),
      version: String(tom?.version || "V1"),
      valid_from: String(tom?.valid_from || new Date().toISOString().slice(0, 10)),
      status: String(tom?.status || "Aktiv"),
      file_name: String(tom?.file_name || ""),
      file_type: String(tom?.file_type || ""),
      file_size: Number(tom?.file_size || 0) || 0,
      hash,
      file_hash: hash,
      source: String(tom?.source || "Lokale TOM"),
      notes: String(tom?.notes || ""),
      current_text: text,
      sections,
      created_at: String(tom?.created_at || new Date().toISOString()),
      updated_at: String(tom?.updated_at || new Date().toISOString()),
    };
  }

  function renderTomCurrentDisplay(tom) {
    const element = $("tomCurrentDisplay");
    if (!tom || !tom.current_text) {
      element.innerHTML = `<strong>Keine TOM gespeichert</strong><small>Status: keine lokale TOM vorhanden</small>`;
      return;
    }
    element.innerHTML = `
      <strong>${escapeHtml(tom.title || "TOM")}</strong>
      <div class="tom-meta-list">
        <span>Version: ${escapeHtml(tom.version || "–")}</span>
        <span>Gültig ab: ${escapeHtml(tom.valid_from || "–")}</span>
        <span>Status: ${escapeHtml(tom.status || "–")}</span>
        <span>Datei: ${escapeHtml(tom.file_name || "keine Datei hinterlegt")}</span>
        <span>Hash: ${escapeHtml(tom.file_hash || tom.hash || "–")}</span>
      </div>
      <pre class="tom-full-text-preview">${escapeHtml(tom.current_text)}</pre>
    `;
  }

  function renderTomSections(sections) {
    const list = $("tomSectionsList");
    if (!sections || !sections.length) {
      list.innerHTML = `<div class="empty-state">Keine TOM-Abschnitte erkannt.</div>`;
      return;
    }
    list.innerHTML = sections.map((section) => `
      <details class="tom-section-card">
        <summary>${escapeHtml(section.title)}</summary>
        <p>${escapeHtml(section.text || "")}</p>
      </details>
    `).join("");
  }

  function saveTomText() {
    const text = $("tomFullTextEditor").value.trim();
    currentTom = normalizeTom({ ...(currentTom || getTomFromForm()), ...getTomFromForm(), current_text: text, updated_at: new Date().toISOString(), sections: parseTomSections(text) });
    persistTom();
    renderTom();
    showMessage("tomMessage", "TOM-Text wurde lokal gespeichert und Abschnitte wurden aktualisiert.", "warning");
  }

  function createTomVersion() {
    const oldTom = loadTom() || currentTom || getTomFromForm();
    const oldText = String(oldTom.current_text || "").trim();
    const newText = $("tomFullTextEditor").value.trim();
    if (oldText === newText) {
      showMessage("tomMessage", "Keine Änderung am TOM-Text erkannt.", "warning");
      return;
    }
    const oldVersion = oldTom.version || "V1";
    const newVersion = incrementTomVersion(oldVersion);
    const versions = loadTomVersions();
    versions.push({
      version_id: `TOMVER-${String(versions.length + 1).padStart(3, "0")}`,
      tom_id: oldTom.tom_id || "TOM-001",
      old_version: oldVersion,
      new_version: newVersion,
      old_text: oldText,
      new_text: newText,
      change_summary: "TOM-Text wurde bearbeitet.",
      created_at: new Date().toISOString(),
    });
    persistTomVersions(versions);
    currentTom = normalizeTom({ ...oldTom, version: newVersion, current_text: newText, sections: parseTomSections(newText), updated_at: new Date().toISOString() });
    persistTom();
    history.push({
      change_id: `TOM-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      change_type: "TOM-Version erstellt",
      description: `Neue TOM-Version ${newVersion} aus ${oldVersion} erstellt.`,
      security_change: "Ja",
      affected_systems: "TOM",
      personal_data: "Unklar",
      customers_affected: "Unklar",
      external_parties: "Nein",
      source: "TOM-Editor",
      source_url: "",
      number_of_customers: "0",
      old_text: oldText,
      new_text: newText,
      notes: "Automatisch durch TOM-Versionierung ergänzt.",
      email_sender: "",
      email_subject: "",
      email_received_at: "",
      ...evaluateChange({ change_type: "Rechte-/Rollenkonzept geändert", security_change: "Ja", personal_data: "Unklar", customers_affected: "Unklar", external_parties: "Nein", number_of_customers: "0", old_text: oldText, new_text: newText, email_subject: "", email_sender: "" }),
      saved_at: new Date().toISOString(),
    });
    persistHistory();
    renderHistory();
    renderTom();
    showMessage("tomMessage", `Neue TOM-Version ${newVersion} wurde erstellt; alte Version wurde unter ${TOM_VERSION_STORAGE_KEY} gespeichert.`, "warning");
  }

  function loadTomVersions() {
    if (!isLocalStorageAvailable()) return [];
    try { return JSON.parse(localStorage.getItem(TOM_VERSION_STORAGE_KEY) || "[]"); } catch { return []; }
  }

  function persistTomVersions(versions) {
    if (isLocalStorageAvailable()) localStorage.setItem(TOM_VERSION_STORAGE_KEY, JSON.stringify(versions));
  }

  function incrementTomVersion(version) {
    const match = String(version || "V1").match(/^V(\d+)(?:\.(\d+))?$/i);
    if (!match) return `${version}.1`;
    if (match[2]) return `V${match[1]}.${Number(match[2]) + 1}`;
    return `V${match[1]}.1`;
  }

  async function resetTomToSample() {
    if (!confirm("Aktuelle TOM wirklich durch Beispiel-TOM ersetzen?")) return;
    currentTom = await loadTomForStartup(true);
    renderTom();
    showMessage("tomMessage", "TOM wurde auf die Beispiel-TOM zurückgesetzt.", "warning");
  }

  function parseTomSections(text) {
    const headings = [
      "1. Vertraulichkeit",
      "Zutrittskontrolle",
      "Zugangskontrolle",
      "Zugriffskontrolle",
      "Trennungskontrolle",
      "2. Integrität",
      "Weitergabekontrolle",
      "Eingabekontrolle",
      "3. Verfügbarkeit und Belastbarkeit",
      "Verfügbarkeitskontrolle",
      "4. Verfahren zur regelmäßigen Überprüfung, Bewertung und Evaluierung",
      "Datenschutzmanagement",
      "Incident-Response-Management",
      "Datenschutzfreundliche Voreinstellungen",
      "Auftragskontrolle",
      "Version",
    ];
    const matches = [];
    const lines = String(text || "").split(/\r?\n/);
    let offset = 0;
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (headings.includes(trimmed)) matches.push({ title: trimmed, index: offset });
      offset += line.length + 1;
    });
    return matches.map((match, index) => {
      const next = matches[index + 1];
      const start = match.index + match.title.length;
      const sectionText = String(text || "").slice(start, next ? next.index : undefined).trim();
      return { section_id: slugifyTomSection(match.title), title: match.title, text: sectionText };
    });
  }

  function slugifyTomSection(title) {
    return `tom-${String(title).toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
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
      valid_from: $("tom_valid_from").value,
      file_name: $("tom_file_name").value.trim(),
      file_type: $("tom_file_type").value.trim(),
      file_size: Number(String($("tom_file_size").value).replace(/[^0-9]/g, "")) || 0,
      hash: $("tom_hash").value.trim(),
      file_hash: $("tom_hash").value.trim(),
      status: $("tom_status").value,
      current_text: $("tomFullTextEditor").value.trim(),
      sections: parseTomSections($("tomFullTextEditor").value.trim()),
      notes: $("tom_notes").value.trim(),
      updated_at: new Date().toISOString(),
    };
  }

  function renderTom() {
    const tom = currentTom || {};
    $("tom_id").value = tom.tom_id || "TOM-001";
    $("tom_title").value = tom.title || "Technisch-organisatorische Maßnahmen";
    $("tom_version").value = tom.version || "";
    $("tom_valid_from").value = tom.valid_from || "";
    $("tom_file_name").value = tom.file_name || "";
    $("tom_file_type").value = tom.file_type || "";
    $("tom_file_size").value = tom.file_size ? `${tom.file_size} Byte` : "";
    $("tom_hash").value = tom.hash || tom.file_hash || "";
    $("tom_status").value = tom.status || "Aktiv";
    $("tomFullTextEditor").value = tom.current_text || "";
    $("tom_notes").value = tom.notes || "";
    renderTomCurrentDisplay(tom);
    renderTomSections(tom.sections || parseTomSections(tom.current_text || ""));
  }

  async function importTomPdf(event) {
    const file = event.target.files[0];
    if (!file) return;
    const hash = await calculateSha256(file);
    currentTom = normalizeTom({ ...getTomFromForm(), current_text: $("tomFullTextEditor").value.trim(), file_name: file.name, file_type: file.type || "application/pdf", file_size: file.size, hash, file_hash: hash, status: getTomFromForm().status || "Aktiv" });
    persistTom();
    renderTom();
    setPdfPreview(file, "tomPdfPreview", "tomPreviewFallback", "tom");
    showMessage("tomMessage", "TOM-PDF lokal registriert. Metadaten und Hash wurden gespeichert; der PDF-Text kann bei Bedarf manuell eingefügt werden.", "warning");
    event.target.value = "";
  }

  function saveTomFromForm() {
    currentTom = normalizeTom(getTomFromForm());
    persistTom();
    renderTom();
    showMessage("tomMessage", "TOM-Metadaten wurden lokal gespeichert.", "warning");
  }

  function markTomAsAffected(highImpact = false) {
    currentTom = { ...(currentTom || getTomFromForm()), status: highImpact ? "Prüfung offen" : "Prüfung offen" };
    persistTom();
    renderTom();
    showMessage("tomMessage", "Aktuelle TOM wurde als prüfpflichtig markiert.", "warning");
  }

  function deleteTom() {
    if (!confirm("Aktuelle TOM wirklich löschen?")) return;
    currentTom = null;
    persistTom();
    renderTom();
    showMessage("tomMessage", "Aktuelle TOM wurde gelöscht.", "warning");
  }

  function exportTomCsv() {
    const tom = currentTom || getTomFromForm();
    downloadFile("tom_export.csv", toCsv([tom], ["tom_id","title","version","valid_from","file_name","file_type","file_size","file_hash","hash","status","notes","updated_at"]), "text/csv;charset=utf-8");
    downloadFile("tom_sections_export.csv", toCsv(tom.sections || [], ["section_id","title","text"]), "text/csv;charset=utf-8");
  }

  function exportTomJson() {
    const tom = normalizeTom(currentTom || getTomFromForm());
    downloadFile("current_tom.json", JSON.stringify(tom, null, 2), "application/json");
  }

  const CUSTOMER_AVV_COLUMNS = ["customer_avv_id","customer_id","customer_name","avv_title","avv_version","contract_date","status","affected_systems","data_categories","processor_name","source_file","file_hash","last_review","review_status","notes"];

  function normalizeCustomerAvv(row, index) {
    const customerName = String(row.customer_name || "").trim();
    if (!customerName) throw new Error(`Zeile ${index + 2}: customer_name fehlt.`);
    return {
      customer_avv_id: String(row.customer_avv_id || `CAVV-${Date.now()}-${index + 1}`).trim(),
      customer_id: String(row.customer_id || "").trim(),
      customer_name: customerName,
      avv_title: String(row.avv_title || `AVV ${customerName}`).trim(),
      avv_version: String(row.avv_version || "").trim(),
      contract_date: String(row.contract_date || "").trim(),
      status: String(row.status || "Aktiv").trim(),
      affected_systems: String(row.affected_systems || "").trim(),
      data_categories: String(row.data_categories || "").trim(),
      processor_name: String(row.processor_name || "").trim(),
      source_file: String(row.source_file || "").trim(),
      file_hash: String(row.file_hash || "").trim(),
      file_size: Number(row.file_size || 0) || 0,
      file_type: String(row.file_type || "").trim(),
      last_review: String(row.last_review || "").trim(),
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
    document.querySelector("#customerAvvTable thead").innerHTML = `<tr>${columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
    document.querySelector("#customerAvvTable tbody").innerHTML = filtered.length ? filtered.map((item) => `<tr>${columns.map((column) => `<td>${column === "action" ? `<button class="secondary avv-select" type="button" data-id="${escapeHtml(item.customer_avv_id)}">Auswählen</button>` : formatCustomerAvvCell(column, item[column])}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}">Keine Kunden-AVVs vorhanden.</td></tr>`;
    document.querySelectorAll(".avv-select").forEach((button) => button.addEventListener("click", () => selectCustomerAvv(button.dataset.id)));
    renderCustomerAvvDetail();
  }

  function formatCustomerAvvCell(column, value) {
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
    $("customerAvvDetail").innerHTML = `<div class="detail-grid">${CUSTOMER_AVV_COLUMNS.map((column) => `<div><strong>${escapeHtml(column)}</strong>${escapeHtml(item[column] || "")}</div>`).join("")}</div><label>AVV-Text aus PDF hier einfügen<textarea id="selectedAvvText" rows="5">${escapeHtml(item.avv_text || "")}</textarea></label><div class="button-row"><button id="saveSelectedAvvTextBtn" type="button">AVV-Text speichern</button><button id="markSelectedAvvReviewBtn" class="secondary" type="button">Als prüfpflichtig markieren</button></div><div id="avvPdfPreviewBox" class="empty-state">PDF-Vorschau ist nur direkt nach dem Import verfügbar.</div>`;
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
      parts.push(`<div><strong>Betroffene Kunden-AVVs prüfen</strong>${renderChipList(relevant.map((item) => `${item.customer_name} (${item.status})`))}<button id="markCustomerAvvsReviewBtn" class="secondary" type="button">Kunden-AVVs als prüfpflichtig markieren</button></div>`);
    }
    if (affected.includes("TOM")) parts.push(`<div><strong>Aktuelle TOM prüfen</strong><button id="markTomReviewFromResultBtn" class="secondary" type="button">TOM als prüfpflichtig markieren</button></div>`);
    return parts.length ? `<div class="review-actions">${parts.join("")}</div>` : "";
  }

  function markRelevantCustomerAvvs(highImpact) {
    customerAvvs = customerAvvs.map((item) => ["Aktiv", "Prüfung offen"].includes(item.status) ? { ...item, status: "Prüfung offen", review_status: highImpact ? "High Impact prüfen" : "Prüfen" } : item);
    persistCustomerAvvs();
    renderCustomerAvvs();
    renderResult(lastEvaluation || { affected_documents: [], warnings: [] }, "Kunden-AVVs wurden als prüfpflichtig markiert.");
  }

  async function calculateSha256(file) {
    if (typeof crypto === "undefined" || !crypto.subtle) return "SHA-256 im aktuellen Browser nicht verfügbar";
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
