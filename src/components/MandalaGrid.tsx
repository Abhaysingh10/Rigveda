import React from 'react';
import { RigvedaData } from '../types/rigveda';
import MandalaCard from './MandalaCard';

interface MandalaGridProps {
  data: RigvedaData;
}

const MandalaGrid: React.FC<MandalaGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {data.mandalas.map((mandala) => (
        <MandalaCard key={mandala.mandala} mandala={mandala} />
      ))}
    </div>
  );
};

export default MandalaGrid;
