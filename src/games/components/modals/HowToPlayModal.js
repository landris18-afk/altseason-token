import React from 'react';

const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10005] p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              How to Play
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
        <div 
          className="px-6 py-6 space-y-6 max-h-96 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(234, 179, 8, 0.7) rgba(31, 41, 55, 0.5)'
          }}
        >
          {/* Goal Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              The Goal
            </h3>
            
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <p className="text-gray-300">
                Pump the Virtual Market Cap to reach new levels and become the ultimate bull! 
                The higher you go, the more legendary your rank becomes.
              </p>
            </div>
          </div>

          {/* How to Play Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How to Play
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
                <p className="text-gray-300">Smash <span className="text-yellow-400 font-semibold">&quot;PUMP THE BULL&quot;</span> to increase the market cap with each click.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
                <p className="text-gray-300">Buy <span className="text-yellow-400 font-semibold">Upgrades</span> to get more MC per click or passive income per second.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
                <p className="text-gray-300">Hit the <span className="text-yellow-400 font-semibold">Next Level threshold</span> to advance and change colors!</p>
              </div>
            </div>
          </div>

          {/* Competition Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Compete & Share
            </h3>
            
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <p className="text-gray-300">
                Share your rank on X to challenge friends! See who can become the ultimate bull and reach the highest levels.
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h5 className="font-semibold text-yellow-400 mb-2">Pro Tips</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Focus on upgrades that give you the best return on investment</li>
                  <li>• Passive income upgrades work even when you&apos;re not clicking</li>
                  <li>• Higher levels unlock more powerful upgrades</li>
                  <li>• Don&apos;t forget to share your achievements!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Got it! Let&apos;s Pump!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;