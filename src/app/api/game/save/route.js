import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseService';

export async function POST(request) {
  try {
    console.log('🌐 API /api/game/save called');
    const { userId, gameState } = await request.json();
    console.log('🌐 Request data:', { userId, gameState: !!gameState });
    
    if (!userId) {
      console.log('❌ No userId provided');
      return NextResponse.json({ 
        success: false, 
        error: 'User ID required' 
      }, { status: 400 });
    }

    if (!gameState) {
      console.log('❌ No gameState provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Game state required' 
      }, { status: 400 });
    }

    console.log('💾 Calling supabaseService.saveGameState...');
    // Server-side mentés
    const result = await supabaseService.saveGameState(userId, gameState);
    console.log('💾 Save result:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error saving game state via API:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}