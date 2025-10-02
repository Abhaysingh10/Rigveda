#!/usr/bin/env node
/**
 * Convert Rig Veda TEI file to JSON format matching rigveda.sample.json
 */

const fs = require('fs');
const path = require('path');

// Simple XML parser for our specific use case
function parseXML(xmlString) {
  const lines = xmlString.split('\n');
  const result = { mandalas: [] };
  let currentMandala = null;
  let currentHymn = null;
  let currentStanza = null;
  let currentVerse = 0;
  
  let mandalaNum = 1;
  let hymnNum = 1;
  let verseNum = 1;
  
  const hymns = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Extract mandala number
    if (line.includes('xml:id="b01" type="book"')) {
      mandalaNum = 1;
    }
    
    // Extract hymn number and metadata
    if (line.includes('type="hymn"')) {
      const hymnMatch = line.match(/ana="(\d+)"/);
      if (hymnMatch) {
        hymnNum = parseInt(hymnMatch[1]);
      }
      
      // Reset for new hymn
      currentHymn = {
        suktaId: `${mandalaNum}-${hymnNum}`,
        suktaNumber: hymnNum,
        rsi: 'Unknown',
        deity: 'Unknown',
        meter: 'Unknown',
        verses: []
      };
      currentVerse = 0;
    }
    
    // Extract deity
    if (line.includes('xml:lang="eng"') && line.includes('Agni')) {
      currentHymn.deity = 'Agni';
    } else if (line.includes('xml:lang="eng"') && line.includes('Indra')) {
      currentHymn.deity = 'Indra';
    } else if (line.includes('xml:lang="eng"') && line.includes('Soma')) {
      currentHymn.deity = 'Soma';
    } else if (line.includes('xml:lang="eng"') && line.includes('Varuna')) {
      currentHymn.deity = 'Varuna';
    } else if (line.includes('xml:lang="eng"') && line.includes('Vishnu')) {
      currentHymn.deity = 'Vishnu';
    } else if (line.includes('xml:lang="eng"') && line.includes('Mitra')) {
      currentHymn.deity = 'Mitra';
    } else if (line.includes('xml:lang="eng"') && line.includes('Ushas')) {
      currentHymn.deity = 'Ushas';
    } else if (line.includes('xml:lang="eng"') && line.includes('Rudra')) {
      currentHymn.deity = 'Rudra';
    } else if (line.includes('xml:lang="eng"') && line.includes('Maruts')) {
      currentHymn.deity = 'Maruts';
    } else if (line.includes('xml:lang="eng"') && line.includes('Ashvins')) {
      currentHymn.deity = 'Ashvins';
    }
    
    // Extract rishi
    if (line.includes('Hymns of')) {
      const rishiMatch = line.match(/Hymns of ([^<]+)/);
      if (rishiMatch) {
        currentHymn.rsi = rishiMatch[1].trim();
      }
    }
    
    // Extract Sanskrit Devanagari text
    if (line.includes('xml:lang="san-Deva"') && line.includes('source="eichler"')) {
      // Look for the next few lines for Sanskrit text
      for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith('<l xml:id=') && nextLine.includes('eichler')) {
          const sanskritMatch = nextLine.match(/>([^<]+)</);
          if (sanskritMatch) {
            if (!currentHymn.verses[currentVerse]) {
              currentHymn.verses[currentVerse] = {
                verseNumber: currentVerse + 1,
                sanskrit_deva: '',
                transliteration: '',
                translation: {
                  text: '',
                  source: 'R.T.H. Griffith, 1896',
                  license: 'Public Domain'
                }
              };
            }
            currentHymn.verses[currentVerse].sanskrit_deva += sanskritMatch[1] + ' ';
          }
        }
      }
    }
    
    // Extract transliteration
    if (line.includes('xml:lang="san-Latn-x-ISO-15919"') && line.includes('source="zurich"')) {
      // Look for the next few lines for transliteration
      for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith('<l xml:id=') && nextLine.includes('zur')) {
          const translitMatch = nextLine.match(/>([^<]+)</);
          if (translitMatch) {
            if (!currentHymn.verses[currentVerse]) {
              currentHymn.verses[currentVerse] = {
                verseNumber: currentVerse + 1,
                sanskrit_deva: '',
                transliteration: '',
                translation: {
                  text: '',
                  source: 'R.T.H. Griffith, 1896',
                  license: 'Public Domain'
                }
              };
            }
            currentHymn.verses[currentVerse].transliteration += translitMatch[1] + ' ';
          }
        }
      }
    }
    
    // Extract English translation
    if (line.includes('xml:lang="eng"') && line.includes('source="griffith"')) {
      // Look for the next few lines for translation
      for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith('<l xml:id=') && nextLine.includes('griffith')) {
          const transMatch = nextLine.match(/>([^<]+)</);
          if (transMatch) {
            if (!currentHymn.verses[currentVerse]) {
              currentHymn.verses[currentVerse] = {
                verseNumber: currentVerse + 1,
                sanskrit_deva: '',
                transliteration: '',
                translation: {
                  text: '',
                  source: 'R.T.H. Griffith, 1896',
                  license: 'Public Domain'
                }
              };
            }
            currentHymn.verses[currentVerse].translation.text += transMatch[1] + ' ';
          }
        }
      }
    }
    
    // Detect new stanza/verse
    if (line.includes('type="stanza"')) {
      currentVerse++;
    }
    
    // End of hymn - add to results
    if (line.includes('</div>') && currentHymn && currentHymn.verses.length > 0) {
      // Clean up the verses
      currentHymn.verses = currentHymn.verses.filter(v => v && (v.sanskrit_deva.trim() || v.transliteration.trim() || v.translation.text.trim()));
      
      if (currentHymn.verses.length > 0) {
        hymns.push(currentHymn);
      }
      currentHymn = null;
    }
  }
  
  result.mandalas = [{
    mandala: mandalaNum,
    suktas: hymns
  }];
  
  return result;
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function convertTEIToJSON(inputFile, outputFile) {
  console.log(`Reading TEI file: ${inputFile}`);
  
  const xmlContent = fs.readFileSync(inputFile, 'utf8');
  console.log(`File size: ${xmlContent.length} characters`);
  
  console.log('Parsing XML...');
  const result = parseXML(xmlContent);
  
  console.log(`Found ${result.mandalas[0].suktas.length} hymns`);
  
  // Clean up the data
  result.mandalas[0].suktas.forEach(hymn => {
    hymn.verses.forEach(verse => {
      verse.sanskrit_deva = cleanText(verse.sanskrit_deva);
      verse.transliteration = cleanText(verse.transliteration);
      verse.translation.text = cleanText(verse.translation.text);
    });
  });
  
  console.log(`Writing to ${outputFile}`);
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
  
  console.log('Conversion complete!');
}

// Main execution
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node convert_tei_to_json.js <input_tei_file> <output_json_file>');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

if (!fs.existsSync(inputFile)) {
  console.error(`Input file not found: ${inputFile}`);
  process.exit(1);
}

try {
  convertTEIToJSON(inputFile, outputFile);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}





