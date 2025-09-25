import React from 'react';

/**
 * GameHeader - Játék fejléc komponens
 * 
 * Ez a komponens megjeleníti a játék fő címét és leírását:
 * - Játék neve
 * - Motto/leírás
 * - Reszponzív design
 * 
 * @returns {JSX.Element} Játék fejléc komponens
 */
const GameHeader = () => {
  return (
    <div className="text-center mb-16 relative">
      {/* Sötétítés a Bull Run Clicker szekcióhoz */}
      <div className="absolute inset-0 bg-black/40 rounded-3xl -mx-4 -my-8"></div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Game icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl border border-yellow-400/30 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-2xl blur-xl -z-10"></div>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Bull Run Clicker
        </h2>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">
          How high can you pump the market cap?
        </p>
        
        {/* Description */}
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Experience the ultimate crypto pump simulation. Click your way to the moon, 
          unlock powerful upgrades, and dominate the leaderboard!
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 backdrop-blur-sm">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm text-gray-300">Leaderboard</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 backdrop-blur-sm">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-300">Upgrades</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 backdrop-blur-sm">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-sm text-gray-300">Real-time Progress</span>
          </div>
        </div>

        {/* Play Game Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => window.location.href = '/game'}
            className="group relative px-20 py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-white font-bold text-3xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border-2 border-yellow-400/50 hover:border-yellow-300/70"
          >
            <span className="relative z-10 flex items-center gap-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              PLAY GAME
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;

