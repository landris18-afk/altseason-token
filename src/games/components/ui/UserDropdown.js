import React, { useState, useRef, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import SettingsModal from '../modals/SettingsModal';

const UserDropdown = ({ onTransfer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef(null);
  const { signOut } = useClerk();
  const { user } = useUser();

  // Get first name from user
  const getFirstName = () => {
    if (!user) return '';
    const fullName = user.fullName || user.firstName || user.emailAddresses?.[0]?.emailAddress || 'User';
    return fullName.split(' ')[0]; // Get only first name
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: '/game' });
      // Kijelentkezés után maradjon a /game oldalon
    } catch (error) {
      console.error('Sign out error:', error);
      // Hiba esetén is maradjon a /game oldalon
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button with Greeting */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 h-10 bg-gray-800/90 hover:bg-gray-700/95 text-white/90 hover:text-white transition-all duration-200 rounded-xl border border-gray-600/60 hover:border-gray-500/80 shadow-lg hover:shadow-xl"
        title="User Menu"
      >
        <span className="text-sm font-medium">
          Hi, <span className="text-yellow-400 font-semibold">{getFirstName()}</span>
        </span>
        <svg className="w-4 h-4 text-gray-400 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed left-0 right-0 md:absolute md:right-0 md:left-auto md:top-14 md:w-64 top-19 z-[10020] bg-gray-900/95 border-b-2 border-yellow-500/40 md:border-t-0 md:border md:border-gray-600/60 md:rounded-xl shadow-2xl overflow-y-auto max-h-96">
          <div className="md:py-1">
            {/* Transfer Option */}
            <button
              onClick={() => {
                onTransfer();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-4 text-left text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-purple-500/10 transition-all duration-200 flex items-center group md:rounded-none border border-purple-500/20 hover:border-purple-400/40"
            >
              {/* Mobile: Show icon */}
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-400/30 mr-4 group-hover:border-purple-400/50 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-200 shadow-lg group-hover:shadow-purple-500/20">
                <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-sm font-semibold text-purple-300 group-hover:text-purple-200">Transfer to Browser</span>
                <span className="text-sm md:text-xs text-purple-400/70 group-hover:text-purple-300/80">Move your progress</span>
              </div>
            </button>
            
            {/* Settings Option */}
            <button
              onClick={() => {
                setShowSettings(true);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-4 text-left text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/10 transition-all duration-200 flex items-center group md:rounded-none border border-blue-500/20 hover:border-blue-400/40"
            >
              {/* Mobile: Show icon */}
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-400/30 mr-4 group-hover:border-blue-400/50 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-200 shadow-lg group-hover:shadow-blue-500/20">
                <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-sm font-semibold text-blue-300 group-hover:text-blue-200">Settings</span>
                <span className="text-sm md:text-xs text-blue-400/70 group-hover:text-blue-300/80">Customize your experience</span>
              </div>
            </button>
            
            
            {/* Sign Out Option */}
            <button
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-4 text-left text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/10 transition-all duration-200 flex items-center group md:rounded-none border border-red-500/20 hover:border-red-400/40"
            >
              {/* Mobile: Show icon */}
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl border border-red-400/30 mr-4 group-hover:border-red-400/50 group-hover:from-red-500/30 group-hover:to-red-600/30 transition-all duration-200 shadow-lg group-hover:shadow-red-500/20">
                <svg className="w-5 h-5 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-sm font-semibold text-red-300 group-hover:text-red-200">Sign Out</span>
                <span className="text-sm md:text-xs text-red-400/70 group-hover:text-red-300/80">End your session</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default UserDropdown;
