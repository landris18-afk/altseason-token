import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseService';

/**
 * GET /api/settings/load - Beállítások betöltése
 * 
 * @param {Request} request - HTTP request
 * @returns {NextResponse} - Response with settings data
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    console.log('🔧 Settings Load API called:', { clerkId });

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Clerk ID is required' },
        { status: 400 }
      );
    }

    // Load settings from Supabase
    const result = await supabaseService.loadSettings(clerkId);

    console.log('🔧 Settings Load API result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Settings loaded successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('🔧 Settings Load API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
