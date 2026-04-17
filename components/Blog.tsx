import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { BLOG_POSTS } from '../constants';
import * as blogSupabase from '../lib/blog-supabase';
import { toPublicStorageUrl } from '../lib/upload';
import type { BlogArticle } from '../types';
import type { BlogPost } from '../types';

const HOME_BLOG_LIMIT = 3;

const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const Blog: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
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

  // Supabaseが設定されている場合は公開記事を、記事が0件なら静的SEO記事（BLOG_POSTS）を表示
  const posts: (BlogArticle | BlogPost)[] = useBlockBlog
    ? (articles.length > 0 ? articles : BLOG_POSTS)
    : cms.blogPosts;
  const featuredPosts = posts.slice(0, HOME_BLOG_LIMIT);
  const hasMore = posts.length > HOME_BLOG_LIMIT;

  return (
    <section id="blog" className="relative py-12 sm:py-16 md:py-24 bg-background">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12 max-w-6xl">
        <motion.div
          className="mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain mb-2">
            Blog
          </h2>
          <p className="font-serif text-sm text-gray-500 tracking-widest">
            ブログ・読み物
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-4 mx-auto" />
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">読み込み中...</p>
          </div>
        ) : featuredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">記事はまだありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
            {featuredPosts.map((post, index) => {
              // Supabaseの記事（BlogArticle）か、従来の記事（BlogPost）かを判定
              const isBlockArticle = useBlockBlog && 'image_url' in post;
              const rawImageUrl = isBlockArticle ? (post as BlogArticle).image_url : (post as BlogPost).image;
              const imageUrl = rawImageUrl ? (toPublicStorageUrl(rawImageUrl) ?? rawImageUrl) : undefined;
              const title = post.title;
              const excerpt = isBlockArticle ? (post as BlogArticle).excerpt : (post as BlogPost).excerpt;
              const slug = post.slug;
              const date = isBlockArticle 
                ? formatDate((post as BlogArticle).published_at ?? (post as BlogArticle).updated_at)
                : (post as BlogPost).date;
              const category = isBlockArticle ? null : (post as BlogPost).category;

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group"
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                >
                  <Link
                    href={`/blog/${slug ?? post.id}`}
                    className="block h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    itemProp="url"
                  >
                    {imageUrl && (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          itemProp="image"
                        />
                        {category && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 text-[10px] font-body tracking-wider text-textMain rounded">
                            {category}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <time
                        dateTime={isBlockArticle ? ((post as BlogArticle).published_at ?? (post as BlogArticle).updated_at ?? '') : (post as BlogPost).date.replace(/\./g, '-')}
                        className="flex items-center gap-1 text-[11px] text-gray-500 mb-2"
                        itemProp="datePublished"
                      >
                        <Calendar size={10} />
                        {date}
                      </time>
                      <h3
                        className="font-display text-base sm:text-lg font-light text-textMain leading-snug line-clamp-2 group-hover:text-textLight transition-colors mb-2"
                        itemProp="headline"
                      >
                        {title}
                      </h3>
                      <p
                        className="font-serif text-xs text-gray-600 leading-relaxed line-clamp-2"
                        itemProp="description"
                      >
                        {excerpt ?? ''}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-3 font-display text-[11px] tracking-[0.15em] uppercase text-textMain opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
                        続きを読む
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}

        {(hasMore || featuredPosts.length > 0) && (
          <motion.div
            className="mt-8 md:mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-display text-sm tracking-[0.15em] uppercase text-textMain border-b border-transparent hover:border-textMain pb-0.5 transition-all"
            >
              {hasMore ? 'すべての記事を見る' : 'ブログ一覧'}
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Blog;
