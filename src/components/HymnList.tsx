import React, { useEffect, useMemo, useState } from 'react';
import { Sukta } from '../types/rigveda';
import ViewModeToggle, { ViewMode } from './ViewModeToggle';
import HymnGridView from './HymnGridView';
import HymnCardView from './HymnCardView';
import HymnCompactView from './HymnCompactView';

interface HymnListProps {
  suktas: Sukta[];
  mandalaNumber: number;
}

const HymnList: React.FC<HymnListProps> = ({ suktas, mandalaNumber }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  useEffect(() => {
    const saved = window.localStorage.getItem('viewMode');
    if (saved === 'grid' || saved === 'card' || saved === 'compact') {
      setViewMode(saved as ViewMode);
    } else {
      setViewMode('compact');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const renderView = () => {
    switch (viewMode) {
      case 'grid':
        return <HymnGridView suktas={suktas} mandalaNumber={mandalaNumber} />;
      case 'card':
        return <HymnCardView suktas={suktas} mandalaNumber={mandalaNumber} />;
      case 'compact':
        return <HymnCompactView suktas={suktas} mandalaNumber={mandalaNumber} />;
      default:
        return <HymnCardView suktas={suktas} mandalaNumber={mandalaNumber} />;
    }
  };

  return (
    <div>
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-earth-800 dark:text-earth-200">
            Hymns ({suktas.length})
          </h2>
        </div>
        <ViewModeToggle currentMode={viewMode} onModeChange={setViewMode} />
      </div>

      {/* Content or Skeleton */}
      {suktas.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-earth-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        renderView()
      )}
    </div>
  );
};

export default HymnList;
