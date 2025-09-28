import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchIndex } from '../lib/searchIndex';
import { getRandomSukta } from '../lib/dataLoader';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchIndex.search(query);
      setSearchResults(results.slice(0, 5)); // Show top 5 results
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleRandomHymn = () => {
    const randomSukta = getRandomSukta(searchIndex.getAllSuktas() as any);
    if (randomSukta) {
      navigate(`/mandala/${randomSukta.mandala}/hymn/${randomSukta.sukta}`);
    }
  };

  const handleResultClick = (mandalaNumber: number, suktaNumber: number) => {
    navigate(`/mandala/${mandalaNumber}/hymn/${suktaNumber}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-earth-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-saffron-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">RV</span>
            </div>
            <span className="text-xl font-bold text-earth-800 dark:text-earth-200">
              Rig Veda Explorer
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hymns, deities, rishis..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-earth-800 dark:text-earth-200 bg-earth-50 dark:bg-gray-700 border border-earth-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-earth-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick((result.item as any).mandalaNumber, result.item.suktaNumber)}
                    className="w-full px-4 py-3 text-left hover:bg-earth-50 dark:hover:bg-gray-700 border-b border-earth-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-earth-800 dark:text-earth-200">
                      {result.item.deity} - {result.item.rsi}
                    </div>
                    <div className="text-sm text-earth-600 dark:text-earth-400">
                      Mandala {(result.item as any).mandalaNumber}, Hymn {result.item.suktaNumber}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRandomHymn}
              className="px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700 transition-colors duration-200"
            >
              Random Hymn
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 transition-colors duration-200"
            >
              {darkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
