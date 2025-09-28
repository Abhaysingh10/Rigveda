import React from 'react';
import { Link } from 'react-router-dom';
import { Sukta } from '../types/rigveda';

interface HymnCompactViewProps {
  suktas: Sukta[];
  mandalaNumber: number;
}

const HymnCompactView: React.FC<HymnCompactViewProps> = ({ suktas, mandalaNumber }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-earth-200 dark:border-gray-600 overflow-hidden">
      <div className="divide-y divide-earth-200 dark:divide-gray-600">
        {suktas.map((sukta) => (
          <Link
            key={sukta.suktaId}
            to={`/mandala/${mandalaNumber}/hymn/${sukta.suktaNumber}`}
            className="group block px-6 py-4 hover:bg-earth-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{sukta.suktaNumber}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-earth-800 dark:text-earth-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                    Hymn {sukta.suktaNumber}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-earth-600 dark:text-earth-400">
                    <span className="font-medium text-saffron-600 dark:text-saffron-400">{sukta.deity}</span>
                    <span>•</span>
                    <span>{sukta.rsi}</span>
                    <span>•</span>
                    <span>{sukta.meter}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-earth-500 dark:text-earth-500 bg-earth-100 dark:bg-earth-800 px-2 py-1 rounded-full">
                  {sukta.verses.length} verses
                </span>
                <svg className="w-4 h-4 text-earth-400 group-hover:text-saffron-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HymnCompactView;
