import 'server-only';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getServerSupabase, isServerSupabaseConfigured } from './supabase-server';
import { publicNews, sortNews, type NewsArticle, type NewsInput } from './news';
import { sampleNews } from '@/data/news';

const TABLE = 'site_news';
const localPath = path.join(process.cwd(), '.local', 'news.json');
export const useLocalNews = () => process.env.NODE_ENV === 'development' && !isServerSupabaseConfigured();
export class NewsStoreError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
function db() {
  const client = getServerSupabase();
  if (!client) throw new NewsStoreError('お知らせの保存先が未設定です。Supabaseのサーバー環境変数を設定してください。', 503);
  return client;
}
function dbError(code?: string): never {
  if (code === '23505') throw new NewsStoreError('このURLは別の記事で使用されています。', 409);
  throw new NewsStoreError('お知らせを読み書きできません。接続設定とsite_newsテーブルを確認してください。', 503);
}
function localRead(): NewsArticle[] {
  try { return JSON.parse(readFileSync(localPath, 'utf8')); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return structuredClone(sampleNews); throw e; }
}
// 開発用ファイルの更新を同一プロセス内で直列化し、上書き競合を防ぐ。
let writeQueue: Promise<unknown> = Promise.resolve();
async function localUpdate(fn: (rows: NewsArticle[]) => NewsArticle) {
  const task = writeQueue.then(async () => {
    const rows = localRead();
    const saved = fn(rows);
    await mkdir(path.dirname(localPath), { recursive: true });
    const tmp = `${localPath}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(rows, null, 2));
    await rename(tmp, localPath);
    return saved;
  });
  writeQueue = task.catch(() => undefined);
  return task;
}
export async function listNews(publishedOnly = true): Promise<NewsArticle[]> {
  if (useLocalNews()) {
    const rows = localRead();
    return publishedOnly ? publicNews(rows) : sortNews(rows);
  }
  if (!isServerSupabaseConfigured()) {
    return publishedOnly ? publicNews(sampleNews) : sortNews(sampleNews);
  }
  let query = db().from(TABLE).select('*');
  if (publishedOnly) query = query.eq('published', true);
  const { data, error } = await query.order('date', { ascending: false }).order('updatedAt', { ascending: false });
  if (error) dbError(error.code);
  const rows = (data ?? []) as NewsArticle[];
  if (publishedOnly && rows.length === 0) return publicNews(sampleNews);
  return sortNews(rows);
}
export async function findNews(slug: string) {
  if (useLocalNews()) return (await listNews()).find(a => a.slug === slug) ?? null;
  if (!isServerSupabaseConfigured()) return publicNews(sampleNews).find(a => a.slug === slug) ?? null;
  const { data, error } = await db().from(TABLE).select('*').eq('slug', slug).eq('published', true).maybeSingle();
  if (error) dbError(error.code);
  return (data as NewsArticle | null) ?? publicNews(sampleNews).find(a => a.slug === slug) ?? null;
}
export async function saveNews(input: NewsInput, id?: string, version?: string): Promise<NewsArticle> {
  const updatedAt = new Date().toISOString();
  if (useLocalNews()) return localUpdate(rows => {
    if (rows.some(a => a.slug === input.slug && a.id !== id)) throw new NewsStoreError('このURLは別の記事で使用されています。', 409);
    const index = rows.findIndex(a => a.id === id);
    if (id && index === -1) throw new NewsStoreError('記事が見つかりません。', 404);
    if (id && rows[index].updatedAt !== version) throw new NewsStoreError('別の画面で更新されています。再読み込みしてから編集してください。', 409);
    const article: NewsArticle = { ...input, id: id ?? randomUUID(), updatedAt, ...(index >= 0 && rows[index].sample ? { sample: true } : {}) };
    if (index < 0) rows.push(article); else rows[index] = article;
    return article;
  });
  const query = id
    ? db().from(TABLE).update({ ...input, updatedAt }).eq('id', id).eq('updatedAt', version)
    : db().from(TABLE).insert({ ...input, id: randomUUID(), updatedAt });
  const { data, error } = await query.select().maybeSingle();
  if (error) dbError(error.code);
  if (!data) throw new NewsStoreError('別の画面で更新されています。再読み込みしてから編集してください。', 409);
  return data as NewsArticle;
}
