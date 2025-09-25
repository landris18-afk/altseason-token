import { useEffect } from 'react';

/**
 * useModalScrollLock - Modal scroll lock hook
 * 
 * Ez a hook kezeli a scroll tiltást modal nyitáskor:
 * - Scroll tiltás modal nyitáskor
 * - Scroll visszaállítás modal bezáráskor
 * - Cleanup a komponens unmount-kor
 * 
 * @param {boolean} isModalOpen - Modal nyitott állapot
 */
export const useModalScrollLock = (isModalOpen) => {
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);
};