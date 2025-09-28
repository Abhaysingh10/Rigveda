import React, { useState } from 'react';
import { searchIndex } from '../lib/searchIndex';
import { SearchResult } from '../lib/searchIndex';

interface SearchBarProps {
  onResultClick: (mandalaNumber: number, suktaNumber: number) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onResultClick, 
  placeholder = "Search hymns, deities, rishis...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const searchResults = searchIndex.search(searchQuery);
      setResults(searchResults.slice(0, 5)); // Show top 5 results
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (mandalaNumber: number, suktaNumber: number) => {
    onResultClick(mandalaNumber, suktaNumber);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full px-4 py-2 pl-10 pr-4 text-earth-800 dark:text-earth-200 bg-earth-50 dark:bg-gray-700 border border-earth-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-earth-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {results.map((result, index) => (
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
              {result.score && (
                <div className="text-xs text-earth-500 dark:text-earth-500 mt-1">
                  Match: {Math.round((1 - result.score) * 100)}%
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
