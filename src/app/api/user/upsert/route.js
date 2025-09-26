import { NextResponse } from 'next/server';
import supabaseService from '../../../../lib/supabaseService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { clerkUser } = body;

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json(
        { success: false, error: 'Missing clerkUser data' },
        { status: 400 }
      );
    }

    console.log('API: upsertUser called with:', {
      clerkId: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    });

    const result = await supabaseService.upsertUser(clerkUser);

    console.log('API: upsertUser result:', result);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API: Error in upsertUser:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
