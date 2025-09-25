import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { mockLeaderboardData, formatScore } from '../../data/leaderboardData';
import { useLeaderboard, usePlayerData } from '../../hooks/useLeaderboard';

const formatNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  } else {
    return number.toFixed(0);
  }
};
import TransferModal from '../modals/TransferModal';
import ClerkAuthModal from '../modals/ClerkAuthModal';
import UserDropdown from '../ui/UserDropdown';
import { useGameSettings } from '../../hooks/useGameSettings';
import { useDesktopDetection } from '../../hooks/useDesktopDetection';
import LeaderboardLoader from '../ui/LeaderboardLoader';
import './LeaderboardLayout.css';
import './LeaderboardTable.css';
import './LeaderboardCells.css';
import './LeaderboardButtons.css';
import './LeaderboardCurrentUser.css';

const LeaderboardScreen = ({ onStartGame, playerName, playerStats, onClose }) => {
  const [viewMode, setViewMode] = useState('top10'); // 'top10', 'top50', 'top100', 'all'
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showClerkAuth, setShowClerkAuth] = useState(false);
  const [expandedPlayers, setExpandedPlayers] = useState(new Set());
  
  // Clerk hooks
  const { isSignedIn, user } = useUser();
  
  // Game settings
  const { displayName, leaderboardEnabled } = useGameSettings();
  
  // Desktop detection
  const isDesktop = useDesktopDetection();
  
  // Real leaderboard data
  const { 
    players: leaderboardPlayers, 
    totalPlayers, 
    loading: leaderboardLoading, 
    error: leaderboardError, 
    refresh: refreshLeaderboard 
  } = useLeaderboard({ 
    viewMode, 
    platform: 'all', 
    autoRefresh: false 
  });
  
  // Player rank data
  const { 
    playerRank, 
    loading: rankLoading 
  } = usePlayerData(playerStats, 'desktop');


  const toggleView = (mode) => {
    setViewMode(mode);
  };

  const togglePlayerDetails = (playerId) => {
    setExpandedPlayers(prev => {
      const newSet = new Set();
      // Ha a játékos már nyitva volt, akkor zárjuk be (üres set)
      // Ha nem volt nyitva, akkor csak ezt nyissuk ki (egy elemű set)
      if (!prev.has(playerId)) {
        newSet.add(playerId);
      }
      // Ha már nyitva volt, akkor newSet üres marad (minden bezáródik)
      return newSet;
    });
  };

  // Use real leaderboard data
  const baseData = leaderboardPlayers;
  
  // Use real player rank or fallback calculation
  const currentPlayerRank = playerRank || (() => {
    if (!playerStats) return null;
    let rank = 1;
    for (const player of baseData) {
      if (playerStats.marketCap > (player.marketCap || player.score)) {
        break;
      }
      rank++;
    }
    return rank;
  })();
  
  // Játékos adatainak létrehozása - csak bejelentkezés után látható a ranglista felett
  // Ez minden render-nél újraszámolódik, így reagál a displayName változásaira
  const userEntry = (isSignedIn && displayName && playerStats) ? {
    id: 'current-user',
    name: displayName, // Ez automatikusan frissül a useGameSettings-ből
    score: playerStats.marketCap,
    marketCap: playerStats.marketCap,
    level: playerStats.levelIndex + 1,
    platform: isDesktop ? 'desktop' : 'mobile', // Dinamikus platform
    clickPower: playerStats.clickPower || 0,
    passiveIncome: playerStats.passiveIncome || 0,
    isCurrentUser: true,
    actualRank: currentPlayerRank
  } : null;
  
  // Játékos adatai most a fejléc felett jelennek meg, nem a ranglistában
  const displayedData = baseData;

  return (
    <div className="leaderboard-screen">
      {/* Desktop: Centered container with margins */}
      <div className="desktop-leaderboard-container">
        <div className="desktop-leaderboard-panel">
          <div className="leaderboard-container">
            <div className="leaderboard-header">
              <div className="header-left" style={{lineHeight: '0.8', paddingTop: '24px', paddingBottom: '24px'}}>
                <h1 className="leaderboard-title text-xs font-bold text-yellow-400" style={{margin: '0', padding: '0', lineHeight: '0.8'}}>BULL RUN LEADERBOARD</h1>
                <p className="leaderboard-subtitle text-xs text-gray-300" style={{margin: '0', padding: '0', lineHeight: '0.8', marginTop: '4px'}}>Top Pumpers of All Time</p>
              </div>
              <div className="header-right">
                <button 
                  className="start-game-btn" 
                  onClick={() => {
                    if (isSignedIn) {
                      // Ha be van jelentkezve, egyből a játékra
                      onStartGame();
                    } else {
                      // Ha nincs bejelentkezve, Clerk modal
                      setShowClerkAuth(true);
                    }
                  }}
                >
                  {isSignedIn ? 'Play Now' : 'START GAME'}
                </button>
                
                <div className="flex items-center gap-3">
                  {isSignedIn && (
                    <UserDropdown onTransfer={() => setShowTransferModal(true)} />
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

            <div className="leaderboard-content">
              {/* Loading State */}
              {leaderboardLoading && (
                <LeaderboardLoader />
              )}
              
              {/* Error State */}
              {leaderboardError && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-red-400 text-lg">Error loading leaderboard: {leaderboardError}</div>
                  <button 
                    onClick={refreshLeaderboard}
                    className="ml-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* Empty State - No data available */}
              {!leaderboardLoading && !leaderboardError && baseData.length === 0 && (
                <div className="flex flex-col justify-center items-center py-12">
                  <div className="text-yellow-400 text-xl font-bold mb-2">No Leaderboard Data</div>
                  <div className="text-gray-400 text-center mb-4">
                    The server is not running or no players have joined yet.
                  </div>
                  <button 
                    onClick={refreshLeaderboard}
                    className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-bold"
                  >
                    Refresh
                  </button>
                </div>
              )}
              
              {/* Only show leaderboard if there's data */}
              {baseData.length > 0 && (
              <div className="leaderboard-table">
                {/* Current User Row Above Header */}
                {userEntry && (
                  <div className="table-row current-user-above-header">
                    <div className="cell-rank">
                      <span className="rank-number">
                        {currentPlayerRank <= 3 ? (
                          <span className="medal">
                            {currentPlayerRank === 1 && '🥇'}
                            {currentPlayerRank === 2 && '🥈'}
                            {currentPlayerRank === 3 && '🥉'}
                          </span>
                        ) : (
                          `${currentPlayerRank || '?'}.`
                        )}
                      </span>
                    </div>
                    <div className="cell-name">
                      <span className="player-name current-user-name">
                        {displayName}
                        <span className="platform-indicator">
                          {isDesktop ? '🖥️' : '📱'}
                        </span>
                        <span className="current-user-badge"> (YOU)</span>
                      </span>
                    </div>
                    <div className="cell-score">
                      <span className="score-value current-user-score">
                        {formatScore(userEntry.marketCap)}
                      </span>
                    </div>
                    <div className="cell-click">
                      <span className="click-value current-user-click">
                        ${formatNumber(userEntry.clickPower || 0)}
                      </span>
                    </div>
                    <div className="cell-passive">
                      <span className="passive-value current-user-passive">
                        ${formatNumber(userEntry.passiveIncome || 0)}
                      </span>
                    </div>
                    <div className="cell-level">
                      <span className="level-badge current-user-level">
                        Level {userEntry.level}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="table-header">
                  <div className="header-rank">Rank</div>
                  <div className="header-name">Player</div>
                  <div className="header-score">Market Cap</div>
                  <div className="header-click">MC/Click</div>
                  <div className="header-passive">MC/Second</div>
                  <div className="header-level">Level</div>
                </div>

                <div className="table-body">
                  {displayedData
                    .filter(player => !player.isCurrentUser || leaderboardEnabled)
                    .map((player, index) => {
                    const rank = index + 1; // A valódi rank az index + 1
                    // Frontend oldalon döntjük el, hogy ki a current user (csak bejelentkezés után)
                    // User ID alapján azonosítjuk, hogy elkerüljük a név ütközéseket
                    const isCurrentUser = isSignedIn && user?.id && player.userId === user.id;
                    const isPodium = rank <= 3;
                    
                    return (
                      <div 
                        key={player.id} 
                        className={`table-row ${isCurrentUser ? 'current-user' : ''} ${isPodium ? 'podium' : ''} ${rank === 1 ? 'first' : ''} ${rank === 2 ? 'second' : ''} ${rank === 3 ? 'third' : ''}`}
                      >
                        <div className="cell-rank">
                          <span className="rank-number">
                            {isPodium ? (
                              <span className="medal">
                                {rank === 1 && '🥇'}
                                {rank === 2 && '🥈'}
                                {rank === 3 && '🥉'}
                              </span>
                            ) : (
                              `${rank}.`
                            )}
                          </span>
                        </div>
                        <div className="cell-name">
                          <span className={`player-name ${isCurrentUser ? 'current-user-name' : ''}`}>
                            {player.name}
                            <span className="platform-indicator">
                              {player.platform === 'desktop' ? '🖥️' : '📱'}
                            </span>
                            {isCurrentUser && <span className="current-user-badge"> (YOU)</span>}
                          </span>
                        </div>
                        <div className="cell-score">
                          <span className={`score-value ${isCurrentUser ? 'current-user-score' : ''}`}>
                            {formatScore(player.marketCap || player.score)}
                          </span>
                        </div>
                        <div className="cell-click">
                          <span className={`click-value ${isCurrentUser ? 'current-user-click' : ''}`}>
                            ${formatNumber(player.clickPower || 0)}
                          </span>
                        </div>
                        <div className="cell-passive">
                          <span className={`passive-value ${isCurrentUser ? 'current-user-passive' : ''}`}>
                            ${formatNumber(player.passiveIncome || 0)}
                          </span>
                        </div>
                        <div className="cell-level">
                          <span className={`level-badge ${isCurrentUser ? 'current-user-level' : ''}`}>
                            Level {player.level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="table-footer">
                  <div className="footer-left">
                    <button 
                      className={`toggle-btn ${viewMode === 'top10' ? 'active' : ''}`}
                      onClick={() => toggleView('top10')}
                    >
                      Top 10
                    </button>
                    <button 
                      className={`toggle-btn ${viewMode === 'top50' ? 'active' : ''}`}
                      onClick={() => toggleView('top50')}
                    >
                      Top 50
                    </button>
                    <button 
                      className={`toggle-btn ${viewMode === 'top100' ? 'active' : ''}`}
                      onClick={() => toggleView('top100')}
                    >
                      Top 100
                    </button>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Full width container */}
      <div className="mobile-leaderboard-container">
        <div className="leaderboard-container">
          {/* Mobile Header - Upgrades stílus */}
          <div className="md:hidden flex justify-between items-center mb-4 px-6 py-4 bg-gray-800 border-b border-yellow-400">
            <button 
              className="start-game-btn" 
              onClick={() => {
                if (isSignedIn) {
                  onStartGame();
                } else {
                  setShowClerkAuth(true);
                }
              }}
            >
              {isSignedIn ? 'Play Now' : 'START GAME'}
            </button>
            
            <div className="flex items-center gap-2">
              {isSignedIn && (
                <UserDropdown onTransfer={() => setShowTransferModal(true)} />
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
          
          {/* Mobile Title - lejjebb */}
          <div className="md:hidden mb-6 px-4">
            <div className="header-left" style={{lineHeight: '0.8', paddingTop: '24px', paddingBottom: '24px'}}>
              <h1 className="leaderboard-title text-xs font-bold text-yellow-400" style={{margin: '0', padding: '0', lineHeight: '0.8'}}>BULL RUN LEADERBOARD</h1>
              <p className="leaderboard-subtitle text-xs text-gray-300" style={{margin: '0', padding: '0', lineHeight: '0.8', marginTop: '4px'}}>Top Pumpers of All Time</p>
            </div>
          </div>

          {/* Mobile Loading State */}
          {leaderboardLoading && (
            <LeaderboardLoader />
          )}
          
          {/* Mobile Error State */}
          {leaderboardError && (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-400 text-lg">Error loading leaderboard: {leaderboardError}</div>
              <button 
                onClick={refreshLeaderboard}
                className="ml-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Mobile Empty State */}
          {!leaderboardLoading && !leaderboardError && baseData.length === 0 && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="text-yellow-400 text-xl font-bold mb-2">No Leaderboard Data</div>
              <div className="text-gray-400 text-center mb-4">
                The server is not running or no players have joined yet.
              </div>
              <button 
                onClick={refreshLeaderboard}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-bold"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Mobile Leaderboard Table */}
          {baseData.length > 0 && (
            <div className="leaderboard-content">
              <div className="leaderboard-table">
                
                {/* Current User Row Above Header - Mobile */}
                {userEntry && (
                  <div className="table-row current-user-above-header">
                    <div className="cell-rank">
                      <span className="rank-number">
                        {currentPlayerRank <= 3 ? (
                          <span className="medal">
                            {currentPlayerRank === 1 && '🥇'}
                            {currentPlayerRank === 2 && '🥈'}
                            {currentPlayerRank === 3 && '🥉'}
                          </span>
                        ) : (
                          `${currentPlayerRank || '?'}.`
                        )}
                      </span>
                    </div>
                    <div className="cell-name">
                      <span className="player-name current-user-name">
                        {displayName}
                        <span className="platform-indicator">
                          {isDesktop ? '🖥️' : '📱'}
                        </span>
                        <span className="current-user-badge"> (YOU)</span>
                      </span>
                    </div>
                    <div className="cell-score">
                      <span className="score-value current-user-score">
                        {formatScore(userEntry?.marketCap || playerStats?.marketCap)}
                      </span>
                      <button
                        className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Show detailed stats"
                        onClick={() => togglePlayerDetails('current-user')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Current User Detailed Stats - Mobile */}
                {userEntry && expandedPlayers.has('current-user') && (
                  <div className="table-row current-user-details-mobile">
                    <div className="cell-rank"></div>
                    <div className="cell-name">
                      <span className="text-xs text-gray-400">MC/Click:</span>
                      <span className="ml-2 text-yellow-400 font-medium">
                        ${formatNumber(userEntry.clickPower || 0)}
                      </span>
                    </div>
                    <div className="cell-score">
                      <span className="text-xs text-gray-400">MC/Second:</span>
                      <span className="ml-2 text-yellow-400 font-medium">
                        ${formatNumber(userEntry.passiveIncome || 0)}
                      </span>
                      <span className="ml-4 text-xs text-gray-400">Level:</span>
                      <span className="ml-2 text-yellow-400 font-medium">
                        {userEntry.level}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="table-header">
                  <div className="header-rank">Rank</div>
                  <div className="header-name">Player</div>
                  <div className="header-score">Market Cap</div>
                </div>

                <div className="table-body">
                  {displayedData
                    .filter(player => !player.isCurrentUser || leaderboardEnabled)
                    .map((player, index) => {
                    const rank = index + 1;
                    // Frontend oldalon döntjük el, hogy ki a current user (csak bejelentkezés után)
                    // User ID alapján azonosítjuk, hogy elkerüljük a név ütközéseket
                    const isCurrentUser = isSignedIn && user?.id && player.userId === user.id;
                    const isPodium = rank <= 3;
                    
                    return (
                      <React.Fragment key={player.id}>
                        <div 
                          className={`table-row ${isCurrentUser ? 'current-user' : ''} ${isPodium ? 'podium' : ''} ${rank === 1 ? 'first' : ''} ${rank === 2 ? 'second' : ''} ${rank === 3 ? 'third' : ''}`}
                        >
                          <div className="cell-rank">
                            <span className="rank-number">
                              {isPodium ? (
                                <span className="medal">
                                  {rank === 1 && '🥇'}
                                  {rank === 2 && '🥈'}
                                  {rank === 3 && '🥉'}
                                </span>
                              ) : (
                                `${rank}.`
                              )}
                            </span>
                          </div>
                          <div className="cell-name">
                            <span className={`player-name ${isCurrentUser ? 'current-user-name' : ''}`}>
                              {player.name}
                              <span className="platform-indicator">
                                {player.platform === 'desktop' ? '🖥️' : '📱'}
                              </span>
                              {isCurrentUser && <span className="current-user-badge"> (YOU)</span>}
                            </span>
                          </div>
                          <div className="cell-score">
                            <span className={`score-value ${isCurrentUser ? 'current-user-score' : ''}`}>
                              {formatScore(player.marketCap || player.score)}
                            </span>
                            {player.userId && (
                              <button
                                className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                                title="Show detailed stats"
                                onClick={() => togglePlayerDetails(player.id)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {expandedPlayers.has(player.id) && player.userId && (
                          <div className="table-row current-user-details-mobile">
                            <div className="cell-rank"></div>
                            <div className="cell-name">
                              <span className="text-xs text-gray-400">MC/Click:</span>
                              <span className="ml-2 text-yellow-400 font-medium">
                                ${formatNumber(player.clickPower || 0)}
                              </span>
                            </div>
                            <div className="cell-score">
                              <span className="text-xs text-gray-400">MC/Second:</span>
                              <span className="ml-2 text-yellow-400 font-medium">
                                ${formatNumber(player.passiveIncome || 0)}
                              </span>
                              <span className="ml-4 text-xs text-gray-400">Level:</span>
                              <span className="ml-2 text-yellow-400 font-medium">
                                {player.level}
                              </span>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="table-footer">
                  <div className="footer-left">
                    <button 
                      className={`toggle-btn ${viewMode === 'top10' ? 'active' : ''}`}
                      onClick={() => toggleView('top10')}
                    >
                      Top 10
                    </button>
                    <button 
                      className={`toggle-btn ${viewMode === 'top50' ? 'active' : ''}`}
                      onClick={() => toggleView('top50')}
                    >
                      Top 50
                    </button>
                    <button 
                      className={`toggle-btn ${viewMode === 'top100' ? 'active' : ''}`}
                      onClick={() => toggleView('top100')}
                    >
                      Top 100
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Transfer Modal */}
      <TransferModal 
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      />
      
      {/* Clerk Auth Modal */}
      <ClerkAuthModal
        isOpen={showClerkAuth}
        onClose={() => setShowClerkAuth(false)}
        onPlayWithoutAuth={() => {
          setShowClerkAuth(false);
          onStartGame();
        }}
      />
    </div>
  );
};

export default LeaderboardScreen;