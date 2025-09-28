import React from 'react';
import { RigvedaData } from '../types/rigveda';
import MandalaGrid from '../components/MandalaGrid';

interface HomeProps {
  data: RigvedaData;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  const totalHymns = data.mandalas.reduce((total, mandala) => total + mandala.suktas.length, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-earth-800 dark:text-earth-200 mb-6">
          Rig Veda Explorer
        </h1>
        <p className="text-xl text-earth-600 dark:text-earth-400 mb-4 max-w-3xl mx-auto">
          Explore the ancient wisdom of the Rig Veda through its ten Mandalas. 
          Discover hymns, deities, and the profound teachings of the Vedic seers.
        </p>
        <div className="text-sm text-earth-500 dark:text-earth-500">
          {data.mandalas.length} Mandalas • {totalHymns} Hymns • Public Domain
        </div>
      </div>

      {/* Mandala Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-earth-800 dark:text-earth-200 mb-6 text-center">
          Choose a Mandala to Explore
        </h2>
        <MandalaGrid data={data} />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-saffron-600 dark:text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200 mb-2">
            Search & Discover
          </h3>
          <p className="text-earth-600 dark:text-earth-400">
            Find hymns by deity, rishi, or content using our powerful search
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-saffron-600 dark:text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200 mb-2">
            Multiple Views
          </h3>
          <p className="text-earth-600 dark:text-earth-400">
            Read in Sanskrit, transliteration, or English translation
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-saffron-100 dark:bg-saffron-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-saffron-600 dark:text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200 mb-2">
            Random Discovery
          </h3>
          <p className="text-earth-600 dark:text-earth-400">
            Explore random hymns to discover new insights and wisdom
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
