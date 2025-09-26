import { useEffect, useRef } from 'react';
import { getInitialState } from '../data/gameData';
import { fixUsesLeft } from '../utils/gameUtils';
import supabaseService from '../../lib/supabaseService';

/**
 * useGameLoading - Játék állapot betöltő hook
 * 
 * Ez a hook kezeli a játék állapot betöltését localStorage-ból és adatbázisból.
 * 
 * @param {Object} user - Clerk user objektum
 * @param {Function} setGameState - A játék állapot frissítő függvény
 * @param {Function} setIsGameLoaded - A betöltött állapot jelző frissítő függvény
 * @param {Object} hasLoadedFromStorage - Ref objektum a betöltött állapot követésére
 * @param {Object} lastUserIdRef - Ref objektum az utolsó user ID követésére
 * @param {Object} hasInitializedRef - Ref objektum az inicializálás jelzésére
 */
export const useGameLoading = (
  user,
  setGameState,
  setIsGameLoaded,
  hasLoadedFromStorage,
  lastUserIdRef,
  hasInitializedRef
) => {
  // Mentett állapot betöltése
  useEffect(() => {
    const loadGameState = () => {
      if (typeof window !== 'undefined') {
        const userId = user?.id;
        
        // Ha nincs bejelentkezett user, akkor böngésző adatokat betöltjük
        if (!userId) {
          const browserState = localStorage.getItem('bullRunGameState_v3');
          if (browserState) {
            try {
              const parsed = JSON.parse(browserState);
              const initialState = getInitialState();
              const fixedUsesLeft = fixUsesLeft(parsed.usesLeft);
              const mergedUpgrades = initialState.upgrades.map(init => {
                const savedUpgrade = parsed.upgrades && parsed.upgrades.find(u => u.id === init.id);
                const usesLeft = fixedUsesLeft[init.id];
                return {
                  ...init,
                  ...savedUpgrade,
                  isUnlocked: init.id === 1 || (typeof usesLeft === 'number' && usesLeft > 0)
                };
              });
              const newGameState = {
                ...initialState,
                ...parsed,
                usesLeft: fixedUsesLeft,
                upgrades: mergedUpgrades,
                minMarketCapThisLevel: parsed.minMarketCapThisLevel ?? parsed.marketCap ?? 0
              };
              setGameState(newGameState);
              hasLoadedFromStorage.current = true;
              setIsGameLoaded(true);
            } catch (e) {
              console.error('Hiba a böngésző állapot betöltésekor:', e);
              setIsGameLoaded(true);
            }
          } else {
            // Nincs localStorage adat, 0-ás értékekkel kezdjük
            const initialState = getInitialState();
            setGameState(initialState);
            hasLoadedFromStorage.current = true;
            setIsGameLoaded(true);
          }
        } else {
          // Bejelentkezett user: MINDIG adatbázisból betölt, localStorage cache törlése
          
          // Először ellenőrizzük és frissítjük a user adatokat
          const checkAndUpdateUserData = async () => {
            try {
              await supabaseService.upsertUser(user);
            } catch (error) {
              console.error('Error updating user data on login:', error);
            }
          };
          
          checkAndUpdateUserData();
          
          // Töröljük a localStorage cache-t, hogy friss adatbázis adatokat kapjunk
          const userStorageKey = `bullRunGameState_${userId}`;
          localStorage.removeItem(userStorageKey);
          
          // Adatbázisból betöltés és localStorage-ba mentés
          const loadFromDatabaseAndCache = async () => {
            try {
              const response = await fetch(`/api/game/load?userId=${userId}`);
              const result = await response.json();
              
              if (result.success && result.data) {
                const initialState = getInitialState();
                
                // Supabase adatok átalakítása játék formátumra
                const dbData = result.data;
                const fixedUsesLeft = fixUsesLeft(dbData.usesLeft || {});
                const mergedUpgrades = initialState.upgrades.map(init => {
                  const savedUpgrade = dbData.upgrades && dbData.upgrades.find(u => u.id === init.id);
                  const usesLeft = fixedUsesLeft[init.id];
                  return {
                    ...init,
                    ...savedUpgrade,
                    isUnlocked: init.id === 1 || (typeof usesLeft === 'number' && usesLeft > 0)
                  };
                });
                
                const newGameState = {
                  ...initialState,
                  marketCap: dbData.market_cap || 0,
                  clickPower: dbData.click_power || 1,
                  passiveIncome: dbData.passive_income || 0,
                  levelIndex: dbData.level_index || 0,
                  totalClicks: dbData.total_clicks || 0,
                  totalEarned: dbData.total_earned || 0,
                  usesLeft: fixedUsesLeft,
                  upgrades: mergedUpgrades,
                  minMarketCapThisLevel: dbData.minMarketCapThisLevel ?? dbData.market_cap ?? 0,
                  achievements: dbData.achievements || [],
                  settings: dbData.settings || {}
                };
                
                // Betöltjük a játék állapotot
                setGameState(newGameState);
                hasLoadedFromStorage.current = true;
                
                // Elmentjük localStorage-ba a gyors játékélményért
                localStorage.setItem(userStorageKey, JSON.stringify(newGameState));
                
                setIsGameLoaded(true);
              } else {
                // Nincs adatbázis adat, 0-ás értékekkel kezdjük
                const initialState = getInitialState();
                setGameState({
                  ...initialState,
                  marketCap: 0,
                  clickPower: 1,
                  passiveIncome: 0,
                  levelIndex: 0,
                  totalClicks: 0,
                  totalEarned: 0,
                  minMarketCapThisLevel: 0
                });
                hasLoadedFromStorage.current = true;
                setIsGameLoaded(true);
              }
            } catch (error) {
              console.error('Hiba az adatbázis állapot betöltésekor:', error);
              const initialState = getInitialState();
              setGameState({
                ...initialState,
                marketCap: 0,
                clickPower: 1,
                passiveIncome: 0,
                levelIndex: 0,
                totalClicks: 0,
                totalEarned: 0,
                minMarketCapThisLevel: 0
              });
              hasLoadedFromStorage.current = true;
              setIsGameLoaded(true);
            }
          };
          
          loadFromDatabaseAndCache();
        }
        
        hasInitializedRef.current = true;
        lastUserIdRef.current = userId;
        return;
      }
      
      // Ha már inicializálva volt, ellenőrizzük hogy új bejelentkezés történt-e
      const isNewLogin = lastUserIdRef.current !== null && 
                        lastUserIdRef.current !== undefined && 
                        lastUserIdRef.current !== user?.id;
      
      if (isNewLogin) {
        // Új bejelentkezés: nulláról kezdjük
        const initialState = getInitialState();
        setGameState(initialState);
        hasLoadedFromStorage.current = false;
        lastUserIdRef.current = user?.id;
        setIsGameLoaded(true);
        return;
      }
      
      // Ha ugyanaz a user, akkor nem csinálunk semmit
      setIsGameLoaded(true);
    };

    // Add a small delay to ensure everything is properly initialized
    const timer = setTimeout(loadGameState, 100);
    return () => clearTimeout(timer);
  }, [user, setGameState, setIsGameLoaded, hasLoadedFromStorage, lastUserIdRef, hasInitializedRef]);

  // Minden esetben beállítjuk az isGameLoaded-et true-ra, ha nincs user.id
  useEffect(() => {
    if (!user?.id && typeof window !== 'undefined') {
      setIsGameLoaded(true);
    }
  }, [user?.id, setIsGameLoaded]);

  // Frissítsük az isGameLoaded állapotot a bejelentkezés után
  useEffect(() => {
    if (user?.isLoaded && user?.isSignedIn && user?.id) {
      setIsGameLoaded(true);
    }
  }, [user?.isLoaded, user?.isSignedIn, user?.id, setIsGameLoaded]);
};
