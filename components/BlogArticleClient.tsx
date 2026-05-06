'use client';

import React, { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCms } from '@/context/CmsContext';
import { toPublicStorageUrl } from '@/lib/upload';
import { BlogBlockRenderer } from '@/components/BlogBlockRenderer';
import type { BlogArticle } from '@/types';
import type { BlogPost } from '@/types';

const formatDate = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

/** 縦向き表示したい画像（90度回転して表示） */
const ROTATE_IMAGE_IDS = ['8B785325-48D5-4928-9252-A3541EA5A7E6'];

/** 画像を figure + 写真説明（figcaption）で表示 */
function MarkdownImageWithCaption({ src, alt }: { src?: string | null; alt?: string | null }) {
  const isRotate = src && ROTATE_IMAGE_IDS.some((id) => src.includes(id));
  return (
    <figure>
      <div
        className={`relative w-full overflow-hidden rounded-xl ${
          isRotate ? 'aspect-[3/4] max-w-[360px] mx-auto' : 'aspect-video'
        }`}
      >
        <Image
          src={src || ''}
          alt={alt || ''}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className={`object-cover ${isRotate ? 'rotate-90 scale-[1.4]' : ''}`}
        />
      </div>
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  );
}

/**
 * 単独画像の段落はカスタム img が <figure> を返すため、子の React 要素型は 'figure' ではなくコンポーネント参照になる。
 * そのまま <p> で包むと HTML 不正＆ハイドレーションエラーになるので unwrap する。
 */
function isBlockFigureElement(el: React.ReactNode): boolean {
  if (!React.isValidElement(el)) return false;
  if (el.type === 'figure') return true;
  if (el.type === MarkdownImageWithCaption) return true;
  return false;
}

function paragraphOnlyContainsBlockFigure(children: React.ReactNode): boolean {
  const arr = React.Children.toArray(children).filter((child) => {
    if (typeof child === 'string') return child.trim() !== '';
    // toArray の型から boolean は除外されるため !== false は不要（Vercel の strict ビルドで型エラーになる）
    return child != null;
  });
  if (arr.length !== 1) return false;
  const el = arr[0];
  if (isBlockFigureElement(el)) return true;

  // [![...](...)](https://...) のように a が figure を包むパターンも unwrap する
  if (React.isValidElement(el) && el.type === 'a') {
    const inner = React.Children.toArray((el.props as any).children).filter((c) => {
      if (typeof c === 'string') return c.trim() !== '';
      return c != null;
    });
    if (inner.length === 1 && isBlockFigureElement(inner[0])) return true;
  }

  return false;
}

