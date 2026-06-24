"""Lokaler Prototyp fuer Webseiten-/RSS-Screening.

Start:
    python src/web_feed_scanner.py

Das Skript ruft die konfigurierten Quellen einmalig ab und schreibt die
Ergebnisse lokal nach data/web_scan_results.json. Es versendet nichts und
richtet keine Hintergrundueberwachung ein.
"""
from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


BASE_DIR = Path(__file__).resolve().parents[1]
OUTPUT_PATH = BASE_DIR / "data" / "web_scan_results.json"
SOURCES = [
    {
        "name": "Datenschutzticker",
        "url": "https://www.datenschutzticker.de/",
        "feeds": ["https://www.datenschutzticker.de/feed/"],
    },
    {
        "name": "Dr. Datenschutz",
        "url": "https://www.dr-datenschutz.de/",
        "feeds": ["https://www.dr-datenschutz.de/feed/"],
    },
]
HIGH_KEYWORDS = [
    "avv",
    "tom",
    "auftragsverarbeitung",
    "datenpanne",
    "sicherheitsvorfall",
    "bußgeld",
    "bussgeld",
    "subunternehmer",
    "drittlandtransfer",
]
MEDIUM_KEYWORDS = [
    "dsgvo",
    "datenschutz",
    "ki",
    "orientierungshilfe",
    "urteil",
    "microsoft",
    "teams",
    "cloud",
]


def fetch_text(url: str) -> str:
    response = requests.get(
        url,
        timeout=15,
        headers={"User-Agent": "Pichler-DSGVO-Change-Manager/Prototype"},
    )
    response.raise_for_status()
    return response.text


def relevance_for(text: str) -> tuple[str, str]:
    lowered = text.lower()
    if any(keyword in lowered for keyword in HIGH_KEYWORDS):
        return "High", "Eintrag fachlich prüfen und bei Relevanz als Änderung erfassen."
    if any(keyword in lowered for keyword in MEDIUM_KEYWORDS):
        return "Medium", "Eintrag sichten und Relevanz für AVV/TOM oder Änderungshistorie prüfen."
    return "Low", "Zur Kenntnis nehmen; aktuell keine unmittelbare Maßnahme erkennbar."


def clean_text(value: str | None, limit: int = 300) -> str:
    text = " ".join((value or "").split())
    return text[:limit].rstrip()


def parse_rss(source: dict, xml_text: str, detected_at: str) -> list[dict]:
    soup = BeautifulSoup(xml_text, "html.parser")
    items = soup.find_all("item") or soup.find_all("entry")
    results = []
    for item in items[:10]:
        title = clean_text(_tag_text(item, "title"), 180)
        link = _tag_text(item, "link")
        if not link:
            link_tag = item.find("link")
            link = link_tag.get("href", "") if link_tag else ""
        summary = clean_text(_tag_text(item, "description") or _tag_text(item, "summary") or _tag_text(item, "content"))
        published = clean_text(_tag_text(item, "pubDate") or _tag_text(item, "published") or _tag_text(item, "updated"), 120)
        if not title:
            continue
        relevance, action = relevance_for(f"{title} {summary}")
        results.append(
            {
                "source": source["name"],
                "title": title,
                "link": urljoin(source["url"], link),
                "published_date": published,
                "summary": summary,
                "detected_at": detected_at,
                "relevance_estimate": relevance,
                "recommended_action": action,
            }
        )
    return results


def parse_html(source: dict, html_text: str, detected_at: str) -> list[dict]:
    soup = BeautifulSoup(html_text, "html.parser")
    candidates = soup.select("article") or soup.select("main a") or soup.select("a")
    results = []
    seen_links = set()
    for candidate in candidates:
        link_tag = candidate if candidate.name == "a" else candidate.find("a", href=True)
        if not link_tag or not link_tag.get("href"):
            continue
        link = urljoin(source["url"], link_tag["href"])
        if link in seen_links:
            continue
        title = clean_text(link_tag.get_text(" "), 180)
        if len(title) < 8:
            continue
        summary_source = candidate.get_text(" ") if candidate.name != "a" else ""
        summary = clean_text(summary_source)
        time_tag = candidate.find("time") if candidate.name != "a" else None
        published = clean_text((time_tag.get("datetime") or time_tag.get_text(" ")) if time_tag else "", 120)
        relevance, action = relevance_for(f"{title} {summary}")
        seen_links.add(link)
        results.append(
            {
                "source": source["name"],
                "title": title,
                "link": link,
                "published_date": published,
                "summary": summary,
                "detected_at": detected_at,
                "relevance_estimate": relevance,
                "recommended_action": action,
            }
        )
        if len(results) >= 10:
            break
    return results


def _tag_text(item, name: str) -> str:
    tag = item.find(name) or item.find(name.lower())
    return tag.get_text(" ", strip=True) if tag else ""


def scan_source(source: dict, detected_at: str) -> list[dict]:
    for feed_url in source["feeds"]:
        try:
            entries = parse_rss(source, fetch_text(feed_url), detected_at)
            if entries:
                return entries
        except requests.RequestException as exc:
            print(f"RSS nicht erreichbar ({feed_url}): {exc}")

    try:
        return parse_html(source, fetch_text(source["url"]), detected_at)
    except requests.RequestException as exc:
        print(f"HTML-Fallback nicht erreichbar ({source['url']}): {exc}")
        return []


def main() -> None:
    detected_at = datetime.now(timezone.utc).isoformat()
    results = []
    for source in SOURCES:
        results.extend(scan_source(source, detected_at))

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(results)} Einträge gespeichert: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
