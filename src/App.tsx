import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RigvedaData } from './types/rigveda';
import { loadRigvedaData } from './lib/dataLoader';
import { searchIndex } from './lib/searchIndex';
import Home from './pages/Home';
import MandalaPage from './pages/MandalaPage';
import HymnPage from './pages/HymnPage';
import Navbar from './components/Navbar';
import FooterCredits from './components/FooterCredits';

function App() {
  const [data, setData] = useState<RigvedaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading Rigveda data...');
        const rigvedaData = await loadRigvedaData();
        console.log('Data loaded:', rigvedaData);
        console.log('Mandalas count:', rigvedaData.mandalas.length);
        console.log('First mandala suktas count:', rigvedaData.mandalas[0]?.suktas.length);
        setData(rigvedaData);
        searchIndex.initialize(rigvedaData);
        console.log('Search index initialized');
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600 mx-auto mb-4"></div>
          <p className="text-earth-800 dark:text-earth-200">Loading Rig Veda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-earth-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-saffron-600 text-white rounded hover:bg-saffron-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-earth-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-earth-800 dark:text-earth-200">No data available</p>
      </div>
    );
  }

    // https://sri-aurobindo.co.in/workings/matherials/rigveda/01/01-007.htm#:~:text=indram%20%C7%80%20v%C4%81%E1%B9%87%C4%AB%E1%B8%A5%20%C7%80%20an%C5%AB%E1%B9%A3ata,noun%20M%2DN%20plural)%20%E2%86%90%20g%C4%81thin
    // https://www.scribd.com/document/755690379/Rig-Veda-Mandala-1-Sukta-9#:~:text=%E0%A4%B5%E0%A4%BF%E0%A5%92%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%AF%E0%A5%81%E0%A5%91%E0%A4%B0%E0%A5%8D%E0%A4%A7%E0%A5%87%E0%A5%92%E0%A4%B9%E0%A5%8D%E0%A4%AF%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A5%91%E0%A4%A4%E0%A4%82%20%E0%A5%A5-,Padapatha%20transliteration%20nonaccented,supramental%20perceptions)%20%2C%20abundant%20great%20%2C
  return (
    <Router>
      <div className="min-h-screen bg-earth-50 dark:bg-gray-900">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home data={data} />} />
            <Route path="/mandala/:mandalaNumber" element={<MandalaPage data={data} />} />
            <Route path="/mandala/:mandalaNumber/hymn/:suktaNumber" element={<HymnPage data={data} />} />
          </Routes>
        </main>
        <FooterCredits />
      </div>
    </Router>
  );
}

export default App;
