import { useUser } from '@clerk/nextjs';

/**
 * useUserState - Clerk user state kezelő hook
 * 
 * Ez a hook kezeli a Clerk user állapotát és biztosítja a biztonságos
 * hozzáférést a user adatokhoz, még akkor is, ha a Clerk nem elérhető.
 * 
 * @returns {Object} User állapot és információk
 */
export const useUserState = () => {
  // Clerk user hook - try-catch wrapper
  let user, isLoaded, isSignedIn;
  try {
    const clerkData = useUser();
    user = clerkData.user;
    isLoaded = clerkData.isLoaded;
    isSignedIn = clerkData.isSignedIn;
  } catch (error) {
    console.error('Clerk error in useUserState:', error);
    user = null;
    isLoaded = true;
    isSignedIn = false;
  }

  return {
    user,
    isLoaded,
    isSignedIn,
    userId: user?.id || null
  };
};
