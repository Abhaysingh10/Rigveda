#!/usr/bin/env node
/**
 * Convert Rig Veda TEI file to JSON format matching rigveda.sample.json
 * This version uses a more robust approach to parse the XML
 */

const fs = require('fs');
const path = require('path');

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function extractHymnData(xmlContent) {
  const hymns = [];
  
  // Split by hymn boundaries
  const hymnMatches = xmlContent.match(/<div xml:id="b01_h\d+" ana="\d+" type="hymn">[\s\S]*?<\/div>/g);
  
  if (!hymnMatches) {
    console.log('No hymns found');
    return hymns;
  }
  
  console.log(`Found ${hymnMatches.length} hymns`);
  
  hymnMatches.forEach((hymnXml, index) => {
    const hymnNum = index + 1;
    console.log(`Processing hymn ${hymnNum}...`);
    
    // Extract deity
    let deity = 'Unknown';
    const deityMatch = hymnXml.match(/<p xml:lang="eng">([^<]+)<\/p>/);
    if (deityMatch) {
      deity = cleanText(deityMatch[1]);
    }
    
    // Extract rishi
    let rsi = 'Unknown';
    const rsiMatch = hymnXml.match(/Hymns of ([^<]+)/);
    if (rsiMatch) {
      rsi = cleanText(rsiMatch[1]);
    }
    
    // Extract verses
    const verses = [];
    
    // Find all stanzas
    const stanzaMatches = hymnXml.match(/<div xml:id="b01_h\d+_\d+" type="stanza">[\s\S]*?<\/div>/g);
    
    if (stanzaMatches) {
      stanzaMatches.forEach((stanzaXml, verseIndex) => {
        const verseNum = verseIndex + 1;
        
        // Extract Sanskrit Devanagari
        let sanskrit = '';
        const sanskritMatch = stanzaXml.match(/<lg xml:id="[^"]*_eichler" xml:lang="san-Deva" source="eichler">[\s\S]*?<\/lg>/);
        if (sanskritMatch) {
          const lines = sanskritMatch[0].match(/<l[^>]*>([^<]+)<\/l>/g);
          if (lines) {
            sanskrit = lines.map(line => {
              const match = line.match(/>([^<]+)</);
              return match ? match[1] : '';
            }).join(' ').trim();
          }
        }
        
        // Extract transliteration
        let transliteration = '';
        const translitMatch = stanzaXml.match(/<lg xml:id="[^"]*_zur" xml:lang="san-Latn-x-ISO-15919" source="zurich">[\s\S]*?<\/lg>/);
        if (translitMatch) {
          const lines = translitMatch[0].match(/<l[^>]*>([^<]+)<\/l>/g);
          if (lines) {
            transliteration = lines.map(line => {
              const match = line.match(/>([^<]+)</);
              return match ? match[1] : '';
            }).join(' ').trim();
          }
        }
        
        // Extract English translation
        let translation = '';
        const transMatch = stanzaXml.match(/<lg xml:id="[^"]*_griffith" xml:lang="eng" source="griffith">[\s\S]*?<\/lg>/);
        if (transMatch) {
          const lines = transMatch[0].match(/<l[^>]*>([^<]+)<\/l>/g);
          if (lines) {
            translation = lines.map(line => {
              const match = line.match(/>([^<]+)</);
              return match ? match[1] : '';
            }).join(' ').trim();
          }
        }
        
        // Only add verse if it has content
        if (sanskrit || transliteration || translation) {
          verses.push({
            verseNumber: verseNum,
            sanskrit_deva: cleanText(sanskrit),
            transliteration: cleanText(transliteration),
            translation: {
              text: cleanText(translation),
              source: 'R.T.H. Griffith, 1896',
              license: 'Public Domain'
            }
          });
        }
      });
    }
    
    // Only add hymn if it has verses
    if (verses.length > 0) {
      hymns.push({
        suktaId: `1-${hymnNum}`,
        suktaNumber: hymnNum,
        rsi: rsi,
        deity: deity,
        meter: 'Gayatri', // Default meter
        verses: verses
      });
    }
  });
  
  return hymns;
}

function convertTEIToJSON(inputFile, outputFile) {
  console.log(`Reading TEI file: ${inputFile}`);
  
  const xmlContent = fs.readFileSync(inputFile, 'utf8');
  console.log(`File size: ${xmlContent.length} characters`);
  
  console.log('Extracting hymn data...');
  const hymns = extractHymnData(xmlContent);
  
  const result = {
    mandalas: [{
      mandala: 1,
      suktas: hymns
    }]
  };
  
  console.log(`Found ${hymns.length} hymns with ${hymns.reduce((total, h) => total + h.verses.length, 0)} verses`);
  
  console.log(`Writing to ${outputFile}`);
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
  
  console.log('Conversion complete!');
}

// Main execution
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node convert_tei_to_json_v2.js <input_tei_file> <output_json_file>');
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
  console.error(error.stack);
  process.exit(1);
}





