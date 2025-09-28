import Fuse from 'fuse.js';
import { RigvedaData, Sukta } from '../types/rigveda';

export interface SearchResult {
  item: Sukta;
  score?: number;
  refIndex: number;
}

class SearchIndex {
  private fuse: Fuse<Sukta> | null = null;
  private allSuktas: Sukta[] = [];

  initialize(data: RigvedaData) {
    // Flatten all suktas from all mandalas
    this.allSuktas = data.mandalas.flatMap(mandala => 
      mandala.suktas.map(sukta => ({
        ...sukta,
        mandalaNumber: mandala.mandala
      }))
    );

    // Configure Fuse.js options
    const options = {
      keys: [
        { name: 'deity', weight: 0.3 },
        { name: 'rsi', weight: 0.3 },
        { name: 'meter', weight: 0.2 },
        { name: 'verses.sanskrit_deva', weight: 0.1 },
        { name: 'verses.transliteration', weight: 0.1 },
        { name: 'verses.translation.text', weight: 0.1 }
      ],
      threshold: 0.4, // Lower threshold for more strict matching
      includeScore: true,
      includeMatches: true
    };

    this.fuse = new Fuse(this.allSuktas, options);
  }

  search(query: string): SearchResult[] {
    if (!this.fuse || !query.trim()) {
      return [];
    }

    const results = this.fuse.search(query);
    return results.map(result => ({
      item: result.item,
      score: result.score,
      refIndex: result.refIndex
    }));
  }

  getAllSuktas(): Sukta[] {
    return this.allSuktas;
  }

  getSuktasByMandala(mandalaNumber: number): Sukta[] {
    return this.allSuktas.filter(sukta => 
      (sukta as any).mandalaNumber === mandalaNumber
    );
  }
}

export const searchIndex = new SearchIndex();
