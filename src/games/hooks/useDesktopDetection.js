import { useState, useEffect } from 'react';

/**
 * useDesktopDetection - Desktop észlelés hook
 * 
 * Ez a hook észleli, hogy a felhasználó desktop vagy mobile eszközt használ:
 * - Kezdeti ellenőrzés
 * - Window resize esemény figyelése
 * - 768px breakpoint alapján
 * 
 * @returns {boolean} Desktop nézet flag
 */
export const useDesktopDetection = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Kezdeti ellenőrzés
    checkIsDesktop();

    // Window resize esemény figyelése
    window.addEventListener('resize', checkIsDesktop);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsDesktop);
    };
  }, []);

  return isDesktop;
};

