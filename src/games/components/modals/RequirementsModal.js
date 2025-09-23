import { FaTimes } from 'react-icons/fa';
import { getNextLevelUses } from '../../utils/gameUtils';

/**
 * RequirementsModal - Követelmények modal
 * 
 * Ez a komponens megjeleníti az upgrade követelményeit:
 * - Upgrade információk megjelenítése
 * - Használatok és követelmények
 * - Locked/available állapot
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott állapot
 * @param {Function} props.onClose - Bezárás kezelő
 * @param {Object} props.upgrade - Upgrade objektum
 * @param {Object} props.requiredUpgrade - Szükséges upgrade
 * @param {Object} props.usesLeft - Maradék használatok
 * @returns {JSX.Element|null} Modal komponens vagy null
 */
const RequirementsModal = ({ isOpen, onClose, upgrade, requiredUpgrade, usesLeft }) => {
  if (!isOpen || !upgrade || !requiredUpgrade) return null;

  const currentUses = usesLeft[upgrade.id] ?? 0;
  const tiers = Math.floor(requiredUpgrade.level / 5);
  const maxUses = tiers * getNextLevelUses(upgrade.id);
  const isLocked = currentUses <= 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400">Upgrade Requirements</h3>
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
            <h4 className="text-xl font-bold mb-2 text-yellow-400">{upgrade.name}</h4>
            <p className="text-gray-300 mb-4">{upgrade.description}</p>
            
            {isLocked ? (
              <div className="text-red-400">
                <p className="font-bold mb-2">This upgrade is currently locked!</p>
                <p>You need to wait until {requiredUpgrade.name} reaches level {requiredUpgrade.requirements?.level || 5} to unlock more uses.</p>
              </div>
            ) : (
              <div className="text-green-400">
                <p className="font-bold mb-2">This upgrade is available!</p>
                <p>Uses remaining: {currentUses}/{maxUses}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-gray-600 py-2 px-5 rounded-lg hover:bg-gray-500 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsModal;

