import { normalizeNewsBody } from './news-body';
export const NEWS_CATEGORIES = ['お知らせ', 'イベント', '宿泊プラン', '施設・サービス', '周辺情報'] as const;
export type NewsCategory = typeof NEWS_CATEGORIES[number];
export type NewsArticle = {
  id: string;
  slug: string;
  date: string;
  category: NewsCategory;
  tags: string[];
  title: string;
  image: string;
  body: string;
  published: boolean;
  updatedAt: string;
  sample?: boolean;
};
export type NewsInput = Omit<NewsArticle, 'id' | 'updatedAt' | 'sample'>;
export function formatNewsDate(date: string) { return date.replace(/-/g, '.'); }
export function parseNewsInput(raw: unknown): NewsInput {
  if (!raw || typeof raw !== 'object') throw new Error('記事の入力を確認してください。');
  const r = raw as Record<string, unknown>;
  const str = (key: string, max: number, required = true) => {
    if (typeof r[key] !== 'string') throw new Error(`${key}の入力を確認してください。`);
    const value = (r[key] as string).trim();
    if ((required && !value) || value.length > max) throw new Error(`${key}の長さを確認してください。`);
    return value;
  };
  const title = str('title', 120);
  const slug = str('slug', 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('URLは半角英小文字・数字・ハイフンで入力してください。');
  const date = str('date', 10);
  const d = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== date) throw new Error('日付を確認してください。');
  if (!NEWS_CATEGORIES.includes(r.category as NewsCategory)) throw new Error('ジャンルを選択してください。');
  if (!Array.isArray(r.tags) || r.tags.length > 8 || r.tags.some(t => typeof t !== 'string' || !t.trim() || t.trim().length > 24)) throw new Error('タグは24文字以内、8個までにしてください。');
  if (typeof r.published !== 'boolean') throw new Error('公開状態を確認してください。');
  const image = str('image', 900000, false);
  if (image && !/^\/(?!\/)/.test(image) && !/^https:\/\//.test(image) && !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(image)) throw new Error('画像はHTTPSのURL、サイト内パス、またはアップロード画像を指定してください。');
  return { title, slug, date, category: r.category as NewsCategory, tags: [...new Set((r.tags as string[]).map(t => t.trim()))], body: normalizeNewsBody(str('body', 180000)), image, published: r.published };
}
export function sortNews(articles: NewsArticle[]) {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id));
}
export function publicNews(articles: NewsArticle[]) { return sortNews(articles.filter(a => a.published)); }
