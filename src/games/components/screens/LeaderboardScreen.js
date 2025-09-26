/**
 * LeaderboardScreen - Fő ranglista komponens
 * 
 * Ez a komponens koordinálja az összes ranglista komponenst
 * Most már csak a komponensek összekapcsolásáért felel
 */

import React from 'react';

// Hooks
import { useLeaderboardLogic } from './hooks';

// Komponensek
import DesktopLeaderboard from './DesktopLeaderboard';
import MobileLeaderboard from './MobileLeaderboard';
import LeaderboardModals from './LeaderboardModals';

// CSS
import './css';

const LeaderboardScreen = ({ onStartGame, playerName, playerStats, onClose }) => {
  // Összes logika a custom hook-ban
  const { 
    // State
    viewMode, 
    showTransferModal,
    showClerkAuth,
    expandedPlayers,
    
    // Data
    leaderboardPlayers,
    totalPlayers,
    leaderboardLoading,
    leaderboardError,
    currentUser,
    currentPlayerRank,
    leaderboardEnabled,
    isSignedIn,
    user,
    isDesktop,
    
    // Handlers
    handleViewModeChange,
    handleTogglePlayerDetails,
    handleTransfer,
    handleShowAuth,
    handleCloseAuth,
    handlePlayWithoutAuth,
    handleCloseTransferModal,
    refreshLeaderboard
  } = useLeaderboardLogic(playerStats, onStartGame);

  return (
    <div className="leaderboard-screen">
      {/* Desktop verzió */}
      <DesktopLeaderboard
        onStartGame={onStartGame}
        onClose={onClose}
        onTransfer={handleTransfer}
        onShowAuth={handleShowAuth}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onRefresh={refreshLeaderboard}
        leaderboardLoading={leaderboardLoading}
        leaderboardError={leaderboardError}
        leaderboardPlayers={leaderboardPlayers}
        totalPlayers={totalPlayers}
        currentUser={currentUser}
        currentPlayerRank={currentPlayerRank}
        expandedPlayers={expandedPlayers}
        onTogglePlayerDetails={handleTogglePlayerDetails}
        leaderboardEnabled={leaderboardEnabled}
      />

      {/* Mobile verzió */}
      <MobileLeaderboard
        onStartGame={onStartGame}
        onClose={onClose}
        onTransfer={handleTransfer}
        onShowAuth={handleShowAuth}
        isSignedIn={isSignedIn}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onRefresh={refreshLeaderboard}
        leaderboardLoading={leaderboardLoading}
        leaderboardError={leaderboardError}
        leaderboardPlayers={leaderboardPlayers}
        totalPlayers={totalPlayers}
        currentUser={currentUser}
        currentPlayerRank={currentPlayerRank}
        expandedPlayers={expandedPlayers}
        onTogglePlayerDetails={handleTogglePlayerDetails}
        leaderboardEnabled={leaderboardEnabled}
      />
      
      {/* Modálok */}
      <LeaderboardModals
        showTransferModal={showTransferModal}
        showClerkAuth={showClerkAuth}
        onCloseTransferModal={handleCloseTransferModal}
        onCloseAuth={handleCloseAuth}
        onPlayWithoutAuth={handlePlayWithoutAuth}
      />
    </div>
  );
};

export default LeaderboardScreen;