import { useUser } from '@clerk/nextjs';

export const useClerkAuth = () => {
  let user, isLoaded, isSignedIn;
  try {
    const clerkData = useUser();
    user = clerkData.user;
    isLoaded = clerkData.isLoaded;
    isSignedIn = clerkData.isSignedIn;
  } catch (error) {
    console.error('Clerk error:', error);
    user = null;
    isLoaded = true;
    isSignedIn = false;
  }
  
  return { user, isLoaded, isSignedIn };
};

