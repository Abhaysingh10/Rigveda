import React from 'react';

const FooterCredits: React.FC = () => {
  return (
    <footer className="bg-earth-100 dark:bg-gray-800 border-t border-earth-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-earth-600 dark:text-earth-400">
          <p className="mb-2">
            <strong>Rigveda text:</strong> GRETIL (Göttingen Register of Electronic Texts in Indian Languages)
          </p>
          <p className="mb-2">
            <strong>Translation:</strong> R.T.H. Griffith (1896), Public Domain
          </p>
          <p className="text-xs">
            No user data collected • No cookies • No analytics • No tracking
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterCredits;
