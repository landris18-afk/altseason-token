/**
 * Leaderboard API Route - Ranglista adatok API endpoint
 * 
 * Ez az endpoint kezeli a ranglista adatok lekérdezését
 */

import { NextResponse } from 'next/server';
import supabaseService from '../../../lib/supabaseService';

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


    // Supabase alapú adatok lekérdezése
    const result = await supabaseService.getLeaderboard({
      limit,
      offset,
      platform
    });


    if (!result.success) {
      console.error('Leaderboard API error:', result.error);
      return NextResponse.json(
        { error: 'Database Error', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data, {
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
 * POST - Játékos adatok mentése (most már csak game_states táblázatot használunk)
 * @param {Request} request - HTTP kérés
 * @returns {Response} Válasz
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validáció
    if (!body.userId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Játék állapot mentése a game_states táblázatba
    const gameState = {
      marketCap: body.marketCap || 0,
      clickPower: body.clickPower || 0,
      passiveIncome: body.passiveIncome || 0,
      levelIndex: (body.level || 1) - 1,
      totalClicks: body.totalClicks || 0,
      totalEarned: body.totalEarned || 0,
      upgrades: body.upgrades || [],
      achievements: body.achievements || [],
      settings: body.settings || {},
      platform: body.platform || 'desktop'
    };

    // Supabase alapú mentés
    const result = await supabaseService.saveGameState(body.userId, gameState);

    if (result.success) {
      return NextResponse.json(
        { 
          message: 'Game state saved successfully',
          data: result.data,
          success: true
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { 
          error: 'Save Failed',
          message: result.error || 'Failed to save game state'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Leaderboard POST error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to save game state'
      },
      { status: 500 }
    );
  }
}