import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { levelColors } from '../../data/levelColors';

/**
 * LevelUpModal - Szintlépés modal
 * 
 * Ez a komponens megjeleníti a szintlépés ünnepélyét:
 * - Gratuláció és új szint megjelenítése
 * - Szint színek alkalmazása
 * - Twitter megosztás gomb
 * - Folytatás gomb
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott állapot
 * @param {Function} props.onClose - Bezárás kezelő
 * @param {string} props.levelName - Új szint neve
 * @param {string} props.twitterUrl - Twitter megosztás URL
 * @param {number} props.levelIndex - Szint index
 * @returns {JSX.Element|null} Modal komponens vagy null
 */
const LevelUpModal = ({ isOpen, onClose, levelName, twitterUrl, levelIndex }) => {
  if (!isOpen) return null;
  
  const currentLevelColor = levelColors[levelIndex] || levelColors[0];
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-white border-opacity-50 rounded-2xl shadow-lg p-8 max-w-md w-full text-center text-white animate-fade-in-up">
        {/* Success Icon */}
        <FaCheckCircle className="text-6xl text-yellow-400 mx-auto mb-4" />
        
        {/* Title */}
        <h3 className="text-3xl font-bold mb-2 text-white">LEVEL UP!</h3>
        <p className="text-white text-lg mb-4">Congratulations, you have become:</p>
        
        {/* Level Name */}
        <p className={`text-2xl font-bold ${currentLevelColor.text} mb-6`}>{levelName}</p>
        
        {/* Share Button */}
        <div className="pt-4 border-t border-white/20">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-sky-400 transition-all shadow-lg"
          >
            <FaXTwitter />
            <span>Share Score</span>
          </a>
        </div>
        
        {/* Continue Button */}
        <button
          onClick={onClose}
          className="mt-6 bg-yellow-500 font-semibold py-2 px-8 rounded-lg hover:opacity-90 transition-all w-full text-gray-900"
        >
          Continue Pumping
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;






