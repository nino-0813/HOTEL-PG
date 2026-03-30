import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import * as blogSupabase from '@/lib/blog-supabase';
import { BLOG_POSTS } from '@/constants';
import { JsonLd } from '@/components/JsonLd';
import { getBlogPostingSchema, getBreadcrumbSchema } from '@/lib/json-ld';
import { toPublicStorageUrl } from '@/lib/upload';
import { absoluteUrl, DEFAULT_OG_IMAGE_PATH, SITE_NAME } from '@/lib/site';
import BlogArticleClient from '@/components/BlogArticleClient';

const getArticle = cache(async (slug: string) => {
  if (!blogSupabase.isSupabaseConfigured()) return null;
  return blogSupabase.getBlogArticleBySlugOrId(slug);
});

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalPath = `/blog/${slug}`;
  const article = await getArticle(slug);
  if (article) {
    const desc = article.excerpt ?? article.title;
    const cover = article.image_url ? (toPublicStorageUrl(article.image_url) ?? article.image_url) : null;
    const ogImages = cover
      ? [{ url: cover, alt: article.title }]
      : [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: article.title }];
    return {
      title: article.title,
      description: desc,
      alternates: { canonical: canonicalPath },
      openGraph: {
        type: 'article',
        url: absoluteUrl(canonicalPath),
        title: article.title,
        description: desc,
        siteName: SITE_NAME,
        locale: 'ja_JP',
        publishedTime: article.published_at ?? article.created_at ?? undefined,
        modifiedTime: article.updated_at ?? undefined,
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: desc,
        images: cover ? [cover] : [DEFAULT_OG_IMAGE_PATH],
      },
    };
  }
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);
  if (staticPost) {
    const cover = staticPost.image ? absoluteUrl(staticPost.image) : null;
    const ogImages = cover
      ? [{ url: cover, alt: staticPost.title }]
      : [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: staticPost.title }];
    return {
      title: staticPost.title,
      description: staticPost.excerpt,
      alternates: { canonical: canonicalPath },
      openGraph: {
        type: 'article',
        url: absoluteUrl(canonicalPath),
        title: staticPost.title,
        description: staticPost.excerpt,
        siteName: SITE_NAME,
        locale: 'ja_JP',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: staticPost.title,
        description: staticPost.excerpt,
        images: cover ? [cover] : [DEFAULT_OG_IMAGE_PATH],
      },
    };
  }
  return { title: '記事が見つかりません', robots: { index: false, follow: false } };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const useBlockBlog = blogSupabase.isSupabaseConfigured();
  const article = useBlockBlog ? await getArticle(slug) : null;
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);

  if (useBlockBlog && !article && !staticPost) {
    notFound();
  }

  const articleUrl = absoluteUrl(`/blog/${slug}`);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'トップ', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: article?.title ?? staticPost?.title ?? '記事', url: articleUrl },
  ]);

  let blogPostingSchema: ReturnType<typeof getBlogPostingSchema> | null = null;
  if (article) {
    const imageUrl = article.image_url ? (toPublicStorageUrl(article.image_url) ?? article.image_url) : undefined;
    blogPostingSchema = getBlogPostingSchema({
      headline: article.title,
      description: article.excerpt ?? undefined,
      image: imageUrl,
      datePublished: article.published_at ?? article.created_at ?? article.updated_at,
      dateModified: article.updated_at,
      url: articleUrl,
    });
  } else if (staticPost) {
    const dateIso = staticPost.date ? `${staticPost.date.replace(/\./g, '-')}T00:00:00+09:00` : new Date().toISOString();
    blogPostingSchema = getBlogPostingSchema({
      headline: staticPost.title,
      description: staticPost.excerpt,
      image: staticPost.image,
      datePublished: dateIso,
      url: articleUrl,
    });
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {blogPostingSchema && <JsonLd data={blogPostingSchema} />}
      <BlogArticleClient
      slug={slug}
      initialArticle={article}
      staticPost={staticPost}
      useBlockBlog={useBlockBlog}
    />
    </>
  );
}
