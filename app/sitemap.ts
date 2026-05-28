import type { MetadataRoute } from 'next';
import { BLOG_POSTS, EXPERIENCE_PLANS } from '@/constants';
import * as blogSupabase from '@/lib/blog-supabase';
import { SITE_ORIGIN } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_ORIGIN}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_ORIGIN}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_ORIGIN}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_ORIGIN}/recruit`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${SITE_ORIGIN}/reserve`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_ORIGIN}/experience-plans`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
  ];

  // 体験プラン詳細LPページ公開後に true にすると sitemap に各プランURLを追加します。
  const EXPERIENCE_DETAIL_PUBLISHED = false;
  if (EXPERIENCE_DETAIL_PUBLISHED) {
    for (const plan of EXPERIENCE_PLANS) {
      staticEntries.push({
        url: `${SITE_ORIGIN}/experience-plans/${plan.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  }

  const seen = new Set<string>();
  const blogEntries: MetadataRoute.Sitemap = [];

  const addBlogUrl = (pathSegment: string, lastModified?: Date | null) => {
    const url = `${SITE_ORIGIN}/blog/${pathSegment}`;
    if (seen.has(url)) return;
    seen.add(url);
    blogEntries.push({
      url,
      lastModified: lastModified ?? now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  };

  for (const post of BLOG_POSTS) {
    addBlogUrl(post.slug);
  }

  if (blogSupabase.isSupabaseConfigured()) {
    const articles = await blogSupabase.fetchPublishedBlogArticles();
    for (const a of articles) {
      const segment = (a.slug ?? a.id).replace(/^\/+/, '');
      if (!segment) continue;
      const modified = a.updated_at ? new Date(a.updated_at) : a.published_at ? new Date(a.published_at) : now;
      addBlogUrl(segment, modified);
    }
  }

  return [...staticEntries, ...blogEntries];
}
