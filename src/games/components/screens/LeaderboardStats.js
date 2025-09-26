/**
 * LeaderboardStats - Ranglista statisztikák komponens
 * 
 * Ez a komponens kezeli a játékos statisztikáinak megjelenítését:
 * - Current user adatok
 * - Rang számítás
 * - Platform indikátor
 */

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useGameSettings } from '../../hooks/useGameSettings';
import { useDesktopDetection } from '../../hooks/useDesktopDetection';
import { usePlayerSave } from '../../hooks/usePlayerSave';

const LeaderboardStats = ({ 
  playerStats, 
  playerRank, 
  onStartGame, 
  onShowAuth 
}) => {
  const { isSignedIn } = useUser();
  const { displayName, leaderboardEnabled } = useGameSettings();
  const isDesktop = useDesktopDetection();
  const { savePlayerToLeaderboard } = usePlayerSave();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!isSignedIn || !playerStats || !displayName) {
    return null;
  }

  const handleStartGame = () => {
    if (isSignedIn) {
      onStartGame();
    } else {
      onShowAuth();
    }
  };

  const handleSaveToLeaderboard = async () => {
    if (!playerStats || !leaderboardEnabled) {
      setSaveMessage('Leaderboard is disabled in settings');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const gameData = {
        marketCap: playerStats.marketCap,
        clickPower: playerStats.clickPower || 0,
        passiveIncome: playerStats.passiveIncome || 0,
        level: playerStats.levelIndex + 1,
        platform: isDesktop ? 'desktop' : 'mobile'
      };

      const result = await savePlayerToLeaderboard(gameData);
      
      if (result.success) {
        setSaveMessage('✅ Saved to leaderboard!');
        // Refresh the leaderboard after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setSaveMessage(`❌ Save failed: ${result.reason || result.error}`);
      }
    } catch (error) {
      setSaveMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="leaderboard-stats">
      <div className="stats-header">
        <h3 className="stats-title">Your Progress</h3>
        <div className="stats-buttons">
          <button 
            className="continue-game-btn"
            onClick={handleStartGame}
          >
            Continue Game
          </button>
          <button 
            className="save-leaderboard-btn"
            onClick={handleSaveToLeaderboard}
            disabled={isSaving || !leaderboardEnabled}
            title={!leaderboardEnabled ? 'Enable leaderboard in settings first' : 'Save your current progress to leaderboard'}
          >
            {isSaving ? 'Saving...' : 'Save to Leaderboard'}
          </button>
        </div>
      </div>
      
      <div className="stats-content">
        <div className="stat-item">
          <span className="stat-label">Current Rank:</span>
          <span className="stat-value rank-value">
            {playerRank ? `#${playerRank}` : 'Calculating...'}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Market Cap:</span>
          <span className="stat-value">
            ${playerStats.marketCap?.toFixed(2) || '0.00'}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Level:</span>
          <span className="stat-value">
            {playerStats.levelIndex + 1}
          </span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Platform:</span>
          <span className="stat-value">
            {isDesktop ? '🖥️ Desktop' : '📱 Mobile'}
          </span>
        </div>
      </div>
      
      {saveMessage && (
        <div className={`save-message ${saveMessage.includes('✅') ? 'success' : 'error'}`}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default LeaderboardStats;
