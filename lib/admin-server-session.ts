import { createHmac, createHash, randomUUID, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'hotel_pg_admin_sess';

/** Cookie 署名用。ADMIN_API_SECRET が無い場合は管理パスワード由来のサーバー専用キー（SaaS 呼び出しとは別）。 */
export function sessionSigningKey(): string {
  const fromEnv = process.env.ADMIN_API_SECRET?.trim();
  if (fromEnv) return fromEnv;
  const pw =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim() ??
    process.env.VITE_ADMIN_PASSWORD?.trim() ??
    'admin';
  return createHash('sha256').update(`hotel-pg-admin-session|${pw}`).digest('hex');
}

export function signAdminSessionPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export async function setAdminSessionCookie(): Promise<boolean> {
  const secret = sessionSigningKey();
  const payload = randomUUID();
  const sig = signAdminSessionPayload(payload, secret);
  const token = `${payload}.${sig}`;
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function clearAdminSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminSessionValid(): Promise<boolean> {
  const secret = sessionSigningKey();
  const jar = await cookies();
  const raw = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw || !raw.includes('.')) return false;
  const i = raw.lastIndexOf('.');
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  if (!payload || !sig) return false;
  const expected = signAdminSessionPayload(payload, secret);
  try {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
