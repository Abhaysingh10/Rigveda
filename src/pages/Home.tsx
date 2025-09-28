import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RigvedaData } from '../types/rigveda';
import MandalaGrid from '../components/MandalaGrid';

interface HomeProps {
  data: RigvedaData;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  const totalHymns = data.mandalas.reduce((total, mandala) => total + mandala.suktas.length, 0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearchClick = () => {
    // Navigate to first mandala and focus search
    navigate('/mandala/1');
    // Focus search after a short delay to ensure page loads
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewModesClick = () => {
    // Just show information about view modes - no navigation
    alert('View modes are available in each Mandala page. You can switch between Grid, Cards, and Compact views to browse hymns in different layouts.');
  };

  const handleRandomHymn = () => {
    // Generate random mandala and hymn
    const randomMandala = Math.floor(Math.random() * data.mandalas.length) + 1;
    const mandala = data.mandalas.find(m => m.mandala === randomMandala);
    if (mandala && mandala.suktas.length > 0) {
      const randomSukta = Math.floor(Math.random() * mandala.suktas.length) + 1;
      navigate(`/mandala/${randomMandala}/hymn/${randomSukta}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Floating Sanskrit Characters */}
        <div className="absolute top-20 left-10 w-16 h-16 text-amber-200 dark:text-amber-800 opacity-20 animate-float-slow">
          <div className="sanskrit text-4xl">ॐ</div>
        </div>
        <div className="absolute top-40 right-20 w-12 h-12 text-orange-200 dark:text-orange-800 opacity-15 animate-float-slow delay-1000">
          <div className="sanskrit text-3xl">स्व</div>
        </div>
        <div className="absolute top-60 left-1/4 w-14 h-14 text-yellow-200 dark:text-yellow-800 opacity-20 animate-float-slow delay-2000">
          <div className="sanskrit text-3xl">अग्नि</div>
        </div>
        <div className="absolute top-80 right-1/3 w-10 h-10 text-red-200 dark:text-red-800 opacity-15 animate-float-slow delay-3000">
          <div className="sanskrit text-2xl">इन्द्र</div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-32 left-1/3 w-2 h-2 bg-amber-400 rounded-full opacity-30 animate-ping-slow"></div>
        <div className="absolute top-48 right-1/4 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-40 animate-ping-slow delay-1000"></div>
        <div className="absolute top-72 left-1/5 w-3 h-3 bg-yellow-400 rounded-full opacity-25 animate-ping-slow delay-2000"></div>
        <div className="absolute top-96 right-1/5 w-2.5 h-2.5 bg-red-400 rounded-full opacity-35 animate-ping-slow delay-3000"></div>
      </div>

      {/* Hero Section with Animations */}
      <div className={`text-center mb-12 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-bold text-earth-800 dark:text-earth-200 mb-6 relative">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient-x">
              Rig Veda Explorer
            </span>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 animate-bounce-slow"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-25 animate-bounce-slow delay-1000"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 animate-bounce-slow delay-2000"></div>
          </h1>
        </div>
        
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl text-earth-600 dark:text-earth-400 mb-4 max-w-3xl mx-auto leading-relaxed">
            Explore the ancient wisdom of the Rig Veda through its ten Mandalas. 
            Discover hymns, deities, and the profound teachings of the Vedic seers.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-earth-500 dark:text-earth-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{data.mandalas.length} Mandalas</span>
            </div>
            <div className="w-1 h-1 bg-earth-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500"></div>
              <span>{totalHymns} Hymns</span>
            </div>
            <div className="w-1 h-1 bg-earth-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
              <span>Public Domain</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandala Grid with Staggered Animation */}
      <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-2xl font-semibold text-earth-800 dark:text-earth-200 mb-6 text-center relative">
          Choose a Mandala to Explore
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
        </h2>
        <MandalaGrid data={data} />
      </div>

      {/* Interactive Features */}
      <div className={`grid md:grid-cols-3 gap-8 mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <button 
          onClick={handleSearchClick}
          className="text-center group cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-amber-800 rounded-2xl p-6 transition-all duration-300 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-100 to-orange-100 dark:from-saffron-900 dark:to-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
              <svg className="w-8 h-8 text-saffron-600 dark:text-saffron-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Floating particles around icon */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300 transition-opacity duration-300"></div>
          </div>
          <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Search & Discover
          </h3>
          <p className="text-earth-600 dark:text-earth-400 group-hover:text-earth-700 dark:group-hover:text-earth-300 transition-colors">
            Find hymns by deity, rishi, or content using our powerful search
          </p>
          <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to start searching →
          </div>
        </button>

        <button 
          onClick={handleViewModesClick}
          className="text-center group cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-amber-800 rounded-2xl p-6 transition-all duration-300 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-100 to-orange-100 dark:from-saffron-900 dark:to-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
              <svg className="w-8 h-8 text-saffron-600 dark:text-saffron-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            {/* Floating particles around icon */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300 transition-opacity duration-300"></div>
          </div>
          <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Multiple Views
          </h3>
          <p className="text-earth-600 dark:text-earth-400 group-hover:text-earth-700 dark:group-hover:text-earth-300 transition-colors">
            Read in Sanskrit, transliteration, or English translation
          </p>
          <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to learn more →
          </div>
        </button>

        <button 
          onClick={handleRandomHymn}
          className="text-center group cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-200 dark:focus:ring-amber-800 rounded-2xl p-6 transition-all duration-300 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-100 to-orange-100 dark:from-saffron-900 dark:to-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
              <svg className="w-8 h-8 text-saffron-600 dark:text-saffron-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {/* Floating particles around icon */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300 transition-opacity duration-300"></div>
          </div>
          <h3 className="text-lg font-semibold text-earth-800 dark:text-earth-200 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Random Discovery
          </h3>
          <p className="text-earth-600 dark:text-earth-400 group-hover:text-earth-700 dark:group-hover:text-earth-300 transition-colors">
            Explore random hymns to discover new insights and wisdom
          </p>
          <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click for random hymn →
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
