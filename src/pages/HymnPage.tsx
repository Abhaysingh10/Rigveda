import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RigvedaData } from '../types/rigveda';
import HymnViewer from '../components/HymnViewer';

interface HymnPageProps {
  data: RigvedaData;
}

const HymnPage: React.FC<HymnPageProps> = ({ data }) => {
  const { mandalaNumber, suktaNumber } = useParams<{ mandalaNumber: string; suktaNumber: string }>();
  const navigate = useNavigate();

  const mandalaNum = parseInt(mandalaNumber || '1');
  const suktaNum = parseInt(suktaNumber || '1');

  const mandala = data.mandalas.find(m => m.mandala === mandalaNum);
  const sukta = mandala?.suktas.find(s => s.suktaNumber === suktaNum);

  useEffect(() => {
    // Update page title
    if (sukta) {
      document.title = `Mandala ${mandalaNum}, Hymn ${suktaNum} - Rig Veda Explorer`;
    }
  }, [sukta, mandalaNum, suktaNum]);

  if (!mandala) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-earth-800 dark:text-earth-200 mb-4">
          Mandala {mandalaNumber} not found
        </h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!sukta) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-earth-800 dark:text-earth-200 mb-4">
          Hymn {suktaNumber} not found in Mandala {mandalaNumber}
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/mandala/${mandalaNum}`)}
            className="px-4 py-2 bg-saffron-600 text-white rounded-lg hover:bg-saffron-700"
          >
            View Mandala {mandalaNum}
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 transition-colors duration-200"
            >
              ← Home
            </button>
            <span className="text-earth-400 dark:text-earth-600">/</span>
            <button
              onClick={() => navigate(`/mandala/${mandalaNum}`)}
              className="text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 transition-colors duration-200"
            >
              Mandala {mandalaNum}
            </button>
            <span className="text-earth-400 dark:text-earth-600">/</span>
            <span className="text-earth-800 dark:text-earth-200 font-medium">
              Hymn {suktaNum}
            </span>
          </div>
        </div>
      </div>

      {/* Hymn Viewer */}
      <HymnViewer sukta={sukta} mandalaNumber={mandalaNum} />

      {/* Navigation between hymns */}
      <div className="mt-12 flex justify-between">
        <div>
          {suktaNum > 1 ? (
            <button
              onClick={() => navigate(`/mandala/${mandalaNum}/hymn/${suktaNum - 1}`)}
              className="px-4 py-2 bg-earth-100 dark:bg-earth-700 text-earth-700 dark:text-earth-300 rounded-lg hover:bg-earth-200 dark:hover:bg-earth-600 transition-colors duration-200"
            >
              ← Previous Hymn
            </button>
          ) : (
            <div></div>
          )}
        </div>
        
        <div>
          {suktaNum < mandala.suktas.length ? (
            <button
              onClick={() => navigate(`/mandala/${mandalaNum}/hymn/${suktaNum + 1}`)}
              className="px-4 py-2 bg-earth-100 dark:bg-earth-700 text-earth-700 dark:text-earth-300 rounded-lg hover:bg-earth-200 dark:hover:bg-earth-600 transition-colors duration-200"
            >
              Next Hymn →
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HymnPage;
