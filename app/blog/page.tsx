'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/json-ld';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCms } from '@/context/CmsContext';
import { BLOG_POSTS } from '@/constants';
import * as blogSupabase from '@/lib/blog-supabase';
import { toPublicStorageUrl } from '@/lib/upload';
import type { BlogArticle, BlogPost } from '@/types';
import { useHydrated } from '@/lib/useHydrated';

const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function BlogListPage() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, margin: '-5%' });
  const reveal = hydrated && isInView;
  const cms = useCms();
  const useBlockBlog = blogSupabase.isSupabaseConfigured();

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(useBlockBlog);

  const fetchPublished = useCallback(async () => {
    if (!useBlockBlog) return;
    setLoading(true);
    const list = await blogSupabase.fetchPublishedBlogArticles();
    setArticles(list);
    setLoading(false);
  }, [useBlockBlog]);

  useEffect(() => {
    fetchPublished();
  }, [fetchPublished]);

  const list = useBlockBlog ? (articles.length > 0 ? articles : BLOG_POSTS) : cms.blogPosts;
  const fromBlock = useBlockBlog && articles.length > 0;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'トップ', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

  return (
    <div className="min-h-screen relative">
      <JsonLd data={breadcrumbSchema} />
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32">
        <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
          <motion.div
            className="mb-10 md:mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={reveal ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain mb-6 hover:opacity-70 transition-opacity"
            >
              ← トップへ
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain">
              Blog
            </h1>
            <p className="font-serif text-sm text-gray-500 mt-2 tracking-wider">
              ブログ・読み物
            </p>
          </motion.div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">読み込み中...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500 text-center py-12">記事はまだありません。</p>
          ) : fromBlock ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
              {(list as BlogArticle[]).map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={reveal ? { opacity: 1, y: 0 } : false}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link
                    href={`/blog/${article.slug ?? article.id}`}
                    className="block h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
                  >
                    {article.image_url && (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={toPublicStorageUrl(article.image_url) ?? article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <time className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                        <Calendar size={10} />
                        {formatDate(article.published_at ?? article.updated_at)}
                      </time>
                      <h2 className="font-display text-base sm:text-lg font-light text-textMain leading-snug line-clamp-2 group-hover:text-textLight transition-colors mb-2">
                        {article.title}
                      </h2>
                      <p className="font-serif text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {article.excerpt ?? ''}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 font-display text-[11px] tracking-[0.15em] uppercase text-textMain opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                        続きを読む
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
              {(list as BlogPost[]).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={reveal ? { opacity: 1, y: 0 } : false}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
                  >
                    {post.image && (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 text-[10px] font-body tracking-wider text-textMain rounded">
                          {post.category}
                        </span>
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <time className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                        <Calendar size={10} />
                        {post.date}
                      </time>
                      <h2 className="font-display text-base sm:text-lg font-light text-textMain leading-snug line-clamp-2 group-hover:text-textLight transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="font-serif text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 font-display text-[11px] tracking-[0.15em] uppercase text-textMain opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                        続きを読む
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
