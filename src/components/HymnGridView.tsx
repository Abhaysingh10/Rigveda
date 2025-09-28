import React from 'react';
import { Link } from 'react-router-dom';
import { Sukta } from '../types/rigveda';

interface HymnGridViewProps {
  suktas: Sukta[];
  mandalaNumber: number;
}

const HymnGridView: React.FC<HymnGridViewProps> = ({ suktas, mandalaNumber }) => {
  // Generate decorative patterns based on hymn number
  const getDecorativePattern = (hymnNumber: number) => {
    const patterns = [
      // Mandala-inspired patterns
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zm0 3.8L9.5 9.5 12 11.2l2.5-1.7L12 5.8z"
    ];
    return patterns[hymnNumber % patterns.length];
  };

  const getBackgroundGradient = (hymnNumber: number) => {
    const gradients = [
      "from-purple-400 via-pink-500 to-red-500",
      "from-blue-400 via-purple-500 to-pink-500", 
      "from-green-400 via-blue-500 to-purple-500",
      "from-yellow-400 via-orange-500 to-red-500",
      "from-pink-400 via-red-500 to-yellow-500",
      "from-indigo-400 via-purple-500 to-pink-500"
    ];
    return gradients[hymnNumber % gradients.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suktas.map((sukta) => (
        <Link
          key={sukta.suktaId}
          to={`/mandala/${mandalaNumber}/hymn/${sukta.suktaNumber}`}
          className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:-translate-y-2 hover:scale-105"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <div className="absolute top-4 right-4 w-32 h-32">
              <svg className="w-full h-full text-amber-400 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                <path d={getDecorativePattern(sukta.suktaNumber)} />
              </svg>
            </div>
            <div className="absolute bottom-4 left-4 w-24 h-24">
              <svg className="w-full h-full text-orange-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>

          {/* Top Accent Bar with Gradient */}
          <div className={`h-2 bg-gradient-to-r ${getBackgroundGradient(sukta.suktaNumber)} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
          
          {/* Floating Decorative Elements */}
          <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 animate-bounce-slow"></div>
          <div className="absolute top-12 right-12 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-bounce-slow delay-1000"></div>
          
          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Header Section with Enhanced Visual */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-xl font-bold text-white">{sukta.suktaNumber}</span>
                  </div>
                  {/* Floating particles around number */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-400 rounded-full animate-ping delay-500"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Hymn {sukta.suktaNumber}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sukta.verses.length} {sukta.verses.length === 1 ? 'verse' : 'verses'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Metadata Grid with Icons */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-amber-100 dark:border-gray-600 group-hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Deity</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{sukta.deity}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-orange-100 dark:border-gray-600 group-hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Rishi</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{sukta.rsi}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-yellow-100 dark:border-gray-600 group-hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Meter</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{sukta.meter}</span>
              </div>
            </div>

            {/* Enhanced Sanskrit Preview */}
            {sukta.verses.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 group-hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <span className="text-sm font-bold text-white">सं</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sanskrit Preview</span>
                  <div className="ml-auto w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                </div>
                <p className="sanskrit text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {sukta.verses[0].sanskrit_deva}
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Bottom Action Bar */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-t border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Click to explore this sacred hymn</span>
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <span className="text-sm font-medium">Read</span>
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect on Hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/0 via-orange-500/0 to-red-500/0 group-hover:from-amber-400/5 group-hover:via-orange-500/5 group-hover:to-red-500/5 transition-all duration-500 pointer-events-none"></div>
        </Link>
      ))}
    </div>
  );
};

export default HymnGridView;
