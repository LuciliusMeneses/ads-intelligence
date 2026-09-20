/**
 * ADS INTELLIGENCE — Supabase Client Architecture
 * Strictly depends on environment variables. Throws explicit errors if mandatory credentials are missing.
 * ZERO hardcoded fallbacks or secrets in source code.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseUrl(): string {
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    throw new Error('[Supabase Config Error] SUPABASE_URL não configurada no ambiente.');
  }
  return supabaseUrl;
}

export function getSupabaseAnonKey(): string {
  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    throw new Error('[Supabase Config Error] SUPABASE_ANON_KEY não configurada no ambiente.');
  }
  return supabaseAnonKey;
}

export function getSupabaseServiceRoleKey(): string {
  if (!supabaseServiceKey || supabaseServiceKey.trim() === '') {
    throw new Error('[Supabase Config Error] SUPABASE_SERVICE_ROLE_KEY não configurada no ambiente.');
  }
  return supabaseServiceKey;
}

/**
 * Public / Client-Side Supabase Client (uses Anon Key)
 */
export function createPublicSupabaseClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

/**
 * Admin / Service Role Supabase Client (uses Service Role Key)
 * CRITICAL: Restricted strictly to server/admin contexts.
 */
export function createAdminSupabaseClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

/**
 * Creates a scoped Supabase client for a specific user session or JWT token.
 */
export function createScopedSupabaseClient(accessToken?: string): SupabaseClient {
  if (!accessToken) return createPublicSupabaseClient();
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}
