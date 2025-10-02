import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RigvedaData } from '../types/rigveda';
import { searchIndex } from '../lib/searchIndex';
import HymnList from '../components/HymnList';
import SearchBar from '../components/SearchBar';

interface MandalaPageProps {
  data: RigvedaData;
}

const MandalaPage: React.FC<MandalaPageProps> = ({ data }) => {
  const { mandalaNumber } = useParams<{ mandalaNumber: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuktas, setFilteredSuktas] = useState<any[]>([]);

  const mandalaNum = parseInt(mandalaNumber || '1');
  const mandala = data.mandalas.find(m => m.mandala === mandalaNum);

  useEffect(() => {
    if (mandala) {
      console.log('Mandala found:', mandala);
      console.log('Suktas in mandala:', mandala.suktas.length);
      const suktas = mandala.suktas.map(sukta => ({
        ...sukta,
        mandalaNumber: mandalaNum
      }));
      console.log('Setting filtered suktas:', suktas.length);
      setFilteredSuktas(suktas);
    } else {
      console.log('Mandala not found for number:', mandalaNum);
    }
  }, [mandala, mandalaNum]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchIndex.search(searchQuery);
      const mandalaResults = results
        .filter(result => (result.item as any).mandalaNumber === mandalaNum)
        .map(result => result.item);
      setFilteredSuktas(mandalaResults);
    } else if (mandala) {
      const suktas = mandala.suktas.map(sukta => ({
        ...sukta,
        mandalaNumber: mandalaNum
      }));
      setFilteredSuktas(suktas);
    }
  }, [searchQuery, mandala, mandalaNum]);

  const handleResultClick = (mandalaNumber: number, suktaNumber: number) => {
    navigate(`/mandala/${mandalaNumber}/hymn/${suktaNumber}`);
  };

  if (!mandala) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-earth-800 dark:text-earth-200 mb-4">
          Mandala {mandalaNumber} not found
        </h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-800 dark:text-earth-200 mb-2">
              Mandala {mandala.mandala}
            </h1>
            <p className="text-earth-600 dark:text-earth-400">
              {mandala.suktas.length} {mandala.suktas.length === 1 ? 'Hymn' : 'Hymns'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/tree`)}
              className="px-3 py-2 bg-earth-100 dark:bg-gray-700 text-earth-700 dark:text-earth-200 rounded hover:bg-earth-200 dark:hover:bg-gray-600"
            >
              View in Tree
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 transition-colors duration-200"
            >
              ← Back to Mandalas
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <SearchBar
            onResultClick={handleResultClick}
            placeholder={`Search hymns in Mandala ${mandala.mandala}...`}
          />
        </div>
      </div>

      {/* Hymns List */}
      {filteredSuktas.length > 0 ? (
        <HymnList suktas={filteredSuktas} mandalaNumber={mandalaNum} />
      ) : (
        <div className="text-center py-12">
          <div className="text-earth-500 dark:text-earth-500 mb-4">
            {searchQuery ? 'No hymns found matching your search.' : 'No hymns available in this mandala.'}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Mandala Info */}
      <div className="mt-12 bg-earth-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200 mb-4">
          About Mandala {mandala.mandala}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-earth-700 dark:text-earth-300 mb-2">Deities</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(mandala.suktas.map(s => s.deity))).map(deity => (
                <span key={deity} className="px-2 py-1 bg-saffron-100 dark:bg-saffron-900 text-saffron-800 dark:text-saffron-200 text-sm rounded-full">
                  {deity}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-earth-700 dark:text-earth-300 mb-2">Rishis</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(mandala.suktas.map(s => s.rsi))).slice(0, 5).map(rsi => (
                <span key={rsi} className="px-2 py-1 bg-earth-100 dark:bg-earth-700 text-earth-700 dark:text-earth-300 text-sm rounded-full">
                  {rsi}
                </span>
              ))}
              {Array.from(new Set(mandala.suktas.map(s => s.rsi))).length > 5 && (
                <span className="px-2 py-1 bg-earth-100 dark:bg-earth-700 text-earth-700 dark:text-earth-300 text-sm rounded-full">
                  +{Array.from(new Set(mandala.suktas.map(s => s.rsi))).length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandalaPage;
