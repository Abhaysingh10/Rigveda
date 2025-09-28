#!/usr/bin/env python3
"""
Convert Rig Veda TEI file to JSON format matching rigveda.sample.json
"""

import xml.etree.ElementTree as ET
import json
import re
from typing import Dict, List, Any

def clean_text(text: str) -> str:
    """Clean and normalize text content"""
    if not text:
        return ""
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    return text

def extract_verse_content(stanza_elem) -> Dict[str, str]:
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
    
    # Find Sanskrit Devanagari text (eichler source)
    sanskrit_elem = stanza_elem.find('.//lg[@xml:lang="san-Deva"][@source="eichler"]', 
                                   {'xml': 'http://www.tei-c.org/ns/1.0'})
    if sanskrit_elem is not None:
        sanskrit_lines = []
        for l_elem in sanskrit_elem.findall('.//l', {'xml': 'http://www.tei-c.org/ns/1.0'}):
            line_text = clean_text(l_elem.text or '')
            if line_text:
                sanskrit_lines.append(line_text)
        verse_data['sanskrit_deva'] = ' '.join(sanskrit_lines)
    
    # Find transliteration (zurich source)
    translit_elem = stanza_elem.find('.//lg[@xml:lang="san-Latn-x-ISO-15919"][@source="zurich"]', 
                                   {'xml': 'http://www.tei-c.org/ns/1.0'})
    if translit_elem is not None:
        translit_lines = []
        for l_elem in translit_elem.findall('.//l', {'xml': 'http://www.tei-c.org/ns/1.0'}):
            line_text = clean_text(l_elem.text or '')
            if line_text:
                translit_lines.append(line_text)
        verse_data['transliteration'] = ' '.join(translit_lines)
    
    # Find English translation (griffith source)
    translation_elem = stanza_elem.find('.//lg[@xml:lang="eng"][@source="griffith"]', 
                                      {'xml': 'http://www.tei-c.org/ns/1.0'})
    if translation_elem is not None:
        translation_lines = []
        for l_elem in translation_elem.findall('.//l', {'xml': 'http://www.tei-c.org/ns/1.0'}):
            line_text = clean_text(l_elem.text or '')
            if line_text:
                translation_lines.append(line_text)
        verse_data['translation']['text'] = ' '.join(translation_lines)
    
    return verse_data

def extract_hymn_metadata(hymn_elem) -> Dict[str, str]:
    """Extract hymn metadata (deity, rishi, meter)"""
    metadata = {
        'deity': 'Unknown',
        'rsi': 'Unknown', 
        'meter': 'Unknown'
    }
    
    # Find dedication section
    dedication = hymn_elem.find('.//div[@type="dedication"]', {'xml': 'http://www.tei-c.org/ns/1.0'})
    if dedication is not None:
        # Extract deity
        addressee = dedication.find('.//div[@type="addressee"]', {'xml': 'http://www.tei-c.org/ns/1.0'})
        if addressee is not None:
            eng_p = addressee.find('.//p[@xml:lang="eng"]', {'xml': 'http://www.tei-c.org/ns/1.0'})
            if eng_p is not None and eng_p.text:
                metadata['deity'] = clean_text(eng_p.text)
        
        # Extract rishi
        group = dedication.find('.//div[@type="group"]', {'xml': 'http://www.tei-c.org/ns/1.0'})
        if group is not None:
            eng_p = group.find('.//p[@xml:lang="eng"]', {'xml': 'http://www.tei-c.org/ns/1.0'})
            if eng_p is not None and eng_p.text:
                # Extract rishi name from "Hymns of [Rishi]"
                rishi_text = clean_text(eng_p.text)
                if rishi_text.startswith('Hymns of '):
                    metadata['rsi'] = rishi_text.replace('Hymns of ', '')
                else:
                    metadata['rsi'] = rishi_text
    
    return metadata

def convert_tei_to_json(tei_file_path: str, output_file_path: str):
    """Convert TEI file to JSON format"""
    print(f"Parsing TEI file: {tei_file_path}")
    
    # Parse the XML file
    tree = ET.parse(tei_file_path)
    root = tree.getroot()
    
    # Define namespace
    ns = {'xml': 'http://www.tei-c.org/ns/1.0'}
    
    # Find the book element
    book_elem = root.find('.//div[@type="book"]', ns)
    if book_elem is None:
        raise ValueError("Could not find book element in TEI file")
    
    # Extract mandala number
    mandala_num = int(book_elem.get('xml:id', '1').replace('b', ''))
    
    print(f"Processing Mandala {mandala_num}")
    
    # Process hymns
    hymns = []
    hymn_elements = book_elem.findall('.//div[@type="hymn"]', ns)
    
    print(f"Found {len(hymn_elements)} hymns")
    
    for i, hymn_elem in enumerate(hymn_elements):
        hymn_id = hymn_elem.get('xml:id', f'b{mandala_num:02d}_h{i+1:03d}')
        hymn_num = int(hymn_elem.get('ana', str(i+1)))
        
        print(f"Processing hymn {hymn_num}...")
        
        # Extract metadata
        metadata = extract_hymn_metadata(hymn_elem)
        
        # Process verses (stanzas)
        verses = []
        stanza_elements = hymn_elem.findall('.//div[@type="stanza"]', ns)
        
        for j, stanza_elem in enumerate(stanza_elements):
            verse_data = extract_verse_content(stanza_elem)
            
            # Only include verses that have content
            if (verse_data['sanskrit_deva'] or 
                verse_data['transliteration'] or 
                verse_data['translation']['text']):
                
                verses.append({
                    'verseNumber': j + 1,
                    'sanskrit_deva': verse_data['sanskrit_deva'],
                    'transliteration': verse_data['transliteration'],
                    'translation': verse_data['translation']
                })
        
        # Only include hymns that have verses
        if verses:
            hymns.append({
                'suktaId': f'{mandala_num}-{hymn_num}',
                'suktaNumber': hymn_num,
                'rsi': metadata['rsi'],
                'deity': metadata['deity'],
                'meter': metadata['meter'],
                'verses': verses
            })
    
    # Create the final JSON structure
    result = {
        'mandalas': [{
            'mandala': mandala_num,
            'suktas': hymns
        }]
    }
    
    # Write to output file
    print(f"Writing to {output_file_path}")
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"Conversion complete!")
    print(f"Generated {len(hymns)} hymns with {sum(len(h['verses']) for h in hymns)} verses")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) != 3:
        print("Usage: python convert_tei_to_json.py <input_tei_file> <output_json_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        convert_tei_to_json(input_file, output_file)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
