import React from 'react';

/**
 * LoadingScreen - Betöltő képernyő komponens
 * 
 * Ez a komponens megjeleníti a játék betöltési animációját:
 * - Spinner animáció
 * - Betöltési szöveg
 * - Ping animáció
 * - Bounce pontok
 * 
 * @returns {JSX.Element} Betöltő képernyő komponens
 */
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center" style={{
      background: 'url(/images/rockat_pump_bacground.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <div className="text-white text-xl font-bold">Loading Bull Run...</div>
        <div className="text-gray-400 text-sm mt-2">Preparing your market cap adventure</div>
      </div>
    </div>
  );
};

export default LoadingScreen;