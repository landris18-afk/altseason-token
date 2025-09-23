import React from 'react';
import { FaSync, FaQuestionCircle, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

/**
 * GameControls - Játék vezérlők komponens
 * 
 * Ez a komponens megjeleníti a játék vezérlő gombjait:
 * - How to Play gomb
 * - Share Score gomb
 * - Reset gomb
 * - Mute/Unmute gomb
 * - Desktop és mobile nézetek
 * 
 * @param {Object} props - Props objektum
 * @param {Function} props.onShowRules - Szabályok megjelenítése
 * @param {Function} props.onReset - Játék reset
 * @param {Function} props.onToggleMute - Némítás váltás
 * @param {string} props.twitterUrl - Twitter megosztás URL
 * @param {boolean} props.muted - Némított állapot
 * @returns {JSX.Element} Játék vezérlők komponens
 */
const GameControls = ({ 
  onShowRules, 
  onReset, 
  onToggleMute, 
  twitterUrl, 
  muted 
}) => {
  // Hover effect helper functions
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#eab308';
    e.target.style.color = '#000000';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)';
    e.target.style.color = '#d1d5db';
  };

  const handleMuteMouseEnter = (e) => {
    e.target.style.backgroundColor = '#eab308';
  };

  const handleMuteMouseLeave = (e) => {
    e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)';
  };

  return (
    <>
      {/* Desktop Controls */}
      <div className="hidden md:flex justify-center items-center space-x-3 mt-8">
        <button 
          onClick={onShowRules} 
          className="bg-slate-700/50 text-gray-300 py-2 px-4 rounded-lg flex items-center space-x-2 transition-all border border-slate-600/30"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FaQuestionCircle className="text-lg"/> 
          <span className="text-sm">How to Play</span>
        </button>
        <a 
          href={twitterUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-slate-700/50 text-gray-300 py-2 px-4 rounded-lg inline-flex items-center space-x-2 transition-all border border-slate-600/30"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        > 
          <FaXTwitter className="text-lg"/>
          <span className="text-sm">Share Score</span>
        </a>
        <button 
          onClick={onReset} 
          className="bg-slate-700/50 text-gray-300 py-2 px-4 rounded-lg flex items-center space-x-2 transition-all border border-slate-600/30"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FaSync className="text-lg"/> 
          <span className="text-sm">Reset</span>
        </button>
        <button 
          onClick={onToggleMute} 
          className="p-2 bg-slate-700/50 rounded-lg transition-all border border-slate-600/30" 
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          onMouseEnter={handleMuteMouseEnter}
          onMouseLeave={handleMuteMouseLeave}
        >
          {muted ? <FaVolumeMute className="text-lg text-gray-300 hover:text-white" /> : <FaVolumeUp className="text-lg text-gray-300 hover:text-white" />}
        </button>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden flex flex-col items-center gap-4 mt-6">
        <a 
          href={twitterUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-slate-700/50 text-gray-300 py-3 px-6 rounded-lg inline-flex items-center space-x-2 transition-all border border-slate-600/30 h-16 text-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        > 
          <FaXTwitter/>
          <span>Share Score</span>
        </a>
        <div className="flex space-x-4">
          <button 
            onClick={onShowRules} 
            className="p-3 bg-slate-700/50 rounded-lg transition-all border border-slate-600/30"
            onMouseEnter={handleMuteMouseEnter}
            onMouseLeave={handleMuteMouseLeave}
          >
            <FaQuestionCircle className="text-xl text-gray-300"/>
          </button>
          <button 
            onClick={onReset} 
            className="p-3 bg-slate-700/50 rounded-lg transition-all border border-slate-600/30"
            onMouseEnter={handleMuteMouseEnter}
            onMouseLeave={handleMuteMouseLeave}
          >
            <FaSync className="text-xl text-gray-300"/>
          </button>
          <button 
            onClick={onToggleMute} 
            className="p-3 bg-slate-700/50 rounded-lg transition-all border border-slate-600/30" 
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            onMouseEnter={handleMuteMouseEnter}
            onMouseLeave={handleMuteMouseLeave}
          >
            {muted ? <FaVolumeMute className="text-xl text-gray-300" /> : <FaVolumeUp className="text-xl text-gray-300" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default GameControls;

