import { useState } from 'react';
import BullRunGame from './games/BullRunGame';
import { MuteProvider } from './games/components/context/MuteContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('game');

  return (
    <MuteProvider>
      <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setActiveTab('game')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'game'
                      ? 'bg-yellow-500 text-black font-bold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Bull Run Clicker
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main>
          {activeTab === 'game' && <BullRunGame />}
        </main>
      </div>
    </MuteProvider>
  );
} 