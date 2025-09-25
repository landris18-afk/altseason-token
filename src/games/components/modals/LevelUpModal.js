import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { levelColors } from '../../data/levelColors';

const LevelUpModal = ({ isOpen, onClose, levelName, twitterUrl, levelIndex }) => {
  if (!isOpen) return null;
  
  const currentLevelColor = levelColors[levelIndex] || levelColors[0];
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10005] p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Level Up!
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 text-center">
          {/* Success Icon */}
          <FaCheckCircle className="text-6xl text-yellow-400 mx-auto mb-4" />
          
          {/* Title */}
          <h3 className="text-3xl font-bold mb-2 text-white">LEVEL UP!</h3>
          <p className="text-white text-lg mb-4">Congratulations, you have become:</p>
          
          {/* Level Name */}
          <p className={`text-2xl font-bold ${currentLevelColor.text} mb-6`}>{levelName}</p>
          
          {/* Share Button */}
          <div className="mb-6">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 hover:from-sky-600 hover:via-blue-600 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-sky-500/25 transform hover:scale-105 border border-sky-400/30"
            >
              <FaXTwitter className="text-lg" />
              <span>Share Score</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-gray-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 transform hover:scale-105 border border-yellow-400/30"
          >
            Continue Pumping
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;