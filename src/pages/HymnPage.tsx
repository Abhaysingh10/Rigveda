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
          <div>
            <button
              onClick={() => navigate('/tree')}
              className="px-3 py-2 bg-earth-100 dark:bg-gray-700 text-earth-700 dark:text-earth-200 rounded hover:bg-earth-200 dark:hover:bg-gray-600"
            >
              View in Tree
            </button>
          </div>
        </div>
      </div>

      {/* Hymn Viewer */}
      <HymnViewer sukta={sukta} mandalaNumber={mandalaNum} />

      {/* Enhanced Navigation between hymns */}
      <div className="mt-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-earth-200 dark:border-gray-600 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Previous Hymn */}
            <div className="flex-1">
              {suktaNum > 1 ? (
                <button
                  onClick={() => navigate(`/mandala/${mandalaNum}/hymn/${suktaNum - 1}`)}
                  className="group flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-earth-50 to-earth-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-saffron-50 hover:to-saffron-100 dark:hover:from-saffron-900 dark:hover:to-saffron-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center group-hover:bg-saffron-200 dark:group-hover:bg-saffron-800 transition-colors">
                    <svg className="w-5 h-5 text-saffron-600 dark:text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-earth-600 dark:text-earth-400 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                      Previous Hymn
                    </p>
                    <p className="text-lg font-bold text-earth-800 dark:text-earth-200 group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
                      Hymn {suktaNum - 1}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="px-6 py-4 opacity-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Previous Hymn</p>
                      <p className="text-lg font-bold text-gray-400">First Hymn</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center Info */}
            <div className="flex-1 text-center px-4 lg:px-6 w-full lg:w-auto">
              <div className="bg-gradient-to-r from-saffron-100 to-saffron-200 dark:from-saffron-900 dark:to-saffron-800 rounded-xl p-4">
                <p className="text-sm font-semibold text-saffron-700 dark:text-saffron-300 uppercase tracking-wide">
                  Current Hymn
                </p>
                <p className="text-2xl font-bold text-saffron-800 dark:text-saffron-200">
                  {suktaNum} of {mandala.suktas.length}
                </p>
                <div className="mt-2 w-full bg-saffron-200 dark:bg-saffron-700 rounded-full h-2">
                  <div 
                    className="bg-saffron-600 dark:bg-saffron-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(suktaNum / mandala.suktas.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Next Hymn */}
            <div className="flex-1">
              {suktaNum < mandala.suktas.length ? (
                <button
                  onClick={() => navigate(`/mandala/${mandalaNum}/hymn/${suktaNum + 1}`)}
                  className="group flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-earth-50 to-earth-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-saffron-50 hover:to-saffron-100 dark:hover:from-saffron-900 dark:hover:to-saffron-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ml-auto"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-earth-600 dark:text-earth-400 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                      Next Hymn
                    </p>
                    <p className="text-lg font-bold text-earth-800 dark:text-earth-200 group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition-colors">
                      Hymn {suktaNum + 1}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center group-hover:bg-saffron-200 dark:group-hover:bg-saffron-800 transition-colors">
                    <svg className="w-5 h-5 text-saffron-600 dark:text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ) : (
                <div className="px-6 py-4 opacity-50 ml-auto">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Next Hymn</p>
                      <p className="text-lg font-bold text-gray-400">Last Hymn</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HymnPage;
