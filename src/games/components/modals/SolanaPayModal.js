import { useState, useEffect, useRef } from 'react';
import { createQR } from '@solana/pay';
import { Connection, PublicKey } from '@solana/web3.js';
import { FaHourglassHalf, FaCheckCircle, FaExclamationTriangle, FaTimes, FaWallet } from 'react-icons/fa';
import Image from 'next/image';

// Használj egy megbízható RPC végpontot
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

const SolanaPayModal = ({ isOpen, onClose, onPaymentSuccess, currentLevel }) => {
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);
  const paymentDataRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPaymentRequest = async () => {
      setPaymentStatus('loading');
      setError(null);
      try {
        const response = await fetch('/api/transaction', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentLevel })
        });
        if (!response.ok) throw new Error('Failed to fetch payment details');
        const data = await response.json();
        paymentDataRef.current = data;
        
        const solanaPayUrl = `solana:${data.account}?amount=${data.amount}&reference=${data.reference}&label=Altseason%202025&message=Premium%20Upgrade`;
        const qr = createQR(solanaPayUrl, 300, 'transparent');
        
        const qrBlob = await qr.getRawData('image/png');
        const reader = new FileReader();
        reader.onload = (event) => setQrCode(event.target.result);
        reader.readAsDataURL(qrBlob);

        setPaymentStatus('qrReady');
      } catch (error) {
        console.error("Payment request failed:", error);
        setError(error.message);
        setPaymentStatus('error');
      }
    };

    fetchPaymentRequest();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen, currentLevel]);

  useEffect(() => {
    if (paymentStatus !== 'qrReady' || !paymentDataRef.current) return;

    const connection = new Connection(SOLANA_RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000
    });
    const referencePublicKey = new PublicKey(paymentDataRef.current.reference);

    intervalRef.current = setInterval(async () => {
      try {
        const signatures = await connection.getSignaturesForAddress(referencePublicKey, { limit: 1 });
        if (signatures.length > 0) {
          clearInterval(intervalRef.current);
          setPaymentStatus('confirmed');
        }
      } catch (error) {
        console.error("Signature check failed:", error);
        setError(error.message);
      }
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [paymentStatus]);

  useEffect(() => {
    if (paymentStatus === 'confirmed') {
      onPaymentSuccess();
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [paymentStatus, onPaymentSuccess, onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (paymentStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="bg-yellow-500/10 rounded-full p-6 mb-6">
              <FaHourglassHalf className="text-6xl text-yellow-400 animate-spin" />
            </div>
            <p className="text-xl font-semibold text-gray-200">Generating payment request...</p>
          </div>
        );
      case 'qrReady':
        return (
          <div className="flex flex-col sm:flex-row items-center gap-6 min-h-[200px]">
            {/* Desktop QR Code */}
            <div className="hidden sm:block bg-white/5 rounded-xl p-4">
              {qrCode && (
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-lg shadow-lg">
                  <Image 
                    src={qrCode} 
                    alt="Solana Pay QR Code" 
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            {/* Mobile Payment Button */}
            <div className="sm:hidden w-full">
              <button
                onClick={() => {
                  if (paymentDataRef.current) {
                    const solanaPayUrl = `solana:${paymentDataRef.current.account}?amount=${paymentDataRef.current.amount}&reference=${paymentDataRef.current.reference}&label=Altseason%202025&message=Premium%20Upgrade`;
                    window.location.href = solanaPayUrl;
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3"
              >
                <FaWallet className="w-6 h-6" />
                Pay with Solana
              </button>
            </div>
            <div className="text-center sm:text-left space-y-4 flex-1">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {window.innerWidth < 640 ? 'Pay with Solana' : 'Scan with your Solana Wallet'}
                </h4>
                <p className="text-gray-400">
                  {window.innerWidth < 640 
                    ? 'Click the button above to open your Solana wallet and complete the payment.'
                    : 'Scan this QR code with a Solana-compatible wallet (e.g., Phantom, Solflare) to purchase.'}
                </p>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-3">
                <p className="font-mono text-base sm:text-lg text-purple-300">
                  Amount: {paymentDataRef.current?.amount} SOL
                </p>
                <p className="text-sm text-purple-400 mt-1">
                  Current Level: {currentLevel + 1} ({(currentLevel + 2)}x multiplier)
                </p>
              </div>
              <div>
                <p className="text-yellow-400 animate-pulse flex items-center gap-2">
                  <FaHourglassHalf className="animate-spin" />
                  Waiting for transaction confirmation...
                </p>
              </div>
            </div>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="bg-green-500/20 rounded-full p-6 mb-6">
              <FaCheckCircle className="text-6xl text-green-400" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">Payment Successful!</h4>
            <p className="text-gray-300">Your upgrade is now active!</p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="bg-red-500/20 rounded-full p-6 mb-6">
              <FaExclamationTriangle className="text-6xl text-red-400" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">Error</h4>
            <p className="text-gray-300">{error}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gray-900 border-2 border-purple-500/50 rounded-xl shadow-lg shadow-purple-500/20 w-full max-w-2xl text-white animate-fade-in-up my-2 sm:my-4">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 z-10 flex items-center justify-between p-3 sm:p-4 border-b border-gray-800">
          <h3 className="text-lg sm:text-xl font-bold">Solana Bull&apos;s Blessing</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg"
            disabled={paymentStatus === 'confirmed'}
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 z-10 p-3 sm:p-4 border-t border-gray-800">
          <button 
            onClick={onClose} 
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
              paymentStatus === 'confirmed' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            disabled={paymentStatus === 'confirmed'}
          >
            {paymentStatus === 'confirmed' ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolanaPayModal;