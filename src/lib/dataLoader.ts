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

  // Load all mandala data files
  const mandalaFiles = [
    { file: '/data/rigveda.sample.json', mandalaNumber: 1 },
    { file: '/data/mandal2.json', mandalaNumber: 2 },
    { file: '/data/mandal3.json', mandalaNumber: 3 },
    { file: '/data/mandal4.json', mandalaNumber: 4 },
    { file: '/data/mandal5.json', mandalaNumber: 5 },
    { file: '/data/mandal6.json', mandalaNumber: 6 },
    { file: '/data/mandal7.json', mandalaNumber: 7 },
    { file: '/data/mandal8.json', mandalaNumber: 8 },
    { file: '/data/mandal9.json', mandalaNumber: 9 },
    { file: '/data/mandal10.json', mandalaNumber: 10 }
  ];

  const responses = await Promise.all(
    mandalaFiles.map(({ file }) => fetch(file))
  );

  const mandalaData = await Promise.all(
    responses.map(async (response, index) => {
      if (response.ok) {
        try {
          const data = await response.json();
          return { data, mandalaNumber: mandalaFiles[index].mandalaNumber };
        } catch (error) {
          console.log(`Failed to load ${mandalaFiles[index].file}, skipping`);
          return null;
        }
      } else {
        console.log(`Failed to load ${mandalaFiles[index].file}, skipping`);
        return null;
      }
    })
  );

  // Combine the data
  const combinedData: RigvedaData = {
    mandalas: []
  };

  // Process each mandala
  mandalaData.forEach((mandalaInfo) => {
    if (mandalaInfo && mandalaInfo.data.mandalas && mandalaInfo.data.mandalas.length > 0) {
      const mandala = { ...mandalaInfo.data.mandalas[0] };
      mandala.mandala = mandalaInfo.mandalaNumber; // Ensure correct mandala number
      
      // Update suktaIds and suktaNumbers to start from 1 for each mandala
      mandala.suktas = mandala.suktas.map((sukta: any, index: number) => ({
        ...sukta,
        suktaId: `${mandalaInfo.mandalaNumber}-${index + 1}`, // e.g., 1-1, 2-1, 3-1, etc.
        suktaNumber: index + 1 // Start from 1, 2, 3, etc. for each mandala
      }));
      
      combinedData.mandalas.push(mandala);
    }
  });
  
  cachedData = combinedData;
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
