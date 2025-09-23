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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      {/* Spinner animáció */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-yellow-500/30 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Betöltési szöveg */}
      <h2 className="text-2xl font-bold mb-2 animate-pulse">Loading Bull Run Clicker</h2>
      <p className="text-gray-400 text-sm">Preparing your bull market adventure...</p>
      
      {/* Bounce pontok */}
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;