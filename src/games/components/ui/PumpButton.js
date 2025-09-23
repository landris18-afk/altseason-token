import React from 'react';
import { gameLevels } from '../../data/gameLevels';

/**
 * PumpButton - Pump gomb komponens
 * 
 * Ez a komponens megjeleníti a fő pump gombot:
 * - Pump funkció kezelése
 * - Disabled állapot kezelése
 * - Dinamikus szöveg
 * - Animációk és hover effektek
 * 
 * @param {Object} props - Props objektum
 * @param {Function} props.onPump - Pump funkció
 * @param {Object} props.gameState - Játék állapot
 * @returns {JSX.Element} Pump gomb komponens
 */
const PumpButton = ({ 
  onPump, 
  gameState 
}) => {
  const isDisabled = gameState.levelIndex >= gameLevels.length - 1 || gameState.marketCap >= 5e12;
  
  // Gomb szöveg meghatározása
  const getButtonText = () => {
    if (gameState.marketCap >= 5e12) return "MAXIMUM REACHED";
    if (gameState.levelIndex >= gameLevels.length - 1) return "MAX LEVEL REACHED";
    return "PUMP THE BULL";
  };

  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={onPump}
        disabled={isDisabled}
        className={`relative py-6 px-12 rounded-full font-bold text-2xl transition-all duration-300 ${
          isDisabled
            ? 'cursor-not-allowed bg-gray-800 border-2 border-gray-700'
            : 'bg-yellow-500 hover:opacity-90 active:scale-95 shadow-yellow-500/20 text-gray-900'
        }`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default PumpButton;

