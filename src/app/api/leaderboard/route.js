/**
 * Leaderboard API Route - Ranglista adatok API endpoint
 * 
 * Ez az endpoint kezeli a ranglista adatok lekérdezését
 */

import { NextResponse } from 'next/server';

// Valós adatok tárolása memóriában (ideiglenesen, amíg nincs valódi adatbázis)
let leaderboardData = [];

/**
 * GET - Ranglista adatok lekérdezése
 * @param {Request} request - HTTP kérés
 * @returns {Response} Ranglista adatok
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query paraméterek kinyerése
    const limit = parseInt(searchParams.get('limit')) || 100;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const sortBy = searchParams.get('sortBy') || 'marketCap';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const platform = searchParams.get('platform') || 'all';

    // Adatok szűrése és rendezése
    let players = [...leaderboardData];

    // Platform szűrés
    if (platform !== 'all') {
      players = players.filter(player => player.platform === platform);
    }

    // Rendezés
    players.sort((a, b) => {
      const aValue = a[sortBy] || 0;
      const bValue = b[sortBy] || 0;
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    // Rang hozzáadása
    players = players.map((player, index) => ({
      ...player,
      rank: offset + index + 1
    }));

    // Limit és offset alkalmazása
    const totalPlayers = players.length;
    const paginatedPlayers = players.slice(offset, offset + limit);

    // Válasz összeállítása
    const response = {
      players: paginatedPlayers,
      totalPlayers,
      lastUpdated: new Date().toISOString(),
      query: {
        limit,
        offset,
        sortBy,
        sortOrder,
        platform
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30', // 30 másodperc cache
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to fetch leaderboard data'
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Új játékos hozzáadása a ranglistához
 * @param {Request} request - HTTP kérés
 * @returns {Response} Válasz
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validáció
    if (!body.name || !body.marketCap) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Name and marketCap are required' },
        { status: 400 }
      );
    }

    // Új játékos létrehozása
    const newPlayer = {
      id: body.userId || Date.now().toString(),
      name: body.name,
      marketCap: body.marketCap,
      clickPower: body.clickPower || 0,
      passiveIncome: body.passiveIncome || 0,
      level: body.level || 1,
      platform: body.platform || 'desktop',
      lastActive: new Date(),
      isCurrentUser: body.isCurrentUser || false,
      userId: body.userId || null
    };

    // Meglévő játékos keresése userId alapján
    const existingPlayerIndex = leaderboardData.findIndex(player => player.userId === body.userId);
    
    if (existingPlayerIndex >= 0) {
      // Meglévő játékos frissítése
      leaderboardData[existingPlayerIndex] = { ...leaderboardData[existingPlayerIndex], ...newPlayer };
      console.log('Updated existing player:', newPlayer.name);
    } else {
      // Új játékos hozzáadása
      leaderboardData.push(newPlayer);
      console.log('Added new player:', newPlayer.name);
    }

    // Rendezés marketCap szerint csökkenő sorrendben
    leaderboardData.sort((a, b) => b.marketCap - a.marketCap);

    // Top 100 megtartása (memória optimalizálás)
    if (leaderboardData.length > 100) {
      leaderboardData = leaderboardData.slice(0, 100);
    }

    return NextResponse.json(
      { 
        message: 'Player saved successfully',
        player: newPlayer,
        totalPlayers: leaderboardData.length
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Leaderboard POST error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to save player to leaderboard'
      },
      { status: 500 }
    );
  }
}