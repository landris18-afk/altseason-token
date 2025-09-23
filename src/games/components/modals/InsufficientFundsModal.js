import { FaTimes } from 'react-icons/fa';

/**
 * InsufficientFundsModal - Elégtelen források modal
 * 
 * Ez a komponens megjeleníti, ha nincs elég Market Cap egy upgrade vásárlásához:
 * - Költség és egyenleg megjelenítése
 * - Hiányzó összeg kiszámítása
 * - Motiváló üzenet
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott állapot
 * @param {Function} props.onClose - Bezárás kezelő
 * @param {number} props.cost - Szükséges költség
 * @param {number} props.marketCap - Jelenlegi Market Cap
 * @returns {JSX.Element|null} Modal komponens vagy null
 */
const InsufficientFundsModal = ({ isOpen, onClose, cost, marketCap }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400">Need More Market Cap!</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300 text-lg mb-2">
              Not enough Market Cap to purchase this upgrade!
            </p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-gray-400">Required:</p>
                <p className="text-yellow-400 font-bold">${cost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Your Balance:</p>
                <p className="text-red-400 font-bold">${marketCap.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300">Keep clicking to earn more Market Cap!</p>
            <p className="text-yellow-400 mt-2">You need ${(cost - marketCap).toLocaleString()} more!</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-yellow-500 text-black font-bold py-2 px-8 rounded-lg hover:bg-yellow-400 transition-all"
          >
            Let&apos;s Go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientFundsModal;

