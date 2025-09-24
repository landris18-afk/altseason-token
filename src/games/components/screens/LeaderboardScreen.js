import React, { useState } from 'react';
import { mockLeaderboardData, formatScore } from '../../data/leaderboardData';
import './LeaderboardLayout.css';
import './LeaderboardTable.css';
import './LeaderboardCells.css';
import './LeaderboardButtons.css';
import './LeaderboardCurrentUser.css';

const LeaderboardScreen = ({ onStartGame, playerName, playerStats, onClose }) => {
  const [viewMode, setViewMode] = useState('top10'); // 'top10', 'top50', 'top100', 'all'

  const toggleView = (mode) => {
    setViewMode(mode);
  };

  const getBaseData = () => {
    switch (viewMode) {
      case 'top10':
        return mockLeaderboardData.slice(0, 10);
      case 'top50':
        return mockLeaderboardData.slice(0, 50);
      case 'top100':
        return mockLeaderboardData.slice(0, 100);
      case 'all':
      default:
        return mockLeaderboardData;
    }
  };

  const baseData = getBaseData();
  
  // Játékos rank számítása - ahol a játékos valóban elhelyezkedne a ranglistán
  const calculateUserRank = () => {
    if (!playerStats) return null;
    let rank = 1;
    for (const player of mockLeaderboardData) {
      if (playerStats.marketCap > player.score) {
        break;
      }
      rank++;
    }
    return rank;
  };
  
  const playerRank = calculateUserRank();
  
  // Játékos adatainak létrehozása
  const userEntry = playerName && playerStats ? {
    id: 'current-user',
    name: playerName,
    score: playerStats.marketCap,
    level: playerStats.levelIndex + 1,
    isCurrentUser: true,
    actualRank: playerRank
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
                <p className="leaderboard-subtitle text-xs text-gray-300" style={{margin: '0', padding: '0', lineHeight: '0.8'}}>Top Pumpers of All Time</p>
              </div>
              <div className="header-right">
                <button className="start-game-btn" onClick={onStartGame}>
                  START GAME
                </button>
              </div>
            </div>

            <div className="leaderboard-content">
              <div className="leaderboard-table">
                {/* Current User Row Above Header */}
                {userEntry && (
                  <div className="table-row current-user-above-header">
                    <div className="cell-rank">
                      <span className="rank-number">
                        {playerRank <= 3 ? (
                          <span className="medal">
                            {playerRank === 1 && '🥇'}
                            {playerRank === 2 && '🥈'}
                            {playerRank === 3 && '🥉'}
                          </span>
                        ) : (
                          `${playerRank}.`
                        )}
                      </span>
                    </div>
                    <div className="cell-name">
                      <span className="player-name current-user-name">
                        {playerName}
                        <span className="current-user-badge"> (YOU)</span>
                      </span>
                    </div>
                    <div className="cell-score">
                      <span className="score-value current-user-score">
                        {formatScore(playerStats.marketCap)}
                      </span>
                    </div>
                    <div className="cell-level">
                      <span className="level-badge current-user-level">
                        lvl {playerStats.levelIndex + 1}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="table-header">
                  <div className="header-rank">Rank</div>
                  <div className="header-name">Player</div>
                  <div className="header-score">
                    <span className="desktop-market-cap">Market Cap</span>
                    <span className="mobile-market-cap">MC</span>
                  </div>
                  <div className="header-level">Level</div>
                </div>

                <div className="table-body">
                  {displayedData.map((player, index) => {
                    const rank = index + 1; // A valódi rank az index + 1
                    const isCurrentUser = player.isCurrentUser;
                    const isPodium = rank <= 3;
                    const isUserPodium = isCurrentUser && player.actualRank <= 3;
                    
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
                            {isCurrentUser && <span className="current-user-badge"> (YOU)</span>}
                          </span>
                        </div>
                        <div className="cell-score">
                          <span className={`score-value ${isCurrentUser ? 'current-user-score' : ''}`}>
                            {formatScore(player.score)}
                          </span>
                        </div>
                        <div className="cell-level">
                          <span className={`level-badge ${isCurrentUser ? 'current-user-level' : ''}`}>
                            lvl {player.level}
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Full width container */}
      <div className="mobile-leaderboard-container">
        <div className="leaderboard-container">
          {/* Mobile Header - START GAME left, X right - INSIDE SCROLLABLE CONTAINER */}
          <div className="md:hidden flex justify-between items-center mb-6 pt-4 px-6">
            <button className="start-game-btn" onClick={onStartGame}>
              START GAME
            </button>
            
            <button
              onClick={onClose}
              className="bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="md:hidden mb-2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
          {/* Mobile Title */}
          <div className="md:hidden flex flex-col items-center justify-center mb-1 pt-2">
            <h1 className="leaderboard-title text-xl font-bold text-yellow-400 mb-1">BULL RUN LEADERBOARD</h1>
            <p className="leaderboard-subtitle text-gray-300 text-xs">Top Pumpers of All Time</p>
          </div>

              <div className="leaderboard-content">
                <div className="leaderboard-table">
                  
                  {/* Current User Row Above Header - Mobile */}
                  {userEntry && (
                    <div className="table-row current-user-above-header">
                      <div className="cell-rank">
                        <span className="rank-number">
                          {playerRank <= 3 ? (
                            <span className="medal">
                              {playerRank === 1 && '🥇'}
                              {playerRank === 2 && '🥈'}
                              {playerRank === 3 && '🥉'}
                            </span>
                          ) : (
                            `${playerRank}.`
                          )}
                        </span>
                      </div>
                      <div className="cell-name">
                        <span className="player-name current-user-name">
                          {playerName}
                          <span className="current-user-badge"> (YOU)</span>
                        </span>
                      </div>
                      <div className="cell-score">
                        <span className="score-value current-user-score">
                          {formatScore(playerStats.marketCap)}
                        </span>
                      </div>
                      <div className="cell-level">
                        <span className="level-badge current-user-level">
                          lvl {playerStats.levelIndex + 1}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* START GAME Button removed - now in header */}
                  
                  <div className="table-header">
                    <div className="header-rank">Rank</div>
                    <div className="header-name">Player</div>
                    <div className="header-score">
                      <span className="desktop-market-cap">Market Cap</span>
                      <span className="mobile-market-cap">MC</span>
                    </div>
                    <div className="header-level">Level</div>
                  </div>

              <div className="table-body">
                {displayedData.map((player, index) => {
                  const rank = index + 1; // A valódi rank az index + 1
                  const isCurrentUser = player.isCurrentUser;
                  const isPodium = rank <= 3;
                  const isUserPodium = isCurrentUser && player.actualRank <= 3;
                  
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
                          {isCurrentUser && <span className="current-user-badge"> (YOU)</span>}
                        </span>
                      </div>
                      <div className="cell-score">
                        <span className={`score-value ${isCurrentUser ? 'current-user-score' : ''}`}>
                          {formatScore(player.score)}
                        </span>
                      </div>
                      <div className="cell-level">
                        <span className={`level-badge ${isCurrentUser ? 'current-user-level' : ''}`}>
                          lvl {player.level}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
