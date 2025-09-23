import React, { useState } from 'react';
import { mockLeaderboardData, formatScore } from '../../data/leaderboardData';
import './LeaderboardScreen.css';

const LeaderboardScreen = ({ onStartGame, playerName, playerStats, onClose }) => {
  const [showTopTen, setShowTopTen] = useState(true);

  const toggleView = () => {
    setShowTopTen(!showTopTen);
  };

  const displayedData = showTopTen ? mockLeaderboardData.slice(0, 10) : mockLeaderboardData;
  
  // Játékos rank számítása - mindig az utolsó a ranglistán
  const playerRank = mockLeaderboardData.length + 1;

  return (
    <div className="leaderboard-screen">
      {/* Desktop: Centered container with margins */}
      <div className="desktop-leaderboard-container">
        <div className="desktop-leaderboard-panel">
          <div className="leaderboard-container">
            <div className="leaderboard-header">
              <div className="header-left">
                <h1 className="leaderboard-title">BULL RUN LEADERBOARD</h1>
                <p className="leaderboard-subtitle">Top Pumpers of All Time</p>
              </div>
              <div className="header-right">
                {playerName && playerStats && (
                  <div className="player-info">
                    <div className="player-name-display">{playerName}</div>
                    <div className="player-stats">
                      <span className="stat">Market Cap: ${playerStats.marketCap.toLocaleString()}</span>
                      <span className="stat">Rank: #{playerRank}</span>
                      <span className="stat">Level: {playerStats.levelIndex + 1}</span>
                    </div>
                  </div>
                )}
                <button className="start-game-btn" onClick={onStartGame}>
                  START GAME
                </button>
              </div>
            </div>

            <div className="leaderboard-content">
              <div className="leaderboard-table">
                <div className="table-header">
                  <div className="header-rank">Rank</div>
                  <div className="header-name">Player</div>
                  <div className="header-score">Market Cap</div>
                  <div className="header-level">Level</div>
                </div>

                <div className="table-body">
                  {displayedData.map((player, index) => {
                    const rank = index + 1;
                    return (
                      <div 
                        key={player.id} 
                        className={`table-row ${rank <= 3 ? 'podium' : ''} ${rank === 1 ? 'first' : ''} ${rank === 2 ? 'second' : ''} ${rank === 3 ? 'third' : ''}`}
                      >
                        <div className="cell-rank">
                          <span className="rank-number">
                            {rank <= 3 ? (
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
                          <span className="player-name">{player.name}</span>
                        </div>
                        <div className="cell-score">
                          <span className="score-value">{formatScore(player.score)}</span>
                        </div>
                        <div className="cell-level">
                          <span className="level-badge">lvl {player.level}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="table-footer">
                  <div className="footer-left">
                    <button 
                      className={`toggle-btn ${showTopTen ? 'active' : ''}`}
                      onClick={toggleView}
                    >
                      Top 10
                    </button>
                    <button 
                      className={`toggle-btn ${!showTopTen ? 'active' : ''}`}
                      onClick={toggleView}
                    >
                      All Players
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
              <div className="leaderboard-header">
                <div className="header-left">
                  <button className="start-game-btn" onClick={onStartGame}>
                    START GAME
                  </button>
                </div>
                <div className="header-right">
                  {playerName && playerStats && (
                    <div className="player-info">
                      <div className="player-name-display">{playerName}</div>
                      <div className="player-stats">
                        <span className="stat">MC: ${playerStats.marketCap.toLocaleString()}</span>
                        <span className="stat">Rank: #{playerRank}</span>
                        <span className="stat">lvl: {playerStats.levelIndex + 1}</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Elválasztó vonal a fejléc alatt */}
                <div className="md:hidden absolute top-16 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent z-[10002]"></div>
              </div>

              <div className="leaderboard-content">
                <div className="leaderboard-table">
                  <div className="table-title-section">
                    <h1 className="table-title">BULL RUN LEADERBOARD</h1>
                    <p className="table-subtitle">Top Pumpers of All Time</p>
                  </div>
                  <div className="table-header">
                    <div className="header-rank">Rank</div>
                    <div className="header-name">Player</div>
                    <div className="header-score">Market Cap</div>
                    <div className="header-level">Level</div>
                  </div>

              <div className="table-body">
                {displayedData.map((player, index) => {
                  const rank = index + 1;
                  return (
                    <div 
                      key={player.id} 
                      className={`table-row ${rank <= 3 ? 'podium' : ''} ${rank === 1 ? 'first' : ''} ${rank === 2 ? 'second' : ''} ${rank === 3 ? 'third' : ''}`}
                    >
                      <div className="cell-rank">
                        <span className="rank-number">
                          {rank <= 3 ? (
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
                        <span className="player-name">{player.name}</span>
                      </div>
                      <div className="cell-score">
                        <span className="score-value">{formatScore(player.score)}</span>
                      </div>
                      <div className="cell-level">
                        <span className="level-badge">lvl {player.level}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="table-footer">
                <div className="footer-left">
                  <button 
                    className={`toggle-btn ${showTopTen ? 'active' : ''}`}
                    onClick={toggleView}
                  >
                    Top 10
                  </button>
                  <button 
                    className={`toggle-btn ${!showTopTen ? 'active' : ''}`}
                    onClick={toggleView}
                  >
                    All Players
                  </button>
                </div>
                <div className="footer-right">
                  <button 
                    onClick={onClose}
                    className="close-btn"
                    title="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
