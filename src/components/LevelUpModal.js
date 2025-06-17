import React from 'react';
import { levelColors } from './BullRunGame';

const LevelUpModal = ({ isOpen, onClose, newLevel, nextLevel }) => {
  if (!isOpen) return null;

  const nextLevelColor = levelColors[newLevel + 1] || levelColors[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-gray-900 p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 border-4 ${nextLevelColor.buttonBg} border-opacity-50`}>
        <h2 className="text-3xl font-bold text-center mb-4 text-white">LEVEL UP!</h2>
        <p className="text-xl text-center mb-6 text-white">
          Congratulations, you have become:
        </p>
        <p className={`text-2xl font-bold text-center mb-8 ${nextLevelColor.text}`}>
          {nextLevel}
        </p>
        <button
          onClick={onClose}
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 ${nextLevelColor.buttonBg} hover:opacity-90 active:scale-95 ${nextLevelColor.buttonShadow}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal; 