import React from 'react';

const ModernLoader = ({ message = 'Loading leaderboard...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinner container */}
      <div className="relative mb-6">
        {/* Main spinner */}
        <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-spin border-t-yellow-400"></div>
        
        {/* Inner glow effect */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin border-t-yellow-300/30" style={{ animationDuration: '1.5s' }}></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      {/* Loading text with gradient */}
      <div className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent animate-pulse">
        {message}
      </div>
      
      {/* Animated dots */}
      <div className="flex space-x-1 mt-3">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default ModernLoader;
