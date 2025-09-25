import { useState, useCallback } from 'react';

/**
 * useAudio - Audio hook
 * 
 * Ez a hook kezeli a játék audio funkcionalitását.
 * 
 * @returns {Object} Audio állapot és funkciók
 */
export const useAudio = () => {
  const [muted, setMuted] = useState(false);

  // Unlock hang lejátszása
  const unlockSound = useCallback(() => {
    if (!muted) {
      // Itt lehetne hang lejátszás implementálni
    }
  }, [muted]);

  return {
    muted,
    setMuted,
    unlockSound
  };
};

