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
        className="flex items-center gap-3 px-4 py-2.5 h-10 bg-gray-800/90 hover:bg-gray-700/95 text-white/90 hover:text-white transition-all duration-200 rounded-xl backdrop-blur-sm border border-gray-600/60 hover:border-gray-500/80 shadow-lg hover:shadow-xl"
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
        <div className="fixed left-0 right-0 md:absolute md:right-0 md:left-auto md:top-14 md:w-64 top-19 z-50 bg-black/20 backdrop-blur-lg border-b-2 border-yellow-500/40 md:border-t-0 md:border md:border-gray-600/60 md:rounded-xl shadow-2xl overflow-hidden">
          <div className="py-2 md:py-1">
            {/* Transfer Option */}
            <button
              onClick={() => {
                onTransfer();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-4 text-left text-white hover:bg-white/10 md:hover:bg-gradient-to-r md:hover:from-purple-600/20 md:hover:to-purple-500/10 transition-all duration-200 flex items-center group rounded-lg md:rounded-none mb-1"
            >
              {/* Desktop: Show icon */}
              <div className="hidden md:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-400/30 mr-3 group-hover:border-purple-400/50 transition-colors">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-sm font-medium">Transfer to Browser</span>
                <span className="text-sm md:text-xs text-gray-400 hidden md:block">Move your progress</span>
              </div>
            </button>
            
            {/* Settings Option */}
            <button
              onClick={() => {
                setShowSettings(true);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-4 text-left text-white hover:bg-white/10 md:hover:bg-gradient-to-r md:hover:from-blue-600/20 md:hover:to-blue-500/10 transition-all duration-200 flex items-center group rounded-lg md:rounded-none mb-1"
            >
              {/* Desktop: Show icon */}
              <div className="hidden md:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30 mr-3 group-hover:border-blue-400/50 transition-colors">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-sm font-medium">Settings</span>
                <span className="text-sm md:text-xs text-gray-400 hidden md:block">Customize your experience</span>
              </div>
            </button>
            
            {/* Divider */}
            <div className="h-px bg-yellow-500/30 my-4 mx-4 md:border-t md:border-gray-700/50 md:my-1 md:mx-3"></div>
            
            {/* Sign Out Option */}
            <button
              onClick={() => {
                handleSignOut();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-4 text-left text-white hover:bg-white/10 md:hover:bg-gradient-to-r md:hover:from-red-600/20 md:hover:to-red-500/10 transition-all duration-200 flex items-center group rounded-lg md:rounded-none"
            >
              {/* Desktop: Show icon */}
              <div className="hidden md:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg border border-red-400/30 mr-3 group-hover:border-red-400/50 transition-colors">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-sm font-medium">Sign Out</span>
                <span className="text-sm md:text-xs text-gray-400 hidden md:block">End your session</span>
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
