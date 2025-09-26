/**
 * MobileLeaderboard - Mobile ranglista komponens
 * 
 * Ez a komponens kezeli a mobile verzió megjelenítését
 */

import React from 'react';
import LeaderboardTable from './LeaderboardTable';
import LeaderboardControls from './LeaderboardControls';
import UserDropdown from '../ui/UserDropdown';
import LeaderboardLoader from '../ui/LeaderboardLoader';

const MobileLeaderboard = ({
  onStartGame,
  onClose,
  onTransfer,
  onShowAuth,
  isSignedIn,
  viewMode,
  onViewModeChange,
  onRefresh,
  leaderboardLoading,
  leaderboardError,
  leaderboardPlayers,
  totalPlayers,
  currentUser,
  currentPlayerRank,
  expandedPlayers,
  onTogglePlayerDetails,
  leaderboardEnabled
}) => {
  return (
    <div className="mobile-leaderboard-container">
      <div className="leaderboard-container">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-4 px-6 py-4 bg-gray-800 border-b border-yellow-400">
          <button 
            className="start-game-btn" 
            onClick={() => {
              if (isSignedIn) {
                onStartGame();
              } else {
                onShowAuth();
              }
            }}
          >
            {isSignedIn ? 'Play Now' : 'START GAME'}
          </button>
          
          <div className="flex items-center gap-2">
            {isSignedIn && (
              <UserDropdown onTransfer={onTransfer} />
            )}
            <button
              onClick={onClose}
              className="bg-gray-800/90 hover:bg-gray-700/95 text-white/90 hover:text-white transition-all duration-200 rounded-xl px-3 py-2 backdrop-blur-sm border border-gray-600/60 hover:border-gray-500/80 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Title */}
        <div className="md:hidden mb-6 px-4">
          <div className="header-left" style={{lineHeight: '0.8', paddingTop: '24px', paddingBottom: '24px'}}>
            <h1 className="leaderboard-title text-xs font-bold text-yellow-400" style={{margin: '0', padding: '0', lineHeight: '0.8'}}>
              BULL RUN LEADERBOARD
            </h1>
            <p className="leaderboard-subtitle text-xs text-gray-300" style={{margin: '0', padding: '0', lineHeight: '0.8', marginTop: '4px'}}>
              Top Pumpers of All Time
            </p>
          </div>
        </div>

        <div className="leaderboard-content">

          <div className="relative pb-16">
            <LeaderboardTable
              players={leaderboardPlayers}
              currentUser={currentUser}
              currentPlayerRank={currentPlayerRank}
              isDesktop={false}
              expandedPlayers={expandedPlayers}
              onTogglePlayerDetails={onTogglePlayerDetails}
              leaderboardEnabled={leaderboardEnabled}
            />
            {leaderboardLoading && (
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 pt-20">
                <LeaderboardLoader />
              </div>
            )}
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-20">
            <LeaderboardControls
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              onRefresh={onRefresh}
              loading={leaderboardLoading}
              error={leaderboardError}
              hasData={leaderboardPlayers.length > 0}
              totalPlayers={totalPlayers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLeaderboard;
