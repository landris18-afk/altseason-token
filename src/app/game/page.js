'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useBullRunGame } from '../../games/hooks/useBullRunGame';
import LoadingScreen from './components/LoadingScreen';
import LeaderboardWrapper from './components/LeaderboardWrapper';
import BullRunGameWrapper from '../../games/components/containers/BullRunGameWrapper';

const GamePage = () => {
  // Client-side rendering ellenőrzés
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [showGame, setShowGame] = useState(false);
  
  // Debug: showGame állapot változás
  useEffect(() => {
    console.log('🎮 showGame state changed:', showGame);
  }, [showGame]);
  
  
  // Clerk handshake URL paraméter eltávolítása
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('__clerk_handshake')) {
      const url = new URL(window.location);
      url.searchParams.delete('__clerk_handshake');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // TEST GAME gomb kezelése - közvetlenül a játékot nyitja meg
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'START_GAME_DIRECT') {
        console.log('🎮 Received START_GAME_DIRECT message, setting showGame to true');
        setShowGame(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Clerk user hook - try-catch wrapper
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

  
  // Játék hook
  const gameProps = useBullRunGame();
  
  // Loading state a mentéshez
  const [isSaving, setIsSaving] = useState(false);
  
  // Player név Clerk user-ből - konzisztens név generálás
  const playerName = user ? (user.firstName || user.username || 'Player') : '';
  
  // Ha még nem vagyunk client-side, várjunk
  if (!isClient) {
    return <LoadingScreen />;
  }

  // Ha a showGame true, jelenítsük meg a játékot
  if (showGame) {
    return (
        <BullRunGameWrapper
          {...gameProps}
          isLoaded={gameProps.isLoaded}
          subThousandAccumulator={gameProps.subThousandAccumulator}
          confirmReset={gameProps.confirmReset}
          unlockSound={gameProps.unlockSound}
          isResetModalOpen={gameProps.isResetModalOpen}
          setIsResetModalOpen={gameProps.setIsResetModalOpen}
          isLevelUpModalOpen={gameProps.isLevelUpModalOpen}
          setIsLevelUpModalOpen={gameProps.setIsLevelUpModalOpen}
          isSolanaModalOpen={gameProps.isSolanaModalOpen}
          setIsSolanaModalOpen={gameProps.setIsSolanaModalOpen}
          isRulesModalOpen={gameProps.isRulesModalOpen}
          setIsRulesModalOpen={gameProps.setIsRulesModalOpen}
          handlePump={gameProps.handlePump}
          handleUpgrade={gameProps.handleUpgrade}
          activatePremiumUpgrade={gameProps.activatePremiumUpgrade}
          isDesktop={gameProps.isDesktop}
          muted={gameProps.muted}
          setMuted={gameProps.setMuted}
          marketCap={gameProps.marketCap}
          clickPower={gameProps.clickPower}
          passiveIncome={gameProps.passiveIncome}
          upgrades={gameProps.upgrades}
          levelIndex={gameProps.levelIndex}
          solanaBlessingLevel={gameProps.solanaBlessingLevel}
          hasPremiumUpgrade={gameProps.hasPremiumUpgrade}
          current={gameProps.current}
          next={gameProps.next}
          safeMarketCap={gameProps.safeMarketCap}
          progress={gameProps.progress}
          currentTextColor={gameProps.currentTextColor}
          currentBarFrom={gameProps.currentBarFrom}
          currentBarTo={gameProps.currentBarTo}
          twitterUrl={gameProps.twitterUrl}
          showHeader={false}
          isSaving={isSaving}
          onBackToLeaderboard={async (skipSave = false) => {
            // Ha már ment, ne csináljunk semmit
            if (isSaving) return;
            
            // Loading state bekapcsolása
            setIsSaving(true);
            
            try {
              // Először mentjük az adatokat (kivéve ha skipSave = true)
              if (gameProps.clearUserCache) {
                await gameProps.clearUserCache(skipSave);
              }
              
              // Visszalépünk a ranglistára
              setShowGame(false);
              
            } catch (error) {
              console.error('Error in onBackToLeaderboard:', error);
            } finally {
              // Loading state kikapcsolása
              setIsSaving(false);
            }
          }}
        />
      );
    }
    
  // Alapértelmezetten a ranglista oldalt jelenítsük meg
  return (
    <>
      <LeaderboardWrapper
        onStartGame={() => setShowGame(true)}
        playerName={playerName}
        playerStats={gameProps ? {
          marketCap: gameProps.marketCap,
          levelIndex: gameProps.levelIndex,
          solanaBlessingLevel: gameProps.solanaBlessingLevel,
          clickPower: gameProps.clickPower,
          passiveIncome: gameProps.passiveIncome
        } : null}
        onClose={() => window.location.href = '/'}
      />
    </>
  );
};

export default GamePage;