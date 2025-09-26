/**
 * LeaderboardHeader - Ranglista fejléc komponens
 * 
 * Ez a komponens kezeli a ranglista fejlécét:
 * - Cím és alcím megjelenítése
 * - Play/Start Game gomb
 * - User dropdown és bezárás gomb
 */

import React from 'react';
import { useUser } from '@clerk/nextjs';
import UserDropdown from '../ui/UserDropdown';

const LeaderboardHeader = ({ 
  onStartGame, 
  onClose, 
  onTransfer, 
  onShowAuth,
  isDesktop = true 
}) => {
  const { isSignedIn } = useUser();

  const handleStartGame = () => {
    if (isSignedIn) {
      onStartGame();
    } else {
      onShowAuth();
    }
  };

  return (
    <div className="leaderboard-header">
      <div className="header-left" style={{lineHeight: '0.8', paddingTop: '24px', paddingBottom: '24px'}}>
        <h1 className="leaderboard-title text-xs font-bold text-yellow-400" style={{margin: '0', padding: '0', lineHeight: '0.8'}}>
          BULL RUN LEADERBOARD
        </h1>
        <p className="leaderboard-subtitle text-xs text-gray-300" style={{margin: '0', padding: '0', lineHeight: '0.8', marginTop: '4px'}}>
          Top Pumpers of All Time
        </p>
      </div>
      
      <div className="header-right">
        <button 
          className="start-game-btn" 
          onClick={handleStartGame}
        >
          {isSignedIn ? 'Play Now' : 'START GAME'}
        </button>
        
        <div className="flex items-center gap-3">
          {isSignedIn && (
            <UserDropdown onTransfer={onTransfer} />
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 bg-gray-800/90 hover:bg-gray-700/95 text-white/90 hover:text-white transition-all duration-200 rounded-xl backdrop-blur-sm border border-gray-600/60 hover:border-gray-500/80 shadow-lg hover:shadow-xl"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
