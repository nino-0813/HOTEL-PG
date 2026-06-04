import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * サーバー専用 Supabase クライアント（service_role キー）。
 * ブラウザには絶対に出さない。受付期間など、サイトが SaaS の DB に
 * 直接読み書きしたい用途に使う（reservations 等の機微テーブルには触れない）。
 */

function stripBom(s: string): string {
  return s.replace(/^﻿/, '');
}

function envValue(name: string): string | null {
  const raw = process.env[name];
  if (raw == null) return null;
  const s = stripBom(String(raw)).trim();
  return s || null;
}

/** URL は SUPABASE_URL を優先（無ければ NEXT_PUBLIC_SUPABASE_URL でも可） */
function serverSupabaseUrl(): string | null {
  return envValue('SUPABASE_URL') ?? envValue('NEXT_PUBLIC_SUPABASE_URL');
}

function serviceRoleKey(): string | null {
  return envValue('SUPABASE_SERVICE_ROLE_KEY');
}

export function isServerSupabaseConfigured(): boolean {
  return Boolean(serverSupabaseUrl() && serviceRoleKey());
}

/** 未設定なら null。呼び出し側で 503 などに分岐する */
export function getServerSupabase(): SupabaseClient | null {
  const url = serverSupabaseUrl();
  const key = serviceRoleKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
