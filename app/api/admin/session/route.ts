import { NextResponse } from 'next/server';
import { getAdminPassword } from '@/lib/admin-auth';
import { setAdminSessionCookie, clearAdminSessionCookie } from '@/lib/admin-server-session';

/** 管理 API 用 httpOnly Cookie（ADMIN_API_SECRET はレスポンスに含めない） */
export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== 'string' || password !== getAdminPassword()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  await setAdminSessionCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
