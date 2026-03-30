import { createClient } from '@supabase/supabase-js';

// Next.js: NEXT_PUBLIC_*, Vite互換: VITE_*
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const isSupabaseConfigured = (): boolean => !!(url && anonKey);
