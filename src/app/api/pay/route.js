// src/app/api/pay/route.js
import { NextResponse } from 'next/server';
import { Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@