/**
 * Supabase konfiguráció
 * 
 * Ez a fájl kezeli a Supabase kapcsolatot
 */

import { createClient } from '@supabase/supabase-js';

// Supabase konfiguráció
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ellenőrizzük, hogy a kulcsok megvannak-e
console.log('Supabase config check:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Present' : 'Missing');
console.log('Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase kulcsok hiányoznak. Ellenőrizd a .env.local fájlt.');
}

// Supabase kliens létrehozása (csak ha vannak kulcsok)
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) : null;

// Server-side Supabase kliens (service role key-kel)
export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY ? createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null;

export default supabase;
