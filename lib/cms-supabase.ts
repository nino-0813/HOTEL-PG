import type { BlogPost, SectionContent } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const TABLE = 'cms_content';
export type CmsContent = {
  concept: SectionContent;
  rooms: SectionContent;
  dining: SectionContent;
  activity: SectionContent;
};

type CmsPayload = {
  blog_posts: BlogPost[];
  concept: SectionContent;
  rooms: SectionContent;
  dining: SectionContent;
  activity: SectionContent;
};

async function getRow(key: string): Promise<unknown | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from(TABLE).select('value').eq('key', key).maybeSingle();
  if (error || !data) return null;
  return (data as { value: unknown }).value;
}

export async function fetchBlogPosts(): Promise<BlogPost[] | null> {
  const raw = await getRow('blog_posts');
  if (!Array.isArray(raw)) return null;
  return raw as BlogPost[];
}

export async function fetchContent(): Promise<CmsContent | null> {
  const keys = ['concept', 'rooms', 'dining', 'activity'] as const;
  const out: Record<string, SectionContent> = {};
  for (const k of keys) {
    const raw = await getRow(k);
    if (raw && typeof raw === 'object' && 'title' in raw && 'subtitle' in raw && Array.isArray((raw as SectionContent).description) && Array.isArray((raw as SectionContent).images)) {
      out[k] = raw as SectionContent;
    } else {
      return null;
    }
  }
  return out as CmsContent;
}

export async function fetchAll(): Promise<CmsPayload | null> {
  if (!isSupabaseConfigured()) return null;
  const posts = await fetchBlogPosts();
  const content = await fetchContent();
  if (posts === null || content === null) return null;
  return { blog_posts: posts, ...content };
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(TABLE).upsert({ key: 'blog_posts', value: posts, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

export async function saveSection(key: keyof CmsContent, data: SectionContent): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from(TABLE).upsert({ key, value: data, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

export async function saveContent(content: CmsContent): Promise<boolean> {
  const keys = ['concept', 'rooms', 'dining', 'activity'] as const;
  for (const k of keys) {
    const ok = await saveSection(k, content[k]);
    if (!ok) return false;
  }
  return true;
}

export { isSupabaseConfigured };
