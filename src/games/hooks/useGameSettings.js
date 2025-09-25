import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * useGameSettings - Játék beállítások hook
 * 
 * Ez a hook kezeli a játék beállításait:
 * - Név megjelenítési beállítások
 * - Ranglista engedélyezése
 * - LocalStorage mentés/betöltés
 * 
 * @returns {Object} Beállítások és kezelő funkciók
 */
export const useGameSettings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState({
    useRealName: true,
    displayName: '',
    enableLeaderboard: true
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('gameSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({
            ...prev,
            ...parsed,
            displayName: parsed.displayName || user?.firstName || ''
          }));
        } catch (error) {
          console.error('Error parsing game settings:', error);
        }
      } else {
        // Default settings
        setSettings(prev => ({
          ...prev,
          displayName: user?.firstName || ''
        }));
      }
    }
  }, [user]);

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gameSettings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Error saving game settings:', error);
      }
    }
  };

  // Get display name for leaderboard
  const getDisplayName = () => {
    if (settings.useRealName) {
      return user?.firstName || user?.fullName?.split(' ')[0] || 'Player';
    }
    return settings.displayName || 'Player';
  };

  // Check if leaderboard is enabled
  const isLeaderboardEnabled = () => {
    return settings.enableLeaderboard;
  };

  return {
    settings,
    saveSettings,
    getDisplayName,
    isLeaderboardEnabled,
    displayName: getDisplayName(),
    leaderboardEnabled: settings.enableLeaderboard
  };
};
