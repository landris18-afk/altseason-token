import { useState, useEffect } from 'react';
import { useMute } from '../components/context/MuteContext';

/**
 * useAudioManager - Audio kezelő hook
 * 
 * Ez a hook kezeli a játék összes hangját:
 * - Hangfájlok inicializálása
 * - Hang lejátszás némítás figyelembevételével
 * - Hibakezelés hang lejátszásnál
 * 
 * @returns {Object} Audio objektumok és lejátszó funkciók
 */
export const useAudioManager = () => {
  const { muted } = useMute();
  
  // Audio objektumok állapota
  const [pumpSound, setPumpSound] = useState(null);
  const [levelUpSound, setLevelUpSound] = useState(null);
  const [unlockSound, setUnlockSound] = useState(null);
  const [upgradeSound, setUpgradeSound] = useState(null);

  // Audio objektumok inicializálása
  useEffect(() => {
    setPumpSound(new Audio('/sound/pumpthebull.wav'));
    setLevelUpSound(new Audio('/sound/level.wav'));
    setUnlockSound(new Audio('/sound/unlock.wav'));
    setUpgradeSound(new Audio('/sound/Upgrades.wav'));
  }, []);

  // Általános hang lejátszó függvény
  const playSound = (sound, errorMessage = 'Audio playback failed') => {
    if (sound && !muted) {
      sound.currentTime = 0;
      sound.play().catch(error => console.log(errorMessage, error));
    }
  };

  // Specifikus hang lejátszó függvények
  const playPumpSound = () => playSound(pumpSound, 'Pump sound playback failed');
  const playLevelUpSound = () => playSound(levelUpSound, 'Level up sound playback failed');
  const playUnlockSound = () => playSound(unlockSound, 'Unlock sound playback failed');
  const playUpgradeSound = () => playSound(upgradeSound, 'Upgrade sound playback failed');

  return {
    // Audio objektumok
    pumpSound,
    levelUpSound,
    unlockSound,
    upgradeSound,
    
    // Lejátszó függvények
    playPumpSound,
    playLevelUpSound,
    playUnlockSound,
    playUpgradeSound
  };
};

