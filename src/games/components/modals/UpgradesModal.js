/**
 * UpgradesModal.js - Upgrades modal komponens mobilnézethez
 * 
 * Ez a komponens egy teljes képernyős modal-t jelenít meg az upgrade-ekhez mobilnézetben:
 * - Teljes képernyős modal
 * - Slide-in animáció
 * - UpgradesPanel integráció
 * - Bezárás gomb
 */

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import UpgradesPanel from '../panels/UpgradesPanel';

/**
 * UpgradesModal - Upgrades modal komponens
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott-e
 * @param {Function} props.onClose - Modal bezárása
 * @param {Object} props.upgradesProps - UpgradesPanel props-ai
 * @returns {JSX.Element} Modal komponens
 */
const UpgradesModal = ({ isOpen, onClose, upgradesProps }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 border border-slate-600/30 rounded-2xl shadow-2xl w-full max-w-md h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
          <div>
            <h3 className="text-xl font-bold text-white">Upgrades</h3>
            <p className="text-gray-400 text-sm">Manage your upgrades</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <UpgradesPanel {...upgradesProps} />
        </div>
      </div>
    </div>
  );
};

export default UpgradesModal;

