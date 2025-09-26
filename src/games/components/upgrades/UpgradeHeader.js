/**
 * UpgradeHeader.js - Upgrade panel header komponens
 * 
 * Ez a komponens megjeleníti az upgrade panel header-ét:
 * - Panel címe
 * - Vissza gomb
 * - Stílusozás
 */

import React from 'react';

/**
 * UpgradeHeader - Upgrade panel header komponens
 * 
 * @param {Function} onBackToLeaderboard - Vissza a ranglistához függvény
 * @param {boolean} isSaving - Mentés állapot flag
 * @returns {JSX.Element} Header komponens
 */
const UpgradeHeader = ({ onBackToLeaderboard, isSaving = false }) => {
  return (
    <div className="mb-4">
      {/* Desktop: normál header */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-4xl font-bold text-gray-300">Upgrades</h3>
          {onBackToLeaderboard && (
            <button
              onClick={() => onBackToLeaderboard(false)}
              disabled={isSaving}
              className={`rounded-full p-2 border transition-all duration-200 ${
                isSaving
                  ? 'bg-red-600 text-white border-red-500 cursor-not-allowed'
                  : 'bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white border-yellow-400/30 hover:border-yellow-400/50'
              }`}
              style={isSaving ? { 
                backgroundColor: '#dc2626', 
                color: 'white', 
                cursor: 'not-allowed'
              } : {}}
              title={isSaving ? "Saving..." : "Back to Leaderboard"}
            >
              {isSaving ? (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-xs">💾</span>
                </div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              )}
            </button>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      </div>
      
      {/* Mobile: nincs header, mert az a GameModal-ban van kezelve */}
    </div>
  );
};

export default UpgradeHeader;
