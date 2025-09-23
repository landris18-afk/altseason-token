import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import TermsModal from '../modals/TermsModal';

export default function TermsOverlay({ 
  setMuted, 
  muted, 
  setIsTermsModalOpen, 
  isTermsModalOpen,
  isCheckboxChecked,
  setIsCheckboxChecked,
  acceptTerms,
  onStartGame
}) {
  return (
    <section id="game" className="py-20 bg-gray-900 text-white relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Blurred Game Content */}
          <div className="backdrop-blur-md">
            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Bull Run Clicker</h1>
                <p className="text-gray-400">Pump the market to the moon!</p>
              </div>
              <button
                onClick={() => setMuted(m => !m)}
                className="ml-4 text-2xl text-gray-400 hover:text-yellow-400 focus:outline-none"
                aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 text-center">
              <div className="text-6xl font-bold mb-4">$0</div>
              <p className="text-gray-400">Market Cap</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Upgrades</h2>
                <div className="space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">Diamond Hands</h3>
                        <p className="text-sm text-gray-400">+1 MC per click</p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400">$100</div>
                        <div className="text-sm text-gray-400">Level 0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Locked Game Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gray-900/95 border-2 border-yellow-500/30 rounded-2xl p-8 max-w-lg w-full text-center shadow-lg shadow-yellow-500/20">
              <div className="text-4xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Bull Run Clicker</h2>
              <p className="text-gray-300 mb-6">
                Accept the terms and conditions to start your bull market adventure!
              </p>
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="bg-yellow-500 text-black font-bold py-2 px-8 rounded-lg hover:bg-yellow-400 transition-all"
              >
                Unlock Game
              </button>
            </div>
          </div>
        </div>
      </div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        isCheckboxChecked={isCheckboxChecked}
        onCheckboxChange={(e) => setIsCheckboxChecked(e.target.checked)}
        onAccept={acceptTerms}
        onStartGame={onStartGame}
      />
    </section>
  );
}

