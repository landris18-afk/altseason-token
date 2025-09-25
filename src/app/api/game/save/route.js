import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Game Save API endpoint
 * 
 * Ez az endpoint kezeli a játékállapot mentését:
 * - Clerk user ID alapú mentés
 * - Játékállapot validálás
 * - Jövőben: adatbázis mentés
 * 
 * @param {Request} request - HTTP kérés
 * @returns {Response} Mentés eredménye
 */
export async function POST(request) {
  try {
    // Clerk authentication ellenőrzés
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { gameState } = body;
    
    // Játékállapot validálás
    if (!gameState || typeof gameState !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid game state' },
        { status: 400 }
      );
    }
    
    // Jelenleg csak logoljuk, jövőben adatbázisba mentjük
    
    return NextResponse.json({
      success: true,
      message: 'Game state saved successfully',
      userId: userId
    });
    
  } catch (error) {
    console.error('Game save error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Game Load API endpoint
 * 
 * @param {Request} request - HTTP kérés
 * @returns {Response} Játékállapot
 */
export async function GET(request) {
  try {
    // Clerk authentication ellenőrzés
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Jelenleg üres válasz, jövőben adatbázisból töltjük
    return NextResponse.json({
      success: true,
      data: null,
      message: 'No saved game state found'
    });
    
  } catch (error) {
    console.error('Game load error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

