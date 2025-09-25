import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useGameSettings } from '../../hooks/useGameSettings';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const { settings, saveSettings, displayName } = useGameSettings();
  const [localSettings, setLocalSettings] = useState({
    displayName: displayName,
    useRealName: settings.useRealName,
    enableLeaderboard: settings.enableLeaderboard
  });

  // Frissítsd a localSettings-et, amikor a modal megnyílik vagy a beállítások változnak
  useEffect(() => {
    if (isOpen) {
      setLocalSettings({
        displayName: displayName,
        useRealName: settings.useRealName,
        enableLeaderboard: settings.enableLeaderboard
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

  const handleSave = () => {
    saveSettings(localSettings);
    onClose();
  };

  // Get login method info
  const getLoginMethod = () => {
    if (!user) return { provider: 'Unknown', icon: '❓' };
    
    const emailAddress = user.emailAddresses?.[0];
    const provider = emailAddress?.verification?.strategy || 'email';
    
    switch (provider) {
      case 'google':
        return { provider: 'Google', icon: '🔍' };
      case 'oauth_google':
        return { provider: 'Google', icon: '🔍' };
      case 'oauth_facebook':
        return { provider: 'Facebook', icon: '📘' };
      case 'oauth_twitter':
        return { provider: 'Twitter', icon: '🐦' };
      case 'oauth_discord':
        return { provider: 'Discord', icon: '🎮' };
      case 'oauth_github':
        return { provider: 'GitHub', icon: '🐙' };
      case 'metamask':
        return { provider: 'MetaMask', icon: '🦊' };
      case 'wallet_connect':
        return { provider: 'WalletConnect', icon: '🔗' };
      case 'email':
      case 'email_code':
        return { provider: 'Email', icon: '📧' };
      default:
        return { provider: 'Email', icon: '📧' };
    }
  };

  const loginMethod = getLoginMethod();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10002] p-4">
      {/* Desktop: Modal popup */}
      <div className="hidden md:block bg-gray-900/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Desktop: Two column layout */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            {/* Left Column: User Info */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
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
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Display Settings</h3>
                
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
                {!localSettings.useRealName && (
                  <div className="mb-4">
                    <label className="block text-white font-medium mb-2">Custom Display Name</label>
                    <input
                      type="text"
                      value={localSettings.displayName}
                      onChange={(e) => handleSettingChange('displayName', e.target.value)}
                      placeholder="Enter your display name"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Leaderboard Participation */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium">Leaderboard Participation</span>
                    <p className="text-gray-400 text-sm">Show your scores on the leaderboard</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.enableLeaderboard}
                      onChange={(e) => handleSettingChange('enableLeaderboard', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Single column layout */}
          <div className="md:hidden space-y-4">
            {/* User Info */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
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

            {/* Display Settings */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Display Settings</h3>
              
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
              {!localSettings.useRealName && (
                <div className="mb-4">
                  <label className="block text-white font-medium mb-2">Custom Display Name</label>
                  <input
                    type="text"
                    value={localSettings.displayName}
                    onChange={(e) => handleSettingChange('displayName', e.target.value)}
                    placeholder="Enter your display name"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Leaderboard Participation */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Leaderboard Participation</span>
                  <p className="text-gray-400 text-sm">Show your scores on the leaderboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.enableLeaderboard}
                    onChange={(e) => handleSettingChange('enableLeaderboard', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg transition-colors font-medium"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
