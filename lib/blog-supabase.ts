import type { BlogArticle } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const TABLE = 'blog_articles';

export async function fetchBlogArticles(): Promise<BlogArticle[]> {
  if (!supabase) {
    console.warn('fetchBlogArticles: Supabase client not available');
    console.warn('fetchBlogArticles: Check if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env');
    return [];
  }
  console.log('fetchBlogArticles: Fetching from table:', TABLE);
  console.log('fetchBlogArticles: Supabase client initialized:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('fetchBlogArticles: Error:', error);
      console.error('fetchBlogArticles: Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      // RLSポリシーの問題の可能性を提示
      if (error.code === 'PGRST301' || error.message?.includes('permission denied')) {
        console.error('fetchBlogArticles: RLS policy issue detected. Check Supabase dashboard → Authentication → Policies');
      }
      return [];
    }
    
    console.log('fetchBlogArticles: Success, found', data?.length ?? 0, 'articles');
    if (data && data.length > 0) {
      console.log('fetchBlogArticles: Sample article:', {
        id: data[0].id,
        title: data[0].title,
        is_published: data[0].is_published,
        slug: data[0].slug,
      });
      console.log('fetchBlogArticles: All articles:', data.map(a => ({ id: a.id, title: a.title })));
    } else {
      console.warn('fetchBlogArticles: No articles found in database');
    }
    return (data ?? []) as BlogArticle[];
  } catch (err) {
    console.error('fetchBlogArticles: Unexpected error:', err);
    return [];
  }
}

export async function fetchPublishedBlogArticles(): Promise<BlogArticle[]> {
  if (!supabase) {
    console.warn('fetchPublishedBlogArticles: Supabase client not available');
    return [];
  }
  console.log('fetchPublishedBlogArticles: Fetching published articles (is_published = true)');
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('fetchPublishedBlogArticles: Error:', error);
    console.error('fetchPublishedBlogArticles: Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  console.log('fetchPublishedBlogArticles: found', data?.length ?? 0, 'published articles');
  if (data && data.length > 0) {
    console.log('fetchPublishedBlogArticles: Published articles:', data.map(a => ({ id: a.id, title: a.title, is_published: a.is_published, published_at: a.published_at })));
  } else {
    console.warn('fetchPublishedBlogArticles: No published articles found. Check if is_published is set to true.');
  }
  return (data ?? []) as BlogArticle[];
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
  const { data, error } = await supabase.from(TABLE).select('*').eq('slug', slugOrId).eq('is_published', true).maybeSingle();
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
  if (error) {
    console.error('createBlogArticle:', error);
    return null;
  }
  return data as BlogArticle;
}

export async function updateBlogArticle(id: string, row: BlogArticleUpdate): Promise<BlogArticle | null> {
  if (!supabase) return null;
  const payload = { ...row, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from(TABLE).update(payload).eq('id', id).select().single();
  if (error) {
    console.error('updateBlogArticle:', error);
    return null;
  }
  return data as BlogArticle;
}

export async function deleteBlogArticle(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  return !error;
}

export { isSupabaseConfigured };
