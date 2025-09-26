import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseService';

/**
 * POST /api/settings/save - Beállítások mentése
 * 
 * @param {Request} request - HTTP request
 * @returns {NextResponse} - Response with save result
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { clerkId, settings } = body;

    console.log('🔧 Settings Save API called:', { clerkId, settings });

    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Clerk ID is required' },
        { status: 400 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // Save settings to Supabase
    const result = await supabaseService.saveSettings(clerkId, settings);

    console.log('🔧 Settings Save API result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Settings saved successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('🔧 Settings Save API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
