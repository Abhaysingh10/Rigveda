import fs from 'fs';
import path from 'path';

function validateRigvedaData(filePath) {
  try {
    console.log(`Validating ${filePath}...`);
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check basic structure
    if (!data.mandalas || !Array.isArray(data.mandalas)) {
      throw new Error('Data must have a "mandalas" array');
    }
    
    if (data.mandalas.length === 0) {
      throw new Error('Data must contain at least one mandala');
    }
    
    let totalSuktas = 0;
    let totalVerses = 0;
    
    // Validate each mandala
    data.mandalas.forEach((mandala, mandalaIndex) => {
      // Check mandala number
      if (!Number.isInteger(mandala.mandala) || mandala.mandala < 1 || mandala.mandala > 10) {
        throw new Error(`Mandala ${mandalaIndex + 1}: mandala number must be between 1 and 10`);
      }
      
      // Check suktas array
      if (!mandala.suktas || !Array.isArray(mandala.suktas)) {
        throw new Error(`Mandala ${mandala.mandala}: must have a "suktas" array`);
      }
      
      totalSuktas += mandala.suktas.length;
      
      // Validate each sukta
      mandala.suktas.forEach((sukta, suktaIndex) => {
        // Check required fields
        const requiredFields = ['suktaId', 'suktaNumber', 'rsi', 'deity', 'meter', 'verses'];
        requiredFields.forEach(field => {
          if (!sukta[field]) {
            throw new Error(`Mandala ${mandala.mandala}, Sukta ${suktaIndex + 1}: missing required field "${field}"`);
          }
        });
        
        // Check verses array
        if (!Array.isArray(sukta.verses) || sukta.verses.length === 0) {
          throw new Error(`Mandala ${mandala.mandala}, Sukta ${sukta.suktaNumber}: must have at least one verse`);
        }
        
        totalVerses += sukta.verses.length;
        
        // Validate each verse
        sukta.verses.forEach((verse, verseIndex) => {
          const verseRequiredFields = ['verseNumber', 'sanskrit_deva', 'transliteration', 'translation'];
          verseRequiredFields.forEach(field => {
            if (!verse[field]) {
              throw new Error(`Mandala ${mandala.mandala}, Sukta ${sukta.suktaNumber}, Verse ${verseIndex + 1}: missing required field "${field}"`);
            }
          });
          
          // Check translation structure
          if (!verse.translation.text || !verse.translation.source || !verse.translation.license) {
            throw new Error(`Mandala ${mandala.mandala}, Sukta ${sukta.suktaNumber}, Verse ${verse.verseNumber}: translation must have text, source, and license`);
          }
          
          // Check verse number
          if (!Number.isInteger(verse.verseNumber) || verse.verseNumber < 1) {
            throw new Error(`Mandala ${mandala.mandala}, Sukta ${sukta.suktaNumber}, Verse ${verseIndex + 1}: verse number must be a positive integer`);
          }
        });
      });
    });
    
    console.log('✅ Validation successful!');
    console.log(`📊 Statistics:`);
    console.log(`   - Mandalas: ${data.mandalas.length}`);
    console.log(`   - Suktas: ${totalSuktas}`);
    console.log(`   - Verses: ${totalVerses}`);
    
    // Check for duplicate suktaIds
    const suktaIds = new Set();
    data.mandalas.forEach(mandala => {
      mandala.suktas.forEach(sukta => {
        if (suktaIds.has(sukta.suktaId)) {
          throw new Error(`Duplicate suktaId found: ${sukta.suktaId}`);
        }
        suktaIds.add(sukta.suktaId);
      });
    });
    
    console.log('✅ No duplicate suktaIds found');
    
    return true;
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);
const filePath = args[0] || 'public/data/rigveda.sample.json';

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

const isValid = validateRigvedaData(filePath);
process.exit(isValid ? 0 : 1);
