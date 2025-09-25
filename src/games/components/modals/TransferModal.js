import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowRight, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useGameTransfer } from '../../hooks/useGameTransfer';

/**
 * TransferModal - Játék állapot átviteli modal
 * 
 * Ez a modal kezeli a játék állapot átvitelét böngésző → Clerk profil
 */
const TransferModal = ({ isOpen, onClose }) => {
  const {
    isTransferring,
    transferError,
    transferSuccess,
    canTransfer,
    transferGameState,
    resetTransferState
  } = useGameTransfer();

  const [browserState, setBrowserState] = useState(null);
  const [clerkState, setClerkState] = useState(null);

  // Állapot betöltése modal megnyitáskor
  useEffect(() => {
    if (isOpen) {
      resetTransferState();
      loadStates();
    }
  }, [isOpen, resetTransferState]);

  const loadStates = () => {
    if (typeof window !== 'undefined') {
      // Böngésző állapot
      const browserData = localStorage.getItem('bullRunGameState_v3');
      if (browserData) {
        try {
          const parsed = JSON.parse(browserData);
          setBrowserState(parsed);
        } catch (e) {
          console.error('Hiba a böngésző állapot betöltésekor:', e);
        }
      }

      // Clerk állapot (ha van)
      const clerkData = localStorage.getItem(`bullRunGameState_${window.clerk?.user?.id || 'temp'}`);
      if (clerkData) {
        try {
          const parsed = JSON.parse(clerkData);
          setClerkState(parsed);
        } catch (e) {
          console.error('Hiba a Clerk állapot betöltésekor:', e);
        }
      }
    }
  };

  const handleTransfer = async () => {
    const success = await transferGameState();
    if (success) {
      // Sikeres átvitel után frissítsük az állapotokat
      setTimeout(() => {
        loadStates();
      }, 1000);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatClickPower = (clickPower) => {
    if (clickPower >= 1e12) return `$${(clickPower / 1e12).toFixed(2)}T`;
    if (clickPower >= 1e9) return `$${(clickPower / 1e9).toFixed(2)}B`;
    if (clickPower >= 1e6) return `$${(clickPower / 1e6).toFixed(2)}M`;
    if (clickPower >= 1e3) return `$${(clickPower / 1e3).toFixed(2)}K`;
    return `$${clickPower.toFixed(0)}`;
  };

  const formatPassiveIncome = (passiveIncome) => {
    if (passiveIncome >= 1e12) return `$${(passiveIncome / 1e12).toFixed(2)}T`;
    if (passiveIncome >= 1e9) return `$${(passiveIncome / 1e9).toFixed(2)}B`;
    if (passiveIncome >= 1e6) return `$${(passiveIncome / 1e6).toFixed(2)}M`;
    if (passiveIncome >= 1e3) return `$${(passiveIncome / 1e3).toFixed(2)}K`;
    return `$${passiveIncome.toFixed(0)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10002] p-4">
      <div className="bg-gray-900/95 backdrop-blur-md border border-yellow-400/30 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Transfer to Browser
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
          {transferSuccess ? (
            // Successful transfer
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full border border-green-400/30 mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-3">Transfer Successful!</h3>
              <p className="text-gray-300 mb-6">
                Your game progress has been successfully transferred to your browser storage.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* State Comparison */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Progress Comparison
                </h3>
                
                {/* Browser State */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg border border-yellow-400/30">
                      <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-yellow-400">Browser Storage</h4>
                  </div>
                  {browserState ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Market Cap</span>
                        <span className="text-green-400 font-semibold">{formatNumber(browserState.marketCap)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Level</span>
                        <span className="text-blue-400 font-semibold">{browserState.levelIndex + 1}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">MC / Click</span>
                        <span className="text-purple-400 font-semibold">{formatClickPower(browserState.clickPower)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">MC / Second</span>
                        <span className="text-orange-400 font-semibold">{formatPassiveIncome(browserState.passiveIncome)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No saved progress</p>
                  )}
                </div>

                {/* Clerk State */}
                <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30">
                      <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-blue-400">Clerk Profile</h4>
                  </div>
                  {clerkState ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Market Cap</span>
                        <span className="text-green-400 font-semibold">{formatNumber(clerkState.marketCap)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Level</span>
                        <span className="text-blue-400 font-semibold">{clerkState.levelIndex + 1}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">MC / Click</span>
                        <span className="text-purple-400 font-semibold">{formatClickPower(clerkState.clickPower)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">MC / Second</span>
                        <span className="text-orange-400 font-semibold">{formatPassiveIncome(clerkState.passiveIncome)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No saved progress</p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {transferError && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg border border-red-400/30">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p className="text-red-400 text-sm">{transferError}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!transferSuccess && (
          <div className="px-6 py-4 border-t border-gray-700/50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={isTransferring || !canTransfer()}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isTransferring ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Transferring...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Transfer Progress</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferModal;
