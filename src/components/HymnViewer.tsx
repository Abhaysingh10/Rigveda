import React, { useState } from 'react';
import { Sukta, ViewMode } from '../types/rigveda';

interface HymnViewerProps {
  sukta: Sukta;
  mandalaNumber: number;
}

const HymnViewer: React.FC<HymnViewerProps> = ({ sukta, mandalaNumber }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('sanskrit');

  const viewModes: { key: ViewMode; label: string }[] = [
    { key: 'sanskrit', label: 'Sanskrit' },
    { key: 'transliteration', label: 'Transliteration' },
    { key: 'translation', label: 'Translation' }
  ];

  const renderVerseContent = (verse: any) => {
    switch (viewMode) {
      case 'sanskrit':
        return (
          <div className="sanskrit text-xl leading-loose text-earth-800 dark:text-earth-200 font-medium">
            {verse.sanskrit_deva}
          </div>
        );
      case 'transliteration':
        return (
          <div className="text-xl leading-loose text-earth-800 dark:text-earth-200 font-mono tracking-wide">
            {verse.transliteration}
          </div>
        );
      case 'translation':
        return (
          <div className="text-xl leading-loose text-earth-800 dark:text-earth-200 font-serif">
            {verse.translation.text}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="bg-gradient-to-r from-saffron-50 to-earth-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 md:p-8 shadow-lg border border-earth-200 dark:border-gray-600">
          <h1 className="text-4xl md:text-5xl font-bold text-earth-800 dark:text-earth-200 mb-6 tracking-tight">
            Mandala {mandalaNumber}, Hymn {sukta.suktaNumber}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-md border border-earth-100 dark:border-gray-600 min-w-[100px] md:min-w-[120px]">
              <div className="w-8 h-8 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-saffron-600 dark:text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="block text-xs font-medium text-earth-500 dark:text-earth-400 uppercase tracking-wide">Deity</span>
              <span className="font-bold text-lg text-earth-800 dark:text-earth-200">{sukta.deity}</span>
            </div>
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-md border border-earth-100 dark:border-gray-600 min-w-[100px] md:min-w-[120px]">
              <div className="w-8 h-8 bg-earth-100 dark:bg-earth-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-earth-600 dark:text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="block text-xs font-medium text-earth-500 dark:text-earth-400 uppercase tracking-wide">Rishi</span>
              <span className="font-bold text-lg text-earth-800 dark:text-earth-200">{sukta.rsi}</span>
            </div>
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 shadow-md border border-earth-100 dark:border-gray-600 min-w-[100px] md:min-w-[120px]">
              <div className="w-8 h-8 bg-earth-100 dark:bg-earth-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-earth-600 dark:text-earth-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="block text-xs font-medium text-earth-500 dark:text-earth-400 uppercase tracking-wide">Meter</span>
              <span className="font-bold text-lg text-earth-800 dark:text-earth-200">{sukta.meter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-earth-200 dark:border-gray-600">
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === mode.key
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg transform scale-105'
                  : 'text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 hover:bg-earth-50 dark:hover:bg-gray-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verses */}
      <div className="space-y-8">
        {sukta.verses.map((verse) => (
          <div key={verse.verseNumber} className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 shadow-lg border border-earth-200 dark:border-gray-600 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-white">
                  {verse.verseNumber}
                </span>
              </div>
              <div className="flex-1">
                <div className="prose prose-lg max-w-none">
                  {renderVerseContent(verse)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Translation Attribution */}
      {viewMode === 'translation' && sukta.verses.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-earth-50 dark:bg-gray-800 rounded-xl p-6 border border-earth-200 dark:border-gray-600">
            <p className="text-sm text-earth-600 dark:text-earth-400">
              <span className="font-semibold">Translation:</span> {sukta.verses[0].translation.source} 
              <span className="text-earth-500 dark:text-earth-500"> ({sukta.verses[0].translation.license})</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HymnViewer;
