import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseService';

export async function GET(request) {
  try {
    // Get user ID from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID required' 
      }, { status: 400 });
    }

    // Server-side betöltés
    const result = await supabaseService.loadGameState(userId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error loading game state:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
