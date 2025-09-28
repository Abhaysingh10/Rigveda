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
          <div className="sanskrit text-lg leading-relaxed text-earth-800 dark:text-earth-200">
            {verse.sanskrit_deva}
          </div>
        );
      case 'transliteration':
        return (
          <div className="text-lg leading-relaxed text-earth-800 dark:text-earth-200 font-mono">
            {verse.transliteration}
          </div>
        );
      case 'translation':
        return (
          <div className="text-lg leading-relaxed text-earth-800 dark:text-earth-200">
            {verse.translation.text}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-earth-800 dark:text-earth-200 mb-4">
          Mandala {mandalaNumber}, Hymn {sukta.suktaNumber}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="text-center">
            <span className="block text-sm text-earth-600 dark:text-earth-400">Deity</span>
            <span className="font-semibold text-earth-800 dark:text-earth-200">{sukta.deity}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-earth-600 dark:text-earth-400">Rishi</span>
            <span className="font-semibold text-earth-800 dark:text-earth-200">{sukta.rsi}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm text-earth-600 dark:text-earth-400">Meter</span>
            <span className="font-semibold text-earth-800 dark:text-earth-200">{sukta.meter}</span>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-earth-100 dark:bg-gray-700 rounded-lg p-1">
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === mode.key
                  ? 'bg-white dark:bg-gray-800 text-saffron-700 dark:text-saffron-300 shadow-sm'
                  : 'text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verses */}
      <div className="space-y-6">
        {sukta.verses.map((verse) => (
          <div key={verse.verseNumber} className="verse-container">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-saffron-700 dark:text-saffron-300">
                  {verse.verseNumber}
                </span>
              </div>
              <div className="flex-1">
                {renderVerseContent(verse)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Translation Attribution */}
      {viewMode === 'translation' && sukta.verses.length > 0 && (
        <div className="mt-8 text-center text-sm text-earth-500 dark:text-earth-500">
          <p>
            Translation: {sukta.verses[0].translation.source} ({sukta.verses[0].translation.license})
          </p>
        </div>
      )}
    </div>
  );
};

export default HymnViewer;
