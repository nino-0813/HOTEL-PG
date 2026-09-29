import { NextResponse } from 'next/server';
import { listNews } from '@/lib/news-store';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { return NextResponse.json({ articles: await listNews() }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ message: 'お知らせを読み込めませんでした。' }, { status: 503 }); }
}
