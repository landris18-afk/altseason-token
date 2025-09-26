import { useEffect } from 'react';

/**
 * useGamePersistence - Játék adatmegőrzés hook
 * 
 * Ez a hook kezeli a játék adatainak mentését és betöltését.
 * 
 * @param {Object} gameState - Játék állapot
 * @param {Function} setGameState - Játék állapot frissítő
 * @returns {Object} Persistence funkciók
 */
export const useGamePersistence = (gameState, setGameState) => {
  // Játék adatok mentése localStorage-ba
  useEffect(() => {
    if (gameState && Object.keys(gameState).length > 0) {
      localStorage.setItem('bullRunGameState', JSON.stringify(gameState));
    }
  }, [gameState]);

  // Játék adatok betöltése localStorage-ból
  useEffect(() => {
    const savedState = localStorage.getItem('bullRunGameState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setGameState(parsedState);
      } catch (error) {
        console.error('Error loading game state:', error);
      }
    }
  }, [setGameState]);

  return {};
};



