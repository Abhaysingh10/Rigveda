#!/usr/bin/env python3
"""
Convert Rig Veda TEI to JSON matching rigveda.sample.json schema

Usage:
  python scripts/tei_to_json.py <input_tei_file> <output_json_file>

Notes:
- Extracts per hymn (sukta) metadata: rsi, deity, meter (if available)
- Extracts verses per stanza with:
  - Sanskrit (Devanagari) from lg[@xml:lang='san-Deva'][@source='eichler']
  - Transliteration (IAST) from lg[@xml:lang='san-Latn-x-ISO-15919'][@source='zurich']
  - Translation (English) from lg[@xml:lang='eng'][@source='griffith']
- Sets translation.source="R.T.H. Griffith, 1896" and license="Public Domain"
"""

import sys
import json
import re
from typing import Dict, Any, List, Optional

try:
	import xml.etree.ElementTree as ET
except Exception as e:
	print(f"Failed to import ElementTree: {e}")
	sys.exit(1)

TEI_NS = "http://www.tei-c.org/ns/1.0"
XML_NS = "http://www.w3.org/XML/1998/namespace"
NS = {"tei": TEI_NS, "xml": XML_NS}


def text_clean(s: Optional[str]) -> str:
	if not s:
		return ""
	return re.sub(r"\s+", " ", s.strip())


def join_lines_from_lg(lg_elem: Optional[ET.Element]) -> str:
	"""Join all child <l> lines from an <lg> block into a single string."""
	if lg_elem is None:
		return ""
	parts: List[str] = []
	for l in lg_elem.findall("tei:l", NS):
		parts.append(text_clean(l.text or ""))
	return text_clean(" ".join(p for p in parts if p))


def extract_hymn_metadata(hymn: ET.Element) -> Dict[str, str]:
	meta = {"rsi": "Unknown", "deity": "Unknown", "meter": "Unknown"}
	# Dedication → addressee (deity), group (rsi)
	ded = hymn.find(".//tei:div[@type='dedication']", NS)
	if ded is not None:
		addr = ded.find(".//tei:div[@type='addressee']", NS)
		if addr is not None:
			deity_eng = addr.find(".//tei:p[@xml:lang='eng']", NS)
			if deity_eng is not None and deity_eng.text:
				meta["deity"] = text_clean(deity_eng.text)
		group = ded.find(".//tei:div[@type='group']", NS)
		if group is not None:
			rsi_eng = group.find(".//tei:p[@xml:lang='eng']", NS)
			if rsi_eng is not None and rsi_eng.text:
				val = text_clean(rsi_eng.text)
				meta["rsi"] = val.replace("Hymns of ", "") if val.startswith("Hymns of ") else val
	# Try to discover meter if present nearby (optional; depends on source)
	meter_candidate = hymn.find(".//tei:fs[@type='metre_info']//tei:f[@name='metre']", NS)
	if meter_candidate is not None and meter_candidate.text:
		meta["meter"] = text_clean(meter_candidate.text)
	return meta


def extract_stanza_verse(stanza: ET.Element) -> Dict[str, Any]:
	# Sanskrit (Devanagari) Eichler
	san_deva = join_lines_from_lg(
		stanza.find(".//tei:lg[@xml:lang='san-Deva'][@source='eichler']", NS)
	)
	# Transliteration Zurich (IAST ISO 15919)
	translit = join_lines_from_lg(
		stanza.find(".//tei:lg[@xml:lang='san-Latn-x-ISO-15919'][@source='zurich']", NS)
	)
	# Griffith English translation
	trans_eng = join_lines_from_lg(
		stanza.find(".//tei:lg[@xml:lang='eng'][@source='griffith']", NS)
	)
	return {
		"sanskrit_deva": san_deva,
		"transliteration": translit,
		"translation": {
			"text": trans_eng,
			"source": "R.T.H. Griffith, 1896",
			"license": "Public Domain",
		},
	}


def convert(input_path: str) -> Dict[str, Any]:
	# Parse XML; default namespace requires fully-qualified tags or namespace map
	tree = ET.parse(input_path)
	root = tree.getroot()
	# Locate the book (mandala) container
	book = root.find(".//tei:div[@type='book']", NS)
	if book is None:
		raise RuntimeError("Could not find <div type='book'> in TEI")
	# Mandala number from xml:id like b01 → 1
	xml_id = book.get("xml:id")
	mandala_num = 1
	if xml_id and xml_id.startswith("b"):
		try:
			mandala_num = int(xml_id[1:])
		except Exception:
			mandala_num = 1
	# Iterate hymns
	suktas: List[Dict[str, Any]] = []
	for hymn in book.findall("tei:div[@type='hymn']", NS):
		ana = hymn.get("ana") or ""
		try:
			sukta_number = int(ana) if ana.isdigit() else len(suktas) + 1
		except Exception:
			sukta_number = len(suktas) + 1
		meta = extract_hymn_metadata(hymn)
		verses: List[Dict[str, Any]] = []
		for idx, stanza in enumerate(hymn.findall("tei:div[@type='stanza']", NS), start=1):
			v = extract_stanza_verse(stanza)
			# Keep stanza only if any content present
			if any([v["sanskrit_deva"], v["transliteration"], v["translation"]["text"]]):
				v_obj = {
					"verseNumber": idx,
					"sanskrit_deva": v["sanskrit_deva"],
					"transliteration": v["transliteration"],
					"translation": v["translation"],
				}
				verses.append(v_obj)
		if verses:
			sukta = {
				"suktaId": f"{mandala_num}-{sukta_number}",
				"suktaNumber": sukta_number,
				"rsi": meta["rsi"],
				"deity": meta["deity"],
				"meter": meta["meter"],
				"verses": verses,
			}
			suktas.append(sukta)
	return {
		"mandalas": [
			{"mandala": mandala_num, "suktas": suktas}
		]
	}


def main() -> None:
	if len(sys.argv) != 3:
		print("Usage: python scripts/tei_to_json.py <input_tei_file> <output_json_file>")
		sys.exit(1)
	inp, outp = sys.argv[1], sys.argv[2]
	try:
		data = convert(inp)
		with open(outp, "w", encoding="utf-8") as f:
			json.dump(data, f, ensure_ascii=False, indent=2)
		print(f"Wrote JSON to {outp}")
		# Quick stats
		suktas = data["mandalas"][0]["suktas"]
		verses_count = sum(len(s["verses"]) for s in suktas)
		print(f"Mandalas: 1, Suktas: {len(suktas)}, Verses: {verses_count}")
	except Exception as e:
		print(f"Error: {e}")
		sys.exit(1)


if __name__ == "__main__":
	main()
