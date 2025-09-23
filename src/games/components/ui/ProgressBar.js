import React from 'react';
import { fmt } from '../../utils/gameUtils';

/**
 * ProgressBar - Progress bar komponens
 * 
 * Ez a komponens megjeleníti a játék progress bar-ját:
 * - Jelenlegi rang megjelenítése
 * - Progress bar animáció
 * - Következő szint információk
 * - Desktop és mobile nézetek
 * 
 * @param {Object} props - Props objektum
 * @param {Object} props.current - Jelenlegi szint
 * @param {Object} props.next - Következő szint
 * @param {string} props.currentTextColor - Jelenlegi szint színe
 * @param {string} props.currentBarFrom - Progress bar kezdő színe
 * @param {string} props.currentBarTo - Progress bar végző színe
 * @param {number} props.progress - Progress érték (0-100)
 * @param {number} props.safeMarketCap - Biztonságos Market Cap érték (tartalmazza a passzív jövedelmet)
 * @returns {JSX.Element} Progress bar komponens
 */
const ProgressBar = ({ 
  current, 
  next, 
  currentTextColor, 
  currentBarFrom, 
  currentBarTo, 
  progress, 
  safeMarketCap
}) => {
  return (
    <div className="mb-4">
      {/* Mobile nézet */}
      <div className="md:hidden">
        <p className="text-lg font-bold text-gray-400 text-left">Current Rank:</p>
        <p className={`text-xl font-bold ${currentTextColor} text-left -mt-1`}>{current.name}</p>
      </div>
      
      {/* Desktop nézet */}
      <div className="hidden md:flex justify-between items-end mb-1">
        <p className="text-lg font-bold">
          <span className="text-gray-400 font-normal">Current Rank: </span>
          <span className={currentTextColor}>{current.name}</span>
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-4 mt-1">
        <div
          className={`h-4 rounded-full transition-all duration-300 bg-gradient-to-r ${currentBarFrom} ${currentBarTo}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Progress info */}
      <div className="w-full text-right mt-1">
        <p className="text-sm text-gray-400 font-mono">
          {next ? `Next: $${fmt(safeMarketCap)}/$${fmt(next.threshold)}` : (window.innerWidth >= 768 ? "MAX LEVEL" : "MAX")}
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;

