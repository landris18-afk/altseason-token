import { useEffect } from 'react';
import { fixUsesLeft } from '../utils/gameUtils';

/**
 * useUpgradeUnlock - Upgrade feloldás hook
 * 
 * Ez a hook kezeli az upgrade-ek feloldását:
 * - Követelmények ellenőrzése
 * - Használatok újratöltése
 * - Unlock hang lejátszás
 * 
 * @param {Object} gameState - Játék állapot
 * @param {Function} setGameState - Játék állapot frissítő
 * @param {boolean} isLoaded - Betöltött állapot flag
 * @param {Audio} unlockSound - Unlock hang
 * @param {boolean} muted - Némított állapot
 * @param {Object} lastReqLevelRef - Utolsó követelmény szint referencia
 */
export const useUpgradeUnlock = (
  gameState,
  setGameState,
  isLoaded,
  unlockSound,
  muted,
  lastReqLevelRef
) => {
  // Upgrade feloldás kezelése
  useEffect(() => {
    if (isLoaded) {
      // Végigmegyünk azokon az upgrade-eken, amelyeknek van követelménye
      for (let id = 2; id <= 8; id++) {
        const req = gameState.upgrades.find(u => u.id === id - 1);
        const upgrade = gameState.upgrades.find(u => u.id === id);
        if (!req || !upgrade || !upgrade.requirements) continue;
        
        const lvl = req.level;
        const last = lastReqLevelRef.current[id];
        
        // Csak akkor unlockolunk, ha most lépte át a requirements.level-t
        if (last !== undefined && last < upgrade.requirements.level && lvl >= upgrade.requirements.level) {
          setGameState(prevState => {
            const newUses = fixUsesLeft(prevState.usesLeft);
            if (id === 1) {
              newUses[id] = Infinity; // Diamond Hands: végtelen
            } else if (id === 2) {
              newUses[id] = Infinity; // Bull's Strength: végtelen
            } else if (id === 3) {
              newUses[id] = Infinity; // Moon Shot: végtelen
            } else if (id === 4) {
              newUses[id] = Infinity; // Shill Army: végtelen
            } else if (id === 5) {
              newUses[id] = 100; // FOMO Generator: 100 használat
            } else if (id === 6) {
              newUses[id] = 20; // Whale Magnet: 20 használat
            } else if (id === 7) {
              newUses[id] = Infinity; // Rocket Boost: végtelen
            } else if (id === 8) {
              newUses[id] = Infinity; // Supernova Strike: végtelen
            }
            
            return {
              ...prevState,
              usesLeft: newUses,
              upgrades: prevState.upgrades.map(u => 
                u.id === id 
                  ? { ...u, isUnlocked: true }
                  : u
              )
            };
          });
          
          // Hang lejátszása a használatok újratöltésekor, de csak ha nincs némítva
          if (unlockSound && !muted) {
            unlockSound.currentTime = 0;
            unlockSound.play().catch(error => console.log('Audio playback failed:', error));
          }
        }
        lastReqLevelRef.current[id] = lvl;
      }
    }
  }, [gameState.upgrades, isLoaded, unlockSound, muted, setGameState, lastReqLevelRef]);
};

