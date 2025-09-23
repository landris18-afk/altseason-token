import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * TermsModal - Feltételek modal
 * 
 * Ez a komponens megjeleníti a játék feltételeit és szabályait:
 * - Üdvözlő üzenet
 * - Játék információk
 * - Feltételek elfogadása
 * - Checkbox és elfogadás gomb
 * - Játék modal megnyitása
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott állapot
 * @param {Function} props.onClose - Bezárás kezelő
 * @param {boolean} props.isCheckboxChecked - Checkbox állapot
 * @param {Function} props.onCheckboxChange - Checkbox változtatás kezelő
 * @param {Function} props.onAccept - Elfogadás kezelő
 * @param {Function} props.onStartGame - Játék indítás kezelő
 * @returns {JSX.Element|null} Modal komponens vagy null
 */
const TermsModal = ({ 
  isOpen, 
  onClose, 
  isCheckboxChecked, 
  onCheckboxChange, 
  onAccept,
  onStartGame 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/20 w-full max-w-[95%] sm:max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Welcome to Bull Run!</h3>
            <p className="text-gray-400 text-sm">Let&apos;s get you started</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-grow overflow-y-auto p-6 space-y-6 modal-scroll"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(234, 179, 8, 0.7) rgba(31, 41, 55, 0.5)'
          }}
        >
          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-yellow-400 mb-2">Ready to Pump?</h4>
            <p className="text-gray-300 text-lg">
              Before you start your bull run, here&apos;s what you need to know:
            </p>
          </div>

          {/* Game Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎮</span>
                <h5 className="font-semibold text-white">Pure Entertainment</h5>
              </div>
              <p className="text-gray-400 text-sm">
                This is a fun clicker game for entertainment only
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💰</span>
                <h5 className="font-semibold text-white">Virtual Currency</h5>
              </div>
              <p className="text-gray-400 text-sm">
                All in-game values are virtual and have no real value
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💾</span>
                <h5 className="font-semibold text-white">Local Progress</h5>
              </div>
              <p className="text-gray-400 text-sm">
                Your progress is saved locally in your browser
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎯</span>
                <h5 className="font-semibold text-white">No Investment</h5>
              </div>
              <p className="text-gray-400 text-sm">
                This is not a financial investment or trading platform
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div>
                <h5 className="font-semibold text-yellow-400 mb-1">Important</h5>
                <p className="text-gray-300 text-sm">
                  This is purely a game for fun. No real money can be earned, invested, or withdrawn. 
                  Just enjoy the bull run!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <div className="space-y-4">
            {/* Checkbox */}
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isCheckboxChecked}
                  onChange={onCheckboxChange}
                  className="sr-only"
                />
                <div className={`w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center
                  ${isCheckboxChecked 
                    ? 'bg-yellow-500 border-yellow-500' 
                    : 'border-yellow-500/50 group-hover:border-yellow-500'}`}
                >
                  {isCheckboxChecked && (
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
                I understand this is a game for entertainment only
              </span>
            </label>

            {/* Action Button */}
            <button
              onClick={onStartGame || onAccept}
              disabled={!isCheckboxChecked}
              className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg
                ${isCheckboxChecked 
                  ? 'hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl hover:scale-105 transform' 
                  : 'opacity-50 cursor-not-allowed'}`}
            >
              Start Bull Run!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;





