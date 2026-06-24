# Lokale DSGVO-Change-Manager-App

Diese App ist eine lokale Browser-App zur regelbasierten Bewertung und Dokumentation DSGVO-relevanter technischer Änderungen. Sie läuft direkt per Doppelklick auf `index.html` und benötigt keinen Server, keine Python-App, kein Streamlit, keinen Build-Schritt, kein Framework, keine Cloud, keine externen APIs, keine externen LLMs, kein CDN und keine externen Fonts.

Alle strukturierten Daten werden im Browser in `localStorage` gespeichert. PDF-Dateien werden nicht ins Internet übertragen.

## Start

```text
index.html per Doppelklick im Browser öffnen
```

## Bestehende Funktionen

- Dokumentation technischer Änderungen über ein lokales Formular
- regelbasierte Impact-Bewertung in `Low`, `Medium` oder `High`
- AVV-/TOM-Zuordnung auf Basis der Änderungsdaten
- Maßnahmen- und Änderungsvorschläge
- Diff-Dokumentation über `old_text` und `new_text`
- lokale Änderungshistorie
- CSV-Import und CSV-Export für Änderungen
- Komplett-Backup als JSON
- lokale Speicherung im Browser
- vorbereiteter manueller E-Mail-/EML-Import ohne Netzwerkverbindung

## TOM verwalten

Der Bereich **TOM** ist in diesem Schritt bewusst minimal gehalten. Beim Laden der App prüft die Anzeige zuerst `localStorage` unter dem Key `dsgvo.tom.current`. Wenn dort keine TOM vorhanden ist, versucht die App `data/sample_tom.json` zu laden. Falls das lokale Laden per Doppelklick vom Browser blockiert wird, nutzt die App eine eingebaute Fallback-TOM aus `script.js`.

Angezeigt werden nur:

- Titel
- Version
- gültig ab
- Status
- Quelle
- vollständiger TOM-Text aus `current_text`
- Abschnitte aus `sections`, falls vorhanden

Es gibt in diesem TOM-Bereich keine PDF-Import-, Speicher-, Export- oder Bearbeitungsbuttons. Die Anzeige blockiert bei Fehlern nicht die restliche App.

## Kunden-AVVs verwalten

Der Bereich **Kunden-AVVs** verwaltet AVV-Datensätze pro Kunde lokal im Browser unter dem localStorage-Key `dsgvo.customerAvvs`.

Die View enthält:

- Summary-Karten für Gesamtzahl, Prüfung offen, Aktualisierung nötig und Aktiv
- Suche
- Statusfilter
- CSV-Import
- CSV-Export
- optionalen PDF-Import für den ausgewählten Kunden-AVV
- Tabelle aller Kunden-AVVs
- Detailpanel für den ausgewählten Datensatz

### CSV-Struktur für Kunden-AVVs

Der CSV-Import erwartet folgende Spalten:

```csv
customer_avv_id,customer_id,customer_name,avv_title,avv_version,contract_date,status,affected_systems,data_categories,processor_name,last_review,review_status,notes
```

Regeln beim Import:

- Wenn `customer_avv_id` fehlt, generiert die App automatisch eine ID.
- Wenn `customer_name` fehlt, wird die Zeile als Importfehler angezeigt.
- Wenn `avv_title` fehlt, wird automatisch `AVV [customer_name]` gesetzt.
- Doppelte `customer_avv_id` aktualisieren vorhandene Datensätze statt Dubletten anzulegen.
- Importfehler werden verständlich im Bereich **Kunden-AVVs** angezeigt.

### CSV-Beispiel für Kunden-AVVs

```csv
customer_avv_id,customer_id,customer_name,avv_title,avv_version,contract_date,status,affected_systems,data_categories,processor_name,last_review,review_status,notes
CAVV-001,KND-001,Musterkunde GmbH,AVV Musterkunde GmbH,1.0,2024-08-30,Aktiv,"SBS Software, Support","Kundenstammdaten, Kommunikationsdaten",Pichler Training + Support,2026-06-09,OK,"Beispiel"
```

