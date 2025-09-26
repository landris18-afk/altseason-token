import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getInitialState } from '../data/gameData';
import { fixUsesLeft } from '../utils/gameUtils';
import { usePlayerSave } from './usePlayerSave';
import supabaseService from '../../lib/supabaseService';

/**
 * useGameState - Játék állapot kezelő hook
 * 
 * Ez a hook kezeli a játék teljes állapotát:
 * - Kezdő állapot betöltése
 * - Mentett állapot visszaállítása
 * - Állapot mentése localStorage-ba
 * - Játék reset funkció
 * 
 * @returns {Object} Játék állapot és kezelő funkciók
 */
export const useGameState = () => {
  // Clerk user hook - try-catch wrapper
  let user, isLoaded, isSignedIn;
  try {
    const clerkData = useUser();
    user = clerkData.user;
    isLoaded = clerkData.isLoaded;
    isSignedIn = clerkData.isSignedIn;
  } catch (error) {
    console.error('Clerk error in useGameState:', error);
    user = null;
    isLoaded = true;
    isSignedIn = false;
  }

  // Player save hook
  const { autoSavePlayer } = usePlayerSave();
  
  // Játék állapot inicializálása
  const [gameState, setGameState] = useState(() => {
    const initialState = getInitialState();
    return initialState;
  });

  // Állapot változók
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [subThousandAccumulator, setSubThousandAccumulator] = useState(0);
  const lastReqLevelRef = useRef({});
  const hasLoadedFromStorage = useRef(false);
  const saveTimeoutRef = useRef(null);
  const lastUserIdRef = useRef(null); // Utolsó bejelentkezett user ID követése
  const hasInitializedRef = useRef(false); // Kezdeti betöltés jelzője

  // Mentett állapot betöltése
  useEffect(() => {
    const loadGameState = () => {
      if (typeof window !== 'undefined') {
        const userId = user?.id;
        
        // Mindig betöltjük az adatokat (nem csak egyszer)
        // if (!hasInitializedRef.current) {
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
                
                // Csak most jelöljük betöltöttnek, miután az adatok beállításra kerültek
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
              
              // Csak most jelöljük betöltöttnek, miután az adatok beállításra kerültek
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
                  
                  
                  // Csak most jelöljük betöltöttnek, miután az adatok beállításra kerültek
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
                  
                  // Csak most jelöljük betöltöttnek, miután az adatok beállításra kerültek
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
                
                // Csak most jelöljük betöltöttnek, miután az adatok beállításra kerültek
                setIsGameLoaded(true);
              }
            };
            
            loadFromDatabaseAndCache();
          }
          
          hasInitializedRef.current = true;
          lastUserIdRef.current = userId;
          return;
        // }
        
        // Ha már inicializálva volt, ellenőrizzük hogy új bejelentkezés történt-e
        const isNewLogin = lastUserIdRef.current !== null && 
                          lastUserIdRef.current !== undefined && 
                          lastUserIdRef.current !== userId;
        
        if (isNewLogin) {
          // Új bejelentkezés: nulláról kezdjük
          const initialState = getInitialState();
          setGameState(initialState);
          hasLoadedFromStorage.current = false;
          lastUserIdRef.current = userId;
          setIsGameLoaded(true);
          return;
        }
        
        // Ha ugyanaz a user, akkor nem csinálunk semmit
        setIsGameLoaded(true);
      } else {
        // Ha nincs user.id, akkor is beállítjuk az isGameLoaded-et true-ra
        setIsGameLoaded(true);
      }
    };

    // Add a small delay to ensure everything is properly initialized
    const timer = setTimeout(loadGameState, 100);
    return () => clearTimeout(timer);
  }, [user]);

  // Minden esetben beállítjuk az isGameLoaded-et true-ra, ha nincs user.id
  useEffect(() => {
    if (!user?.id && typeof window !== 'undefined') {
      setIsGameLoaded(true);
    }
  }, [user?.id]);

  // Ez a useEffect már nem szükséges, mert a fenti useEffect kezeli a bejelentkezés utáni állapotot

  // Frissítsük az isGameLoaded állapotot a bejelentkezés után
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id && gameState.marketCap !== undefined) {
      setIsGameLoaded(true);
    }
  }, [isLoaded, isSignedIn, user?.id, gameState.marketCap]);

  // Frissítsük az isGameLoaded állapotot, ha a gameState változik
  useEffect(() => {
    if (gameState && gameState.marketCap !== undefined) {
      setIsGameLoaded(true);
    }
  }, [gameState]);

  // Állapot mentése localStorage-ba (mindenkinek a gyors játékélményért)
  useEffect(() => {
    if (isGameLoaded && hasLoadedFromStorage.current) {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for saving
      saveTimeoutRef.current = setTimeout(() => {
        const userId = user?.id;
        const storageKey = userId ? `bullRunGameState_${userId}` : 'bullRunGameState_v3';
        localStorage.setItem(storageKey, JSON.stringify(gameState));
        
      }, 500); // 500ms debounce
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState, isGameLoaded, user?.id]);

  // Automatikus mentés eltávolítva - most csak trigger alapú mentés van
  // (pump gomb, fejlesztés vásárlás, level up)

  // Reset loading state
  const [isResetting, setIsResetting] = useState(false);

  // Játék reset funkció
  const confirmReset = async (onResetComplete) => {
    const userId = user?.id;
    const storageKey = userId ? `bullRunGameState_${userId}` : 'bullRunGameState_v3';
    
    // Set loading state
    setIsResetting(true);
    
    // Clear save timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Bejelentkezett felhasználó: adatbázisból is töröljük a játék adatokat
    if (userId) {
      try {
        // Töröljük a játék állapotot az adatbázisból
        const deleteResult = await supabaseService.deleteGameState(userId);
        if (deleteResult.success) {
        } else {
          console.error('❌ Failed to delete game state from database:', deleteResult.error);
          // Ha nem sikerült törölni, akkor is folytatjuk
        }
        
        // A ranglista adatok automatikusan törlődnek a game_states törlésekor
      } catch (error) {
        console.error('❌ Error deleting data from database:', error);
        // Ha hiba van, akkor is folytatjuk
      }
    }
    
    // localStorage törlése
    localStorage.removeItem(storageKey);
    
    // Reset the loaded flag
    hasLoadedFromStorage.current = false;
    const initialState = getInitialState();
    setGameState({
      ...initialState,
      levelIndex: 0,
      marketCap: 0,
      totalClicks: 0,
      clickPower: 1,
      passiveIncome: 0,
      solanaBlessingLevel: 0,
      hasPremiumUpgrade: false,
      usesLeft: {
        1: Infinity, // Diamond Hands: végtelen
        2: 0, // Bull's Strength: lezárva
        3: 0, // Moon Shot: lezárva
        4: 0, // Shill Army: lezárva
        5: 0, // FOMO Generator: lezárva
        6: 0 // Whale Magnet: lezárva
      },
      upgrades: initialState.upgrades.map(upgrade => ({
        ...upgrade,
        level: 0,
        isUnlocked: upgrade.id === 1 // Csak a Diamond Hands legyen feloldva
      })),
      minMarketCapThisLevel: 0
    });
    
    // Reseteljük a lastReqLevelRef-et is
    Object.keys(lastReqLevelRef.current).forEach(key => {
      lastReqLevelRef.current[key] = undefined;
    });
    
    // Clear loading state
    setIsResetting(false);
    
    // Visszahívás a reset befejezésére - azonnal átirányítás
    if (onResetComplete) {
      onResetComplete(); // A ModalManager kezeli a skipSave-t
    }
  };

  // localStorage törlése minden felhasználónak (játék bezárásakor)
  const clearUserCache = useCallback(async (skipSave = false) => {
    if (user?.id) {
      // Bejelentkezett felhasználó: először mentjük az aktuális állapotot az adatbázisba (kivéve ha skipSave = true)
      if (!skipSave) {
        try {
          // Azonnal mentjük, nem várunk
          await autoSavePlayer(gameState);
        } catch (error) {
          console.error('Error saving game state to database:', error);
        }
      }
      
      // Majd töröljük a cache-t
      const userStorageKey = `bullRunGameState_${user.id}`;
      localStorage.removeItem(userStorageKey);
    } else {
      // Névtelen felhasználó cache törlése
      localStorage.removeItem('bullRunGameState_v3');
    }
  }, [user?.id, gameState, autoSavePlayer]);

  return {
    gameState,
    setGameState,
    isLoaded: isGameLoaded,
    isGameLoaded,
    subThousandAccumulator,
    setSubThousandAccumulator,
    lastReqLevelRef,
    confirmReset,
    clearUserCache,
    isResetting,
    isDesktop: typeof window !== 'undefined' && window.innerWidth >= 768
  };
};

