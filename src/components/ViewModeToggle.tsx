import React from 'react';

export type ViewMode = 'grid' | 'card' | 'compact';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ currentMode, onModeChange }) => {
  const modes: { key: ViewMode; label: string; icon: string }[] = [
    { key: 'grid', label: 'Grid', icon: '⊞' },
    { key: 'card', label: 'Cards', icon: '⊡' },
    { key: 'compact', label: 'Compact', icon: '☷' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-earth-600 dark:text-earth-400">View:</span>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-earth-200 dark:border-gray-600">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentMode === mode.key
                ? 'bg-saffron-100 dark:bg-saffron-900 text-saffron-700 dark:text-saffron-300 shadow-sm'
                : 'text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 hover:bg-earth-50 dark:hover:bg-gray-700'
            }`}
            title={mode.label}
          >
            <span className="mr-1">{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewModeToggle;
