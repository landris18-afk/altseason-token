// src/app/api/transaction/route.js

import { NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';

// --- FONTOS BEÁLLÍTÁSOK ---
// Ide írd be azt a Solana címet, ahova a fizetéseket szeretnéd kapni!
const SHOP_WALLET_ADDRESS = '3VpyCTVChpdUHGHnRgDdo29MggEoAoTHp5B27RNFdnZx'; 

// GET kérés kezelése (a Solana Pay specifikáció része)
export async function GET(req) {
  const label = "Altseason 2025 - Premium Upgrade";
  const icon = "https://assbull.meme/images/bika-karakter.png"; // A te logód URL-je

  return NextResponse.json({
    label,
    icon,
  });
}

// POST kérés kezelése (ez hozza létre a tényleges fizetési kérelmet)
export async function POST(req) {
  try {
    // Kiolvassuk a jelenlegi szintet a kérésből
    const { currentLevel } = await req.json();
    
    // Számoljuk ki az árát a jelenlegi szint alapján
    const basePrice = 0.05; // Alap ár
    const priceMultiplier = Math.pow(1.5, currentLevel); // 50% növekedés minden szinten
    const transactionAmount = basePrice * priceMultiplier;

    // Minden fizetéshez egyedi referencia-azonosítót generálunk
    const reference = new Keypair().publicKey.toBase58();

    const body = {
      account: SHOP_WALLET_ADDRESS,
      reference: reference,
      amount: transactionAmount,
    };

    return NextResponse.json(body);

  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
