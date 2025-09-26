import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import supabaseService from '../../lib/supabaseService';

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

  // Load settings from localStorage and database on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (typeof window !== 'undefined' && user?.id) {
        try {
          // First try to load from database
          console.log('🔧 Loading settings from database for user:', user.id);
          const dbResult = await supabaseService.loadSettings(user.id);
          
          if (dbResult.success && dbResult.data) {
            // Use database settings
            console.log('✅ Settings loaded from database:', dbResult.data);
            setSettings(prev => ({
              ...prev,
              useRealName: dbResult.data.use_real_name ?? true,
              displayName: dbResult.data.display_name || user?.firstName || '',
              enableLeaderboard: dbResult.data.enable_leaderboard ?? true
            }));
            
            // Also save to localStorage for offline access
            const userSettingsKey = `gameSettings_${user.id}`;
            localStorage.setItem(userSettingsKey, JSON.stringify({
              useRealName: dbResult.data.use_real_name ?? true,
              displayName: dbResult.data.display_name || user?.firstName || '',
              enableLeaderboard: dbResult.data.enable_leaderboard ?? true
            }));
          } else {
            // Fallback to localStorage
            console.log('⚠️ Database settings not found, loading from localStorage');
            const userSettingsKey = `gameSettings_${user.id}`;
            const savedSettings = localStorage.getItem(userSettingsKey);
            
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
                // Fallback: default beállítások
                setSettings(prev => ({
                  ...prev,
                  displayName: user?.firstName || ''
                }));
              }
            } else {
              // Default settings új felhasználónak
              setSettings(prev => ({
                ...prev,
                useRealName: true,
                displayName: user?.firstName || '',
                enableLeaderboard: true
              }));
            }
          }
        } catch (error) {
          console.error('Error loading settings:', error);
          // Fallback to localStorage
          const userSettingsKey = `gameSettings_${user.id}`;
          const savedSettings = localStorage.getItem(userSettingsKey);
          
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
              setSettings(prev => ({
                ...prev,
                displayName: user?.firstName || ''
              }));
            }
          } else {
            setSettings(prev => ({
              ...prev,
              useRealName: true,
              displayName: user?.firstName || '',
              enableLeaderboard: true
            }));
          }
        }
      }
    };

    loadSettings();
  }, [user]);

  // Save settings to localStorage and Supabase
  const saveSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (typeof window !== 'undefined' && user?.id) {
      try {
        // Save to localStorage
        const userSettingsKey = `gameSettings_${user.id}`;
        localStorage.setItem(userSettingsKey, JSON.stringify(updatedSettings));
        
        // Save to Supabase database
        console.log('🔧 Saving settings to database:', { clerkId: user.id, settings: updatedSettings });
        const dbResult = await supabaseService.saveSettings(user.id, updatedSettings);
        
        if (dbResult.success) {
          console.log('✅ Settings saved to database successfully');
        } else {
          console.error('❌ Failed to save settings to database:', dbResult.error);
        }
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
