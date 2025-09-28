import React from 'react';
import { Link } from 'react-router-dom';
import { Sukta } from '../types/rigveda';

interface HymnCardViewProps {
  suktas: Sukta[];
  mandalaNumber: number;
}

const HymnCardView: React.FC<HymnCardViewProps> = ({ suktas, mandalaNumber }) => {
  return (
    <div className="space-y-6">
      {suktas.map((sukta) => (
        <Link
          key={sukta.suktaId}
          to={`/mandala/${mandalaNumber}/hymn/${sukta.suktaNumber}`}
          className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-earth-200 dark:border-gray-600 overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">{sukta.suktaNumber}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-earth-800 dark:text-earth-200 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                    Hymn {sukta.suktaNumber}
                  </h3>
                  <p className="text-sm text-earth-500 dark:text-earth-500">
                    {sukta.verses.length} {sukta.verses.length === 1 ? 'verse' : 'verses'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-saffron-100 dark:bg-saffron-900 text-saffron-800 dark:text-saffron-200 text-sm font-semibold rounded-full">
                  {sukta.deity}
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-earth-600 dark:text-earth-400 uppercase tracking-wide">Deity</h4>
                <p className="text-lg font-medium text-earth-800 dark:text-earth-200">{sukta.deity}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-earth-600 dark:text-earth-400 uppercase tracking-wide">Rishi</h4>
                <p className="text-lg font-medium text-earth-800 dark:text-earth-200">{sukta.rsi}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-earth-600 dark:text-earth-400 uppercase tracking-wide">Meter</h4>
                <p className="text-lg font-medium text-earth-800 dark:text-earth-200">{sukta.meter}</p>
              </div>
            </div>
            
            {sukta.verses.length > 0 && (
              <div className="border-t border-earth-200 dark:border-gray-600 pt-6">
                <h4 className="text-sm font-semibold text-earth-600 dark:text-earth-400 uppercase tracking-wide mb-3">Preview</h4>
                <div className="space-y-3">
                  <p className="sanskrit text-lg text-earth-800 dark:text-earth-200 font-medium">
                    {sukta.verses[0].sanskrit_deva}
                  </p>
                  <p className="text-earth-600 dark:text-earth-400 italic">
                    "{sukta.verses[0].translation.text.substring(0, 200)}
                    {sukta.verses[0].translation.text.length > 200 ? '...' : ''}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HymnCardView;
