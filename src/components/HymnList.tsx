import React from 'react';
import { Link } from 'react-router-dom';
import { Sukta } from '../types/rigveda';

interface HymnListProps {
  suktas: Sukta[];
  mandalaNumber: number;
}

const HymnList: React.FC<HymnListProps> = ({ suktas, mandalaNumber }) => {
  return (
    <div className="space-y-4">
      {suktas.map((sukta) => (
        <Link
          key={sukta.suktaId}
          to={`/mandala/${mandalaNumber}/hymn/${sukta.suktaNumber}`}
          className="hymn-card block hover:scale-102 transition-transform duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200">
              Hymn {sukta.suktaNumber}
            </h3>
            <span className="text-sm text-earth-500 dark:text-earth-500">
              {sukta.verses.length} {sukta.verses.length === 1 ? 'verse' : 'verses'}
            </span>
          </div>
          
          <div className="mb-3">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-1 bg-saffron-100 dark:bg-saffron-900 text-saffron-800 dark:text-saffron-200 text-xs rounded-full">
                {sukta.deity}
              </span>
              <span className="px-2 py-1 bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 text-xs rounded-full">
                {sukta.rsi}
              </span>
              <span className="px-2 py-1 bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 text-xs rounded-full">
                {sukta.meter}
              </span>
            </div>
          </div>
          
          {sukta.verses.length > 0 && (
            <div className="text-sm text-earth-600 dark:text-earth-400">
              <p className="sanskrit text-base mb-1">
                {sukta.verses[0].sanskrit_deva}
              </p>
              <p className="italic">
                "{sukta.verses[0].translation.text.substring(0, 100)}
                {sukta.verses[0].translation.text.length > 100 ? '...' : ''}"
              </p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default HymnList;
