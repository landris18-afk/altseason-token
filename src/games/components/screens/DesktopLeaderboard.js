/**
 * DesktopLeaderboard - Desktop ranglista komponens
 * 
 * Ez a komponens kezeli a desktop verzió megjelenítését
 */

import React from 'react';
import LeaderboardHeader from './LeaderboardHeader';
import LeaderboardTable from './LeaderboardTable';
import LeaderboardControls from './LeaderboardControls';
import LeaderboardLoader from '../ui/LeaderboardLoader';

const DesktopLeaderboard = ({
  onStartGame,
  onClose,
  onTransfer,
  onShowAuth,
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
    <div className="desktop-leaderboard-container">
      <div className="desktop-leaderboard-panel">
        <div className="leaderboard-container">
          <LeaderboardHeader
            onStartGame={onStartGame}
            onClose={onClose}
            onTransfer={onTransfer}
            onShowAuth={onShowAuth}
            isDesktop={true}
          />

          <div className="leaderboard-content">
            <div className="relative pb-16">
              <LeaderboardTable
                players={leaderboardPlayers}
                currentUser={currentUser}
                currentUserRank={currentPlayerRank}
                isDesktop={true}
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

            <div className="absolute bottom-0 left-0 right-0 z-20">
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
    </div>
  );
};

export default DesktopLeaderboard;
