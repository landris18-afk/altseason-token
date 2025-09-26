import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseService';

export async function POST(request) {
  try {
    const { userId, gameState } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID required' 
      }, { status: 400 });
    }

    if (!gameState) {
      return NextResponse.json({ 
        success: false, 
        error: 'Game state required' 
      }, { status: 400 });
    }

    // Server-side mentés
    const result = await supabaseService.saveGameState(userId, gameState);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving game state via API:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}