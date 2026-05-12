import type { BlogArticle } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const TABLE = 'blog_articles';

export async function fetchBlogArticles(): Promise<BlogArticle[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) return [];
    return (data ?? []) as BlogArticle[];
  } catch {
    return [];
  }
}

export async function fetchPublishedBlogArticles(): Promise<BlogArticle[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: false });
    if (error) return [];
    return (data ?? []) as BlogArticle[];
  } catch {
    return [];
  }
}

export async function getBlogArticleById(id: string): Promise<BlogArticle | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data as BlogArticle;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getBlogArticleBySlugOrId(slugOrId: string): Promise<BlogArticle | null> {
  if (!supabase) return null;
  if (UUID_REGEX.test(slugOrId)) {
    const row = await getBlogArticleById(slugOrId);
    return row?.is_published ? row : null;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slugOrId)
    .eq('is_published', true)
    .maybeSingle();
  if (error || !data) return null;
  return data as BlogArticle;
}

export type BlogArticleInsert = Pick<BlogArticle, 'title' | 'content'> & {
  slug?: string | null;
  excerpt?: string | null;
  image_url?: string | null;
  note_url?: string | null;
  published_at?: string | null;
  is_published?: boolean;
};

export type BlogArticleUpdate = Partial<BlogArticleInsert>;

export async function createBlogArticle(row: BlogArticleInsert): Promise<BlogArticle | null> {
  if (!supabase) return null;
  const payload = {
    ...row,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) return null;
  return data as BlogArticle;
}

export async function updateBlogArticle(id: string, row: BlogArticleUpdate): Promise<BlogArticle | null> {
  if (!supabase) return null;
  const payload = { ...row, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single();
  if (error) return null;
  return data as BlogArticle;
}

export async function deleteBlogArticle(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  return !error;
}

export { isSupabaseConfigured };
