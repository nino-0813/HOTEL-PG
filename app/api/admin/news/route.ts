import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/admin-server-session';
import { parseNewsInput } from '@/lib/news';
import { listNews, NewsStoreError, saveNews, useLocalNews } from '@/lib/news-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function failure(e: unknown) {
  return NextResponse.json({ message: e instanceof Error ? e.message : '保存に失敗しました。' }, { status: e instanceof NewsStoreError ? e.status : 500 });
}
export async function GET() {
  if (!(await isAdminSessionValid())) return NextResponse.json({ message: '管理画面にログインしてください。' }, { status: 401 });
  try { return NextResponse.json({ articles: await listNews(false), local: useLocalNews() }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch (e) { return failure(e); }
}
export async function POST(req: Request) {
  if (!(await isAdminSessionValid())) return NextResponse.json({ message: '管理画面にログインしてください。' }, { status: 401 });
  const origin = req.headers.get('origin');
  if (!origin || origin !== new URL(req.url).origin) return NextResponse.json({ message: '送信元を確認できません。' }, { status: 403 });
  if (Number(req.headers.get('content-length') ?? 0) > 1100000) return NextResponse.json({ message: '画像のサイズが大きすぎます。' }, { status: 413 });
  let raw: Record<string, unknown>;
  let input;
  try {
    const text = await req.text();
    if (text.length > 1100000) throw new Error('画像のサイズが大きすぎます。');
    raw = JSON.parse(text);
    input = parseNewsInput(raw);
    if (raw.id !== undefined && (typeof raw.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(raw.id) || typeof raw.updatedAt !== 'string')) throw new Error('記事IDまたは更新日時が不正です。');
  } catch (e) { return NextResponse.json({ message: e instanceof Error ? e.message : '入力を確認してください。' }, { status: 400 }); }
  try {
    const article = await saveNews(input, raw.id as string | undefined, raw.updatedAt as string | undefined);
    return NextResponse.json({ article });
  } catch (e) { return failure(e); }
}