const markdownComponents = {
  p: ({ children, node: _mdNode, ...rest }: React.ComponentProps<'p'> & { node?: unknown }) => {
    if (paragraphOnlyContainsBlockFigure(children)) {
      return <Fragment>{children}</Fragment>;
    }
    return <p {...rest}>{children}</p>;
  },
  a: ({ href, children, node: _mdNode, ...rest }: React.ComponentProps<'a'> & { node?: unknown }) => {
    const isReservationAnchor = href === '/#reservation' || href === '#reservation';
    return (
      <a
        href={href}
        onClick={isReservationAnchor ? () => trackReservationClick(`blog_reservation_cta:${slug}`) : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  },
  img: MarkdownImageWithCaption,
};

const NotFound = () => (
  <div className="min-h-screen relative">
    <div className="bg-noise" />
    <Header />
    <main className="relative w-full pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
        <h1 className="font-display text-3xl text-textMain mb-6">記事が見つかりません</h1>
        <Link href="/blog" className="font-display text-sm tracking-[0.2em] uppercase text-textMain border-b border-textMain pb-1">
          ブログ一覧に戻る
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

type Props = {
  slug: string;
  initialArticle: BlogArticle | null;
  staticPost: BlogPost | undefined;
  useBlockBlog: boolean;
};

export default function BlogArticleClient({ slug, initialArticle, staticPost, useBlockBlog }: Props) {
  const cms = useCms();

  if (useBlockBlog) {
    if (!initialArticle && !staticPost) {
      return <NotFound />;
    }
    if (staticPost && !initialArticle) {
      const dateStr = staticPost.date ?? '';
      const dateTime = dateStr.replace(/\./g, '-');
      return (
        <div className="min-h-screen relative">
          <div className="bg-noise" />
          <Header />
          <main className="relative w-full pt-20 sm:pt-24 pb-16 sm:pb-24 bg-white">
            <article className="mx-auto max-w-[720px] px-4 sm:px-6 md:px-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-textMain transition-colors mb-8"
              >
                <ArrowLeft size={16} />
                ブログ一覧に戻る
              </Link>
              {staticPost.image && (
                <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl mb-10 shadow-sm">
                  <Image
                    src={staticPost.image}
                    alt={staticPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                  />
                </div>
              )}
              <header className="mb-10">
                <h1 className="font-display text-2xl sm:text-3xl md:text-[2rem] font-normal text-textMain leading-snug tracking-tight">
                  {staticPost.title}
                </h1>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <time className="flex items-center gap-1.5" dateTime={dateTime}>
                    <Calendar size={14} />
                    {dateStr}
                  </time>
                  <span>{staticPost.author}</span>
                </div>
              </header>
              <div className={`article-prose pt-8 border-t border-gray-100 ${staticPost.slug === 'hotel-pg-iii-coming-soon' ? 'blog-article-pg3' : ''}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {staticPost.content ?? ''}
                </ReactMarkdown>
              </div>

              {staticPost.slug === 'hotel-pg-iii-coming-soon' && (
                <div className="mt-14 pt-8 border-t border-gray-100 space-y-4">
                  <p className="font-serif text-sm text-textLight">
                    【OPEN記念価格】2名利用でお得｜和モダン客室｜最大3名｜無料駐車場｜長期滞在歓迎
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <a
                      href="https://vacation-stay.jp/listings/1546442"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full sm:inline-block sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 rounded"
                    >
                      楽天で予約する →
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-14 pt-8 border-t border-gray-100">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-textMain transition-colors"
                >
                  <ArrowLeft size={16} />
                  ブログ一覧に戻る
                </Link>
              </div>
            </article>
          </main>
          <Footer />
        </div>
      );
    }
    const article = initialArticle!;
    return (
      <div className="min-h-screen relative">
        <div className="bg-noise" />
        <Header />
        <main className="relative w-full pt-20 sm:pt-24 pb-16 sm:pb-24 bg-white">
          <article className="mx-auto max-w-[720px] px-4 sm:px-6 md:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-textMain transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              ブログ一覧に戻る
            </Link>

            {article.image_url && (
              <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl mb-10 shadow-sm">
                <Image
                  src={toPublicStorageUrl(article.image_url) ?? article.image_url}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
            )}

            <header className="mb-10">
              <h1 className="font-display text-2xl sm:text-3xl md:text-[2rem] font-normal text-textMain leading-snug tracking-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <time
                  dateTime={article.published_at ?? article.updated_at ?? ''}
                  className="flex items-center gap-1.5"
                >
                  <Calendar size={14} />
                  {formatDate(article.published_at ?? article.updated_at)}
                </time>
              </div>
            </header>

            <div className="article-prose pt-8 border-t border-gray-100">
              <BlogBlockRenderer content={article.content} />
            </div>

            {slug === 'hotel-pg-iii-coming-soon' && (
              <div className="mt-14 pt-8 border-t border-gray-100 space-y-4">
                <p className="font-serif text-sm text-textLight">
                  【OPEN記念価格】2名利用でお得｜和モダン客室｜最大3名｜無料駐車場｜長期滞在歓迎
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <a
                    href="https://vacation-stay.jp/listings/1546442"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full sm:inline-block sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 rounded"
                  >
                    楽天で予約する →
                  </a>
                </div>
              </div>
            )}

            <div className="mt-14 pt-8 border-t border-gray-100">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-textMain transition-colors"
              >
                <ArrowLeft size={16} />
                ブログ一覧に戻る
              </Link>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  const post = cms.blogPosts.find((p) => p.slug === slug);
  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen relative">
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-20 sm:pt-24 pb-16 sm:pb-24 bg-white">
        <article className="mx-auto max-w-[720px] px-4 sm:px-6 md:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-textMain transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            ブログ一覧に戻る
          </Link>

          {post.image && (
            <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl mb-10 shadow-sm">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          )}

          <header className="mb-10">
            <span className="inline-block text-xs text-gray-500 uppercase tracking-wider mb-3">
              {post.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl md:text-[2rem] font-normal text-textMain leading-snug tracking-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <time dateTime={post.date.replace(/\./g, '-')} className="flex items-center gap-1.5">
                <Calendar size={14} />
                {post.date}
              </time>
              <span>{post.author}</span>
            </div>
          </header>

          <div className="article-prose pt-8 border-t border-gray-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {post.content.trim() || ''}
            </ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-xs text-gray-500 px-2.5 py-1 rounded-md bg-gray-50">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.slug === 'hotel-pg-iii-coming-soon' && (
            <div className="mt-14 pt-8 border-t border-gray-100 space-y-4">
              <p className="font-serif text-sm text-textLight">
                【OPEN記念価格】2名利用でお得｜和モダン客室｜最大3名｜無料駐車場｜長期滞在歓迎
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <a
                  href="https://vacation-stay.jp/listings/1546442"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full sm:inline-block sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 rounded"
                >
                  楽天で予約する →
                </a>
              </div>
            </div>
          )}

          <div className="mt-14 pt-8 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-textMain transition-colors"
            >
              <ArrowLeft size={16} />
              ブログ一覧に戻る
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
