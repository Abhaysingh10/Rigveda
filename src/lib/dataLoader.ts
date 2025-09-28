import { RigvedaData } from '../types/rigveda';

let cachedData: RigvedaData | null = null;

export async function loadRigvedaData(): Promise<RigvedaData> {
  if (cachedData) {
    return cachedData;
  }

  try {
    // Try to load full dataset first
    const response = await fetch('/data/rigveda.json');
    if (response.ok) {
      const data = await response.json();
      // Check if the data actually has content (suktas in mandalas)
      const hasContent = data.mandalas && data.mandalas.some((mandala: any) => mandala.suktas && mandala.suktas.length > 0);
      if (hasContent) {
        cachedData = data;
        return cachedData!;
      } else {
        console.log('Main dataset is empty, falling back to sample data');
      }
    }
  } catch (error) {
    console.log('Full dataset not available, falling back to sample data');
  }

  // Fall back to sample data
  const response = await fetch('/data/rigveda.sample.json');
  if (!response.ok) {
    throw new Error('Failed to load Rigveda data');
  }
  
  cachedData = await response.json();
  return cachedData!;
}

export function getMandalaCount(data: RigvedaData): number {
  return data.mandalas.length;
}

export function getSuktaCount(data: RigvedaData, mandalaNumber: number): number {
  const mandala = data.mandalas.find(m => m.mandala === mandalaNumber);
  return mandala ? mandala.suktas.length : 0;
}

export function getTotalSuktaCount(data: RigvedaData): number {
  return data.mandalas.reduce((total, mandala) => total + mandala.suktas.length, 0);
}

export function getRandomSukta(data: RigvedaData): { mandala: number; sukta: number } | null {
  const allSuktas: { mandala: number; sukta: number }[] = [];
  
  data.mandalas.forEach(mandala => {
    mandala.suktas.forEach(sukta => {
      allSuktas.push({ mandala: mandala.mandala, sukta: sukta.suktaNumber });
    });
  });

  if (allSuktas.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * allSuktas.length);
  return allSuktas[randomIndex];
}
