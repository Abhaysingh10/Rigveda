import React from 'react';
import { Link } from 'react-router-dom';
import { Mandala } from '../types/rigveda';

interface MandalaCardProps {
  mandala: Mandala;
}

const MandalaCard: React.FC<MandalaCardProps> = ({ mandala }) => {
  const suktaCount = mandala.suktas.length;

  return (
    <Link 
      to={`/mandala/${mandala.mandala}`}
      className="mandala-card block hover:scale-105 transition-transform duration-200"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-saffron-700 dark:text-saffron-300">
            {mandala.mandala}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-earth-800 dark:text-earth-200 mb-2">
          Mandala {mandala.mandala}
        </h3>
        
        <p className="text-earth-600 dark:text-earth-400">
          {suktaCount} {suktaCount === 1 ? 'Hymn' : 'Hymns'}
        </p>
        
        {suktaCount > 0 && (
          <div className="mt-4 text-sm text-earth-500 dark:text-earth-500">
            <p className="font-medium">{mandala.suktas[0].deity}</p>
            <p className="text-xs">{mandala.suktas[0].rsi}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MandalaCard;
