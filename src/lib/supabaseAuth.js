/**
 * Supabase Authentication szolgáltatás
 * 
 * Felhasználó kezelés, bejelentkezés, regisztráció
 */

import { supabase, supabaseAdmin } from './supabase';

class SupabaseAuth {
  /**
   * Supabase konfiguráció ellenőrzése
   */
  isSupabaseConfigured() {
    // Ellenőrizzük mind a client, mind a server oldalon
    const hasUrl = !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
    const hasKey = !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);
    const hasClient = !!supabase;
    // supabaseAdmin csak server-side elérhető, ezért nem ellenőrizzük client-side
    return hasUrl && hasKey && hasClient;
  }

  /**
   * Bejelentkezett felhasználó ellenőrzése
   */
  isUserLoggedIn(clerkId) {
    return !!clerkId;
  }

  /**
   * Felhasználó létrehozása vagy frissítése
   */
  async upsertUser(clerkUser) {
    if (!this.isSupabaseConfigured() || !this.isUserLoggedIn(clerkUser.id)) {
      console.log('Supabase not configured or user not logged in, using fallback');
      return { success: true, data: { id: clerkUser.id, clerk_id: clerkUser.id } };
    }

    try {
      // Ha client-side vagyunk, API endpoint-ot használunk
      if (typeof window !== 'undefined') {
        console.log('Client-side upsertUser via API endpoint');

        const response = await fetch('/api/user/upsert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clerkUser })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to upsert user');
        }

        return result;
      }

      // Server-side: csak a clerk_id-t és a nevet mentjük
      console.log('🖥️ Server-side upsertUser with clerkUser:', clerkUser);
      const userData = {
        clerk_id: clerkUser.id,
        updated_at: new Date().toISOString()
      };

      // Ha van teljes user objektum (server-side eset), akkor a nevet mentjük
      if (clerkUser.firstName || clerkUser.lastName) {
        userData.first_name = clerkUser.firstName;
        userData.last_name = clerkUser.lastName;
        console.log('👤 Adding name to userData:', { first_name: clerkUser.firstName, last_name: clerkUser.lastName });
      }

      console.log('👤 Upserting user data:', userData);
      const { data, error } = await supabaseAdmin
        .from('users')
        .upsert(userData, {
          onConflict: 'clerk_id'
        })
        .select()
        .single();

      console.log('👤 User upsert result:', { data, error });

      if (error) throw error;
      console.log('✅ User upserted successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error upserting user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Felhasználó lekérdezése Clerk ID alapján
   */
  async getUserByClerkId(clerkId) {
    if (!this.isSupabaseConfigured() || !this.isUserLoggedIn(clerkId)) {
      return { success: true, data: { id: clerkId, clerk_id: clerkId } };
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      return { success: true, data };
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error: error.message };
    }
  }
}

// Singleton instance
const supabaseAuth = new SupabaseAuth();

export default supabaseAuth;
