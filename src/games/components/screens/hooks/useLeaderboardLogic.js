/**
 * useLeaderboardLogic - Ranglista logika hook
 * 
 * Ez a hook kezeli a ranglista összes logikáját:
 * - State kezelés
 * - Event handler-ek
 * - Adatok előkészítése
 * - Számítások
 */

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLeaderboard } from '../../../hooks/useLeaderboard';
import { useGameSettings } from '../../../hooks/useGameSettings';
import { useDesktopDetection } from '../../../hooks/useDesktopDetection';

export const useLeaderboardLogic = (playerStats, onStartGame) => {
  // State kezelés
  const [viewMode, setViewMode] = useState('top10');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showClerkAuth, setShowClerkAuth] = useState(false);
  const [expandedPlayers, setExpandedPlayers] = useState(new Set());
  
  // Hooks
  const { isSignedIn, user } = useUser();
  const { displayName, leaderboardEnabled } = useGameSettings();
  const isDesktop = useDesktopDetection();
  
  // Ranglista adatok
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
  
  // Játékos rang adatok - kikapcsolva, fallback logika használata
  const playerRank = null; // Mindig null, hogy a fallback logika használja a ranglista adatokat


  // Event handlers
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleTogglePlayerDetails = (playerId) => {
    setExpandedPlayers(prev => {
      const newSet = new Set();
      if (!prev.has(playerId)) {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const handleTransfer = () => {
    setShowTransferModal(true);
  };

  const handleShowAuth = () => {
    setShowClerkAuth(true);
  };

  const handleCloseAuth = () => {
    setShowClerkAuth(false);
  };

  const handlePlayWithoutAuth = () => {
    setShowClerkAuth(false);
    onStartGame();
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
  };

  // Current user adatok előkészítése - CSAK adatbázisból bejelentkezett felhasználóknak
  const currentUser = (() => {
    if (!isSignedIn || !user?.id || !leaderboardEnabled) return null;
    
    // Keresés a ranglista játékosok között - CSAK adatbázisból
    // Először clerkId alapján keresünk, mert a user.id a Clerk ID
    const dbUser = leaderboardPlayers.find(player => player.clerkId === user.id);
    
    if (dbUser) {
      // Ha van adatbázis adat, azt használjuk
      return {
        id: 'current-user',
        name: dbUser.name,
        marketCap: dbUser.marketCap,
        level: dbUser.level,
        platform: dbUser.platform,
        clickPower: dbUser.clickPower || 0,
        passiveIncome: dbUser.passiveIncome || 0,
        isCurrentUser: true,
        userId: user.id
      };
    }
    
    // Ha nincs adatbázis adat, 0-ás értékeket mutatunk
    return {
      id: 'current-user',
      name: displayName || 'Player',
      marketCap: 0,
      level: 1,
      platform: isDesktop ? 'desktop' : 'mobile',
      clickPower: 0,
      passiveIncome: 0,
      isCurrentUser: true,
      userId: user.id
    };
  })();

  // Current user rank számítás - mindig a ranglista adatokból számítjuk
  const currentPlayerRank = (() => {
    if (!currentUser) return null;
    
    // Ha van playerRank az API-ból, használjuk azt
    if (playerRank) {
      return playerRank;
    }
    
    // Különben számítsuk ki a ranglista adatokból
    let rank = 1;
    for (const player of leaderboardPlayers) {
      // Ha a currentUser marketCap-je kisebb vagy egyenlő, akkor rosszabb rangot kap
      if (currentUser.marketCap <= (player.marketCap || player.score || 0)) {
        rank++;
      } else {
        // Ha nagyobb, akkor jobb rangot kap, megállunk
        break;
      }
    }
    
    
    return rank;
  })();

  return {
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
  };
};
