import React from 'react';

const LeaderboardLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Main loading container */}
      <div className="relative">
        {/* Bull icon with rotation */}
        <div className="text-6xl mb-6 animate-spin" style={{ animationDuration: '2s' }}>
          🐂
        </div>
        
        {/* Market cap counter animation */}
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          $1M+
        </div>
      </div>

      {/* Loading title */}
      <div className="text-2xl font-bold text-yellow-400 mb-2 animate-pulse">
        BULL RUN LEADERBOARD
      </div>
      
      {/* Loading subtitle */}
      <div className="text-gray-300 text-sm mb-8 animate-pulse">
        Loading Top Pumpers...
      </div>

      {/* Animated progress bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-pulse" 
             style={{
               animation: 'progressBar 2s ease-in-out infinite',
               width: '100%'
             }}>
        </div>
      </div>

      {/* Loading stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/50">
          <div className="text-yellow-400 font-bold text-lg animate-pulse">🏆</div>
          <div className="text-gray-300 text-xs">Ranking</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/50">
          <div className="text-green-400 font-bold text-lg animate-pulse">📈</div>
          <div className="text-gray-300 text-xs">Market Cap</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/50">
          <div className="text-blue-400 font-bold text-lg animate-pulse">⚡</div>
          <div className="text-gray-300 text-xs">Loading</div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Custom CSS for progress bar animation */}
      <style jsx>{`
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardLoader;
