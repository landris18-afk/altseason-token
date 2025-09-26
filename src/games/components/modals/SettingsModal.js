import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useGameSettings } from '../../hooks/useGameSettings';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { settings, saveSettings, displayName } = useGameSettings();
  const [localSettings, setLocalSettings] = useState({
    displayName: displayName,
    useRealName: settings.useRealName,
    leaderboardEnabled: settings.enableLeaderboard
  });
  const [isSaving, setIsSaving] = useState(false);

  // Frissítsd a localSettings-et, amikor a modal megnyílik vagy a beállítások változnak
  useEffect(() => {
    if (isOpen) {
      setLocalSettings({
        displayName: displayName,
        useRealName: settings.useRealName,
        leaderboardEnabled: settings.enableLeaderboard
      });
    }
  }, [isOpen, settings.useRealName, settings.enableLeaderboard, displayName]);

  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings({
        displayName: localSettings.displayName,
        useRealName: localSettings.useRealName,
        enableLeaderboard: localSettings.leaderboardEnabled
      });
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      // Still close the modal even if there's an error
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // Get login method info
  const getLoginMethod = () => {
    if (!user) return { provider: 'Unknown', icon: '❓' };
    
    // Check external accounts first (OAuth providers)
    const externalAccounts = user.externalAccounts || [];
    if (externalAccounts.length > 0) {
      const primaryAccount = externalAccounts[0];
      const provider = primaryAccount.provider;
      
      switch (provider) {
        case 'google':
          return { provider: 'Google', icon: '🔍' };
        case 'facebook':
          return { provider: 'Facebook', icon: '📘' };
        case 'twitter':
          return { provider: 'Twitter', icon: '🐦' };
        case 'discord':
          return { provider: 'Discord', icon: '🎮' };
        case 'github':
          return { provider: 'GitHub', icon: '🐙' };
        case 'metamask':
          return { provider: 'MetaMask', icon: '🦊' };
        case 'wallet_connect':
          return { provider: 'WalletConnect', icon: '🔗' };
        default:
          return { provider: provider.charAt(0).toUpperCase() + provider.slice(1), icon: '🔗' };
      }
    }
    
    // Check email verification strategy as fallback
    const emailAddress = user.emailAddresses?.[0];
    const strategy = emailAddress?.verification?.strategy;
    
    switch (strategy) {
      case 'email_code':
        return { provider: 'Email Code', icon: '📧' };
      case 'email_link':
        return { provider: 'Email Link', icon: '📧' };
      case 'email':
        return { provider: 'Email', icon: '📧' };
      default:
        return { provider: 'Email', icon: '📧' };
    }
  };

  const loginMethod = getLoginMethod();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10050] p-4">
      {/* Desktop: Modal popup */}
      <div className="hidden md:block bg-gray-900/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-yellow-400/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Settings
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700/80 hover:bg-gray-600/90 text-gray-300 hover:text-white transition-all duration-200 rounded-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Desktop: Two column layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: User Info */}
            <div className="space-y-4">
              <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600/30 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white font-medium">{user?.fullName || user?.firstName || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Email:</span>
                    <span className="text-white text-sm">{user?.emailAddresses?.[0]?.emailAddress || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Login Method:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{loginMethod.icon}</span>
                      <span className="text-white font-medium">{loginMethod.provider}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings */}
            <div className="space-y-4">
              <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600/30 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Display Settings
                </h3>
                
                {/* Use Real Name */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-white font-medium">Use Real Name</span>
                    <p className="text-gray-400 text-sm">Display your real name from profile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.useRealName}
                      onChange={(e) => handleSettingChange('useRealName', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>

                {/* Custom Display Name */}
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Custom Display Name</label>
                  <input
                    type="text"
                    value={localSettings.displayName}
                    onChange={(e) => handleSettingChange('displayName', e.target.value)}
                    placeholder="Enter your display name"
                    disabled={localSettings.useRealName}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Leaderboard Participation */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">Leaderboard Participation</span>
                    <p className="text-gray-400 text-sm">Show your scores on the leaderboard</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.leaderboardEnabled}
                      onChange={(e) => handleSettingChange('leaderboardEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-yellow-400/20">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-700/80 hover:bg-gray-600/90 text-white rounded-xl transition-all duration-200 font-medium border border-gray-600/30"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Full screen page */}
      <div className="md:hidden fixed inset-0 z-[10005]">
        <div 
          className="w-full h-full flex flex-col"
          style={{
            backgroundImage: 'url(/images/rockat_pump_bacground.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Header */}
          <div className="px-4 py-4 bg-gray-900/98 border-b border-yellow-400">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-700/80 hover:bg-gray-600/90 text-gray-300 hover:text-white transition-all duration-200 rounded-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
            {/* User Info */}
            <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600/30 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Name:</span>
                  <span className="text-white font-medium">{user?.fullName || user?.firstName || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white font-medium">{user?.emailAddresses?.[0]?.emailAddress || 'Unknown'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Login Method:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{loginMethod.icon}</span>
                    <span className="text-white font-medium">{loginMethod.provider}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600/30 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Display Settings
              </h3>
              
              {/* Use Real Name */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-white font-medium">Use Real Name</span>
                  <p className="text-gray-400 text-sm">Display your real name from profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.useRealName}
                    onChange={(e) => handleSettingChange('useRealName', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>

              {/* Custom Display Name */}
              <div className="mb-4">
                <label className="block text-white font-medium mb-2">Custom Display Name</label>
                <input
                  type="text"
                  value={localSettings.displayName}
                  onChange={(e) => handleSettingChange('displayName', e.target.value)}
                  placeholder="Enter your display name"
                  disabled={localSettings.useRealName}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>

              {/* Leaderboard Participation */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Leaderboard Participation</span>
                  <p className="text-gray-400 text-sm">Show your scores on the leaderboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.leaderboardEnabled}
                    onChange={(e) => handleSettingChange('leaderboardEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600/30 shadow-lg">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;