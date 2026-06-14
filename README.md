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

Der Bereich **TOM** verwaltet die aktuell gültige technisch-organisatorische Maßnahme.

Unterstützte Daten:

- TOM-ID
- Titel
- Version
- gültig ab / Datum
- Dateiname
- MIME-Type
- Dateigröße
- SHA-256-Hash, sofern `crypto.subtle.digest` im Browser verfügbar ist
- Status
- Kurznotiz
- manuell eingefügter TOM-Text

### TOM-PDF importieren

Im Bereich **TOM** kann über **„TOM PDF importieren“** eine lokale PDF-Datei ausgewählt werden. Die App liest die Datei nur im Browser aus, zeigt Metadaten an und berechnet lokal einen Hash. Es wird keine externe PDF-Bibliothek verwendet und die Datei wird nicht an einen Server übertragen.

Wichtig: Eine zuverlässige PDF-Textauswertung ist in einer reinen lokalen Browser-App ohne externe Bibliothek nicht stabil möglich. Deshalb wird die PDF als lokales Dokument registriert und zusätzlich ein Textfeld **„TOM-Text aus PDF hier einfügen“** angeboten.

### TOM-Metadaten speichern

Mit **„TOM-Metadaten speichern“** werden TOM-Metadaten, Hash, Notizen und manuell eingefügter Text unter dem localStorage-Key `dsgvo.tom.current` gespeichert.

### TOM exportieren

- **„TOM als CSV exportieren“** erzeugt `tom_export.csv` mit den Spalten:

```csv
tom_id,title,version,valid_from,file_name,file_type,file_size,hash,status,notes
```

- **„TOM als JSON exportieren“** exportiert den aktuellen TOM-Datensatz als JSON-Datei.

### Hinweis zur PDF-Ablage

PDF-Dateien werden aktuell nicht dauerhaft als Binärdatei in IndexedDB gespeichert. Dauerhaft gespeichert werden Metadaten, Hash und manuell eingefügter Text. Für eine dauerhafte PDF-Ablage muss die Originaldatei lokal behalten werden.

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

Wenn eine Änderung TOM-relevant ist, zeigt die Ergebnisbox zusätzlich **„Aktuelle TOM prüfen“**. Die TOM kann aus der Ergebnisbox oder aus der TOM-View als prüfpflichtig markiert werden.

## Manuelle Testfälle

1. **TOM-PDF importieren**
   - Erwartung: Dateiname wird angezeigt.
   - Erwartung: Hash wird berechnet, sofern der Browser SHA-256 über Web Crypto unterstützt.
   - Erwartung: TOM-Datensatz wird gespeichert.
   - Erwartung: TOM erscheint in der TOM-View.

2. **TOM als prüfpflichtig markieren**
   - Erwartung: TOM-Status wird `Prüfung offen`.

3. **Kunden-AVV-CSV importieren**
   - Erwartung: Kundendatensätze erscheinen in der Kunden-AVV-Tabelle.

4. **Kunden-AVV als CSV exportieren**
   - Erwartung: Datei `kunden_avvs_export.csv` wird heruntergeladen.

5. **AVV-relevante Änderung bewerten**
   - Erwartung: Ergebnis zeigt `Betroffene Kunden-AVVs prüfen`.
   - Erwartung: aktive Kunden-AVVs können als prüfpflichtig markiert werden.

6. **TOM-relevante Änderung bewerten**
   - Erwartung: Ergebnis zeigt `Aktuelle TOM prüfen`.
   - Erwartung: TOM kann als prüfpflichtig markiert werden.

7. **Lokale Daten löschen**
   - Erwartung: Änderungshistorie, TOM-Daten und Kunden-AVVs werden gelöscht.

## Rechtlicher Hinweis

Alle Daten bleiben lokal. PDF-Dateien werden nicht ins Internet übertragen. Das Tool ist eine Dokumentations- und Prüfhilfe und ersetzt keine rechtliche Prüfung.
