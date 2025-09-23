import React from 'react';

/**
 * CustomModal - Egyedi modal komponens
 * 
 * Ez a komponens egy általános modal ablakot biztosít:
 * - Testreszabható cím és tartalom
 * - Megerősítő és megszakító gombok
 * - Reszponzív design
 * - Animációk
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott állapot
 * @param {Function} props.onClose - Bezárás kezelő
 * @param {Function} props.onConfirm - Megerősítés kezelő
 * @param {string} props.title - Modal címe
 * @param {React.ReactNode} props.children - Modal tartalma
 * @param {string} props.confirmText - Megerősítő gomb szövege
 * @param {string} props.cancelText - Megszakító gomb szövege
 * @param {boolean} props.showConfirmButton - Megerősítő gomb megjelenítése
 * @returns {JSX.Element|null} Modal komponens vagy null
 */
const CustomModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  confirmText, 
  cancelText, 
  showConfirmButton = true 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10005] p-4">
      <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
        {/* Header */}
        <h3 className="text-2xl font-bold p-6 border-b border-gray-700">{title}</h3>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">{children}</div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          {/* Mobile: vertical layout with spacing */}
          <div className="flex flex-col space-y-6 md:hidden">
            <button 
              onClick={onConfirm} 
              className="bg-red-700 py-3 px-8 rounded-lg hover:bg-red-600 transition-all w-48 mx-auto whitespace-nowrap"
            >
              {confirmText || "Confirm"}
            </button>
            <button 
              onClick={onClose} 
              className="bg-gray-600 py-3 px-8 rounded-lg hover:bg-gray-500 transition-all w-48 mx-auto whitespace-nowrap"
            >
              {cancelText || "Cancel"}
            </button>
          </div>
          
          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex justify-end space-x-4">
            <button 
              onClick={onClose} 
              className="bg-gray-600 py-3 px-8 rounded-lg hover:bg-gray-500 transition-all w-48 whitespace-nowrap"
            >
              {cancelText || "Cancel"}
            </button>
            {showConfirmButton && (
              <button 
                onClick={onConfirm} 
                className="bg-red-700 py-3 px-8 rounded-lg hover:bg-red-600 transition-all w-48 whitespace-nowrap"
              >
                {confirmText || "Confirm"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;