### AVV-PDF pro Kunde hinterlegen

Für einen ausgewählten Kunden-AVV kann über **„AVV-PDF importieren“** optional eine PDF-Datei registriert werden. Die App speichert Dateiname, Größe, MIME-Type und Hash im Datensatz. Eine automatische PDF-Textauswertung erfolgt nicht; der Text kann im Detailpanel manuell eingefügt werden.

### Kunden-AVVs exportieren

**„CSV exportieren“** im Bereich **Kunden-AVVs** erzeugt `kunden_avvs_export.csv` mit den Spalten:

```csv
customer_avv_id,customer_id,customer_name,avv_title,avv_version,contract_date,status,affected_systems,data_categories,processor_name,source_file,file_hash,last_review,review_status,notes
```

## Komplett-Backup als JSON

Der bestehende JSON-Export erzeugt `dsgvo_change_manager_backup.json` und enthält:

- Änderungen
- Änderungshistorie
- Dokumentenbibliothek-Platzhalter
- TOM-Datensatz
- Kunden-AVVs
- Versionsübersicht
- Änderungsvorschläge / Maßnahmen

## Verbindung zur Änderungsbewertung

Wenn eine Änderung AVV-relevant ist, zeigt die Ergebnisbox zusätzlich **„Betroffene Kunden-AVVs prüfen“**. Aktive Kunden-AVVs und Datensätze mit `Prüfung offen` können über einen Button als prüfpflichtig markiert werden. Bei High-Impact-Änderungen wird der Review-Status auf `High Impact prüfen` gesetzt.

Wenn eine Änderung TOM-relevant ist, zeigt die Ergebnisbox zusätzlich **„Aktuelle TOM prüfen“**. Die minimale TOM-Ansicht zeigt weiterhin die lokal geladene TOM aus `data/sample_tom.json` oder `localStorage`.

## Manuelle Testfälle

1. **App per Doppelklick öffnen**
   - Erwartung: Die bestehende Änderungserfassung, Bewertung und Änderungshistorie bleiben nutzbar.

2. **TOM-Beispieldaten anzeigen**
   - Erwartung: Im Bereich **„Aktuelle TOM-Version“** wird die TOM aus `data/sample_tom.json` oder die Fallback-TOM angezeigt.
   - Erwartung: Titel, Version, gültig ab, Status, Quelle, vollständiger TOM-Text und Abschnitte sind sichtbar.

3. **Kunden-AVV-CSV importieren**
   - Erwartung: Kundendatensätze erscheinen in der Kunden-AVV-Tabelle.

4. **Kunden-AVV als CSV exportieren**
   - Erwartung: Datei `kunden_avvs_export.csv` wird heruntergeladen.

5. **Lokale Daten löschen**
   - Erwartung: Änderungshistorie, TOM-Daten und Kunden-AVVs werden gelöscht, ohne die restliche App zu blockieren.

## Rechtlicher Hinweis

Alle Daten bleiben lokal. PDF-Dateien werden nicht ins Internet übertragen. Das Tool ist eine Dokumentations- und Prüfhilfe und ersetzt keine rechtliche Prüfung.

## TOM-Beispieldaten

Beim ersten Start lädt die App eine Beispiel-TOM aus `data/sample_tom.json`. Falls der Browser das lokale Laden blockiert, nutzt die App eine eingebaute Fallback-TOM aus `script.js`. Die geladene TOM wird unter `dsgvo.tom.current` im Browser gespeichert und anschließend im Bereich **„Aktuelle TOM-Version“** angezeigt.

## Warum JSON?

Die TOM wird als JSON bereitgestellt, weil JSON Metadaten, vollständigen Text und Abschnitte besser abbilden kann als CSV. In diesem Schritt dient die TOM-Ansicht ausschließlich der lokalen Anzeige.
