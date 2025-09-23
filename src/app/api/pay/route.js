// src/app/api/pay/route.js
import { NextResponse } from 'next/server';
import { Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';

export async function POST(request) {
  try {
    const { amount, reference } = await request.json();
    
    // Generate a new keypair for this transaction
    const keypair = Keypair.generate();
    
    // Create the payment URL
    const paymentUrl = encodeURL({
      recipient: new PublicKey(keypair.publicKey),
      amount: amount,
      reference: new PublicKey(reference),
      label: 'Altseason 2025',
      message: 'Premium Upgrade'
    });

    return NextResponse.json({ 
      url: paymentUrl.toString(),
      account: keypair.publicKey.toString()
    });
  } catch (error) {
    console.error('Payment URL generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate payment URL' },
      { status: 500 }
    );
  }
}