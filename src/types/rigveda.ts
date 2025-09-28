export interface Translation {
  text: string;
  source: string;
  license: string;
}

export interface Verse {
  verseNumber: number;
  sanskrit_deva: string;
  transliteration: string;
  translation: Translation;
}

export interface Sukta {
  suktaId: string;
  suktaNumber: number;
  rsi: string;
  deity: string;
  meter: string;
  verses: Verse[];
}

export interface Mandala {
  mandala: number;
  suktas: Sukta[];
}

export interface RigvedaData {
  mandalas: Mandala[];
}

export type ViewMode = 'sanskrit' | 'transliteration' | 'translation';
