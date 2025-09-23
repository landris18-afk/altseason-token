import React from 'react';
import { FaTimes } from 'react-icons/fa';

const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full screen */}
      <div className="md:hidden fixed inset-0 bg-gray-900 z-[10000]">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">How to Play</h3>
            <p className="text-gray-400 text-sm">Master the Bull Run Clicker</p>
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
          {/* Goal Section */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎯</span>
              <h4 className="font-semibold text-white text-lg">The Goal</h4>
            </div>
            <p className="text-gray-300">
              Pump the Virtual Market Cap to reach new levels and become the ultimate bull! 
              The higher you go, the more legendary your rank becomes.
            </p>
          </div>

          {/* How to Play Steps */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚀</span>
              <h4 className="font-semibold text-white text-lg">How to Play</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
                <p className="text-gray-300">Smash <span className="text-yellow-400 font-semibold">&quot;PUMP THE BULL&quot;</span> to increase the market cap with each click.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
                <p className="text-gray-300">Buy <span className="text-yellow-400 font-semibold">Upgrades</span> to get more MC per click or passive income per second.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
                <p className="text-gray-300">Hit the <span className="text-yellow-400 font-semibold">Next Level threshold</span> to advance and change colors!</p>
              </div>
            </div>
          </div>

          {/* Competition Section */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏆</span>
              <h4 className="font-semibold text-white text-lg">Compete & Share</h4>
            </div>
            <p className="text-gray-300">
              Share your rank on X to challenge friends! See who can become the ultimate bull and reach the highest levels.
            </p>
          </div>

          {/* Tips Section */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">💡</span>
              <div>
                <h5 className="font-semibold text-yellow-400 mb-1">Pro Tips</h5>
                <p className="text-gray-300 text-sm">
                  • Focus on upgrades that give you the best return on investment<br/>
                  • Passive income upgrades work even when you&apos;re not clicking<br/>
                  • Higher levels unlock more powerful upgrades<br/>
                  • Don&apos;t forget to share your achievements!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl hover:scale-105 transform"
          >
            Got it! Let&apos;s Pump!
          </button>
        </div>
      </div>
      </div>

      {/* Desktop: Popup modal */}
      <div className="hidden md:flex fixed inset-0 bg-black/80 backdrop-blur-sm items-center justify-center z-[10000] p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/20 w-full max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">How to Play</h3>
            <p className="text-gray-400 text-sm">Master the Bull Run Clicker</p>
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
          {/* Goal Section */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎯</span>
              <h4 className="font-semibold text-white text-lg">The Goal</h4>
            </div>
            <p className="text-gray-300">
              Pump the Virtual Market Cap to reach new levels and become the ultimate bull! 
              The higher you go, the more legendary your rank becomes.
            </p>
          </div>

          {/* How to Play Steps */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚀</span>
              <h4 className="font-semibold text-white text-lg">How to Play</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
                <p className="text-gray-300">Smash <span className="text-yellow-400 font-semibold">&quot;PUMP THE BULL&quot;</span> to increase the market cap with each click.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
                <p className="text-gray-300">Buy <span className="text-yellow-400 font-semibold">Upgrades</span> to get more MC per click or passive income per second.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
                <p className="text-gray-300">Hit the <span className="text-yellow-400 font-semibold">Next Level threshold</span> to advance and change colors!</p>
              </div>
            </div>
          </div>

          {/* Competition Section */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏆</span>
              <h4 className="font-semibold text-white text-lg">Compete & Share</h4>
            </div>
            <p className="text-gray-300">
              Share your rank on X to challenge friends! See who can become the ultimate bull and reach the highest levels.
            </p>
          </div>

          {/* Tips Section */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">💡</span>
              <div>
                <h5 className="font-semibold text-yellow-400 mb-1">Pro Tips</h5>
                <p className="text-gray-300 text-sm">
                  • Focus on upgrades that give you the best return on investment<br/>
                  • Passive income upgrades work even when you&apos;re not clicking<br/>
                  • Higher levels unlock more powerful upgrades<br/>
                  • Don&apos;t forget to share your achievements!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl hover:scale-105 transform"
          >
            Got it! Let&apos;s Pump!
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default HowToPlayModal;





