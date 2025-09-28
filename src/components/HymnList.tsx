import React, { useState } from 'react';
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

      {/* Content */}
      {renderView()}
    </div>
  );
};

export default HymnList;
