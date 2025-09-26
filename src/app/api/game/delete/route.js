import { NextResponse } from 'next/server';
import supabaseService from '@/lib/supabaseService';

export async function DELETE(request) {
  try {
    const { clerkId } = await request.json();
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Clerk ID is required' },
        { status: 400 }
      );
    }

    console.log('🗑️ API: Deleting game state for user:', clerkId);
    
    // Server-side törlés
    const result = await supabaseService.deleteGameState(clerkId);
    
    if (result.success) {
      console.log('✅ Game state deleted successfully');
      return NextResponse.json({ success: true });
    } else {
      console.error('❌ Failed to delete game state:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ API Error deleting game state:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
