/**
 * Leaderboard Rank API Route - Játékos rang számítás API endpoint
 * 
 * Ez az endpoint kezeli a játékos rangjának kiszámítását
 */

import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseService';

// Mock adatok (ugyanazok mint a fő ranglistában)
const mockPlayers = [
  {
    id: '1',
    name: 'CryptoKing',
    marketCap: 1250000,
    clickPower: 50000,
    passiveIncome: 25000,
    level: 45,
    platform: 'desktop',
    lastActive: new Date('2024-01-15T10:30:00Z'),
    isCurrentUser: false
  },
  {
    id: '2',
    name: 'MoonRocket',
    marketCap: 980000,
    clickPower: 42000,
    passiveIncome: 18000,
    level: 38,
    platform: 'mobile',
    lastActive: new Date('2024-01-15T09:45:00Z'),
    isCurrentUser: false
  },
  {
    id: '3',
    name: 'BullMaster',
    marketCap: 750000,
    clickPower: 35000,
    passiveIncome: 15000,
    level: 32,
    platform: 'desktop',
    lastActive: new Date('2024-01-15T08:20:00Z'),
    isCurrentUser: false
  },
  {
    id: '4',
    name: 'PumpChampion',
    marketCap: 620000,
    clickPower: 28000,
    passiveIncome: 12000,
    level: 28,
    platform: 'mobile',
    lastActive: new Date('2024-01-15T07:15:00Z'),
    isCurrentUser: false
  },
  {
    id: '5',
    name: 'DiamondHands',
    marketCap: 480000,
    clickPower: 22000,
    passiveIncome: 9500,
    level: 24,
    platform: 'desktop',
    lastActive: new Date('2024-01-15T06:30:00Z'),
    isCurrentUser: false
  }
];

/**
 * GET - Játékos rangjának kiszámítása
 * @param {Request} request - HTTP kérés
 * @returns {Response} Rang adatok
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query paraméterek kinyerése
    const marketCap = parseFloat(searchParams.get('marketCap'));
    const platform = searchParams.get('platform') || 'all';

    console.log('🔢 Rank API called:', { marketCap, platform });

    // Validáció
    if (isNaN(marketCap) || marketCap < 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Valid marketCap is required' },
        { status: 400 }
      );
    }

    // Supabase-ból valódi adatok betöltése
    let players = [];
    let source = 'mock';
    
    try {
      const leaderboardResult = await supabaseService.getLeaderboard();
      if (leaderboardResult.success && leaderboardResult.data) {
        players = leaderboardResult.data;
        source = 'database';
        console.log('📊 Using database data for rank calculation:', players.length, 'players');
      } else {
        console.log('⚠️ Database failed, using mock data');
        players = [...mockPlayers];
      }
    } catch (error) {
      console.error('❌ Database error, using mock data:', error);
      players = [...mockPlayers];
    }

    // Platform szűrés
    if (platform !== 'all') {
      players = players.filter(player => player.platform === platform);
    }
    
    // Rendezés Market Cap szerint csökkenő sorrendben
    players.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));

    // Rang számítás
    let rank = 1;
    for (const player of players) {
      // Ha a játékos marketCap-je kisebb vagy egyenlő, akkor rosszabb rangot kap
      if (marketCap <= (player.marketCap || 0)) {
        rank++;
      } else {
        // Ha nagyobb, akkor jobb rangot kap, megállunk
        break;
      }
    }

    // Top pozíciók ellenőrzése
    const isTop3 = rank <= 3;
    const isTop10 = rank <= 10;
    const isTop50 = rank <= 50;
    const isTop100 = rank <= 100;

    // Válasz összeállítása
    const response = {
      rank,
      marketCap,
      platform,
      isTop3,
      isTop10,
      isTop50,
      isTop100,
      totalPlayers: players.length,
      percentile: players.length > 0 ? Math.round(((players.length - rank + 1) / players.length) * 100) : 0,
      lastUpdated: new Date().toISOString(),
      source
    };

    console.log('📊 Rank calculated:', response);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60', // 1 perc cache
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('❌ Rank API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to calculate player rank'
      },
      { status: 500 }
    );
  }
}


