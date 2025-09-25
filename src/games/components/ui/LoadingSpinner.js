import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'yellow', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    white: 'text-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinning loader */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full border-4 border-gray-600 border-t-transparent`}></div>
        
        {/* Inner pulsing dot */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${colorClasses[color]} rounded-full animate-pulse`}></div>
      </div>
      
      {/* Loading message */}
      <div className={`${colorClasses[color]} text-sm font-medium animate-pulse`}>
        {message}
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-1">
        <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
