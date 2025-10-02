#!/usr/bin/env python3
"""
Convert Rig Veda TEI file to JSON format matching rigveda.sample.json
"""

import xml.etree.ElementTree as ET
import json
import re
from typing import Dict

# Paths
INPUT_TEI_FILE = r"C:\Users\Abhay\Desktop\rv_book_10.tei"
OUTPUT_JSON_FILE = r"C:\Users\Abhay\Desktop\mandal10.json"

def clean_text(text: str) -> str:
    """Clean and normalize text content"""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text.strip())
    return text

def extract_verse_content(stanza_elem, ns) -> Dict:
    """Extract Sanskrit, transliteration, and translation from a stanza"""
    verse_data = {
        'sanskrit_deva': '',
        'transliteration': '',
        'translation': {
            'text': '',
            'source': 'R.T.H. Griffith, 1896',
            'license': 'Public Domain'
        }
    }

    # Sanskrit Devanagari (eichler source)
    sanskrit_elem = stanza_elem.find('.//tei:lg[@xml:lang="san-Deva"][@source="eichler"]', ns)
    if sanskrit_elem is not None:
        lines = [clean_text(l.text or '') for l in sanskrit_elem.findall('.//tei:l', ns)]
        verse_data['sanskrit_deva'] = ' '.join(lines)

    # Transliteration (zurich source)
    translit_elem = stanza_elem.find('.//tei:lg[@xml:lang="san-Latn-x-ISO-15919"][@source="zurich"]', ns)
    if translit_elem is not None:
        lines = [clean_text(l.text or '') for l in translit_elem.findall('.//tei:l', ns)]
        verse_data['transliteration'] = ' '.join(lines)

    # English translation (griffith source)
    translation_elem = stanza_elem.find('.//tei:lg[@xml:lang="eng"][@source="griffith"]', ns)
    if translation_elem is not None:
        lines = [clean_text(l.text or '') for l in translation_elem.findall('.//tei:l', ns)]
        verse_data['translation']['text'] = ' '.join(lines)

    return verse_data

def extract_hymn_metadata(hymn_elem, ns) -> Dict:
    """Extract hymn metadata (deity, rishi, meter)"""
    metadata = {'deity': 'Unknown', 'rsi': 'Unknown', 'meter': 'Unknown'}

    dedication = hymn_elem.find('.//tei:div[@type="dedication"]', ns)
    if dedication is not None:
        addressee = dedication.find('.//tei:div[@type="addressee"]', ns)
        if addressee is not None:
            eng_p = addressee.find('.//tei:p[@xml:lang="eng"]', ns)
            if eng_p is not None and eng_p.text:
                metadata['deity'] = clean_text(eng_p.text)

        group = dedication.find('.//tei:div[@type="group"]', ns)
        if group is not None:
            eng_p = group.find('.//tei:p[@xml:lang="eng"]', ns)
            if eng_p is not None and eng_p.text:
                rishi_text = clean_text(eng_p.text)
                if rishi_text.startswith('Hymns of '):
                    metadata['rsi'] = rishi_text.replace('Hymns of ', '')
                else:
                    metadata['rsi'] = rishi_text

    return metadata

def convert_tei_to_json(tei_file_path: str, output_file_path: str):
    print(f"Parsing TEI file: {tei_file_path}")

    tree = ET.parse(tei_file_path)
    root = tree.getroot()

    # TEI namespace
    ns = {'tei': 'http://www.tei-c.org/ns/1.0',
          'xml': 'http://www.w3.org/XML/1998/namespace'}

    # Find book element
    book_elem = root.find('.//tei:div[@type="book"]', ns)
    if book_elem is None:
        raise ValueError("Could not find book element in TEI file")

    mandala_num = int(book_elem.get('xml:id', 'b01')[1:])
    print(f"Processing Mandala {mandala_num}")

    hymns = []
    hymn_elements = book_elem.findall('.//tei:div[@type="hymn"]', ns)
    print(f"Found {len(hymn_elements)} hymns")

    for i, hymn_elem in enumerate(hymn_elements):
        hymn_num = int(hymn_elem.get('ana', str(i+1)))
        metadata = extract_hymn_metadata(hymn_elem, ns)

        # Extract verses
        verses = []
        stanza_elements = hymn_elem.findall('.//tei:div[@type="stanza"]', ns)
        for j, stanza_elem in enumerate(stanza_elements):
            verse_data = extract_verse_content(stanza_elem, ns)
            if verse_data['sanskrit_deva'] or verse_data['transliteration'] or verse_data['translation']['text']:
                verses.append({
                    'verseNumber': j+1,
                    'sanskrit_deva': verse_data['sanskrit_deva'],
                    'transliteration': verse_data['transliteration'],
                    'translation': verse_data['translation']
                })

        if verses:
            hymns.append({
                'suktaId': f'{mandala_num}-{hymn_num}',
                'suktaNumber': hymn_num,
                'rsi': metadata['rsi'],
                'deity': metadata['deity'],
                'meter': metadata['meter'],
                'verses': verses
            })

    result = {'mandalas': [{'mandala': mandala_num, 'suktas': hymns}]}

    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Conversion complete! Output: {output_file_path}")
    print(f"Generated {len(hymns)} hymns with {sum(len(h['verses']) for h in hymns)} verses")

if __name__ == '__main__':
    convert_tei_to_json(INPUT_TEI_FILE, OUTPUT_JSON_FILE)
