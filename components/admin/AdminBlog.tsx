'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCms } from '@/context/CmsContext';
import * as blogSupabase from '@/lib/blog-supabase';
import { toPublicStorageUrl } from '@/lib/upload';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import type { BlogPost } from '@/types';
import type { BlogArticle } from '@/types';

const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const AdminBlog: React.FC = () => {
  const router = useRouter();
  const cms = useCms();
  const useBlockBlog = blogSupabase.isSupabaseConfigured();

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(useBlockBlog);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useBlockBlog) return;
  }, [useBlockBlog]);

  const fetchArticles = useCallback(async () => {
    if (!useBlockBlog) return;
    setLoading(true);
    setError(null);
    try {
      const list = await blogSupabase.fetchBlogArticles();
      setArticles(list);
    } catch (err) {
      setError('記事の取得に失敗しました。コンソールを確認してください。');
    } finally {
      setLoading(false);
    }
  }, [useBlockBlog]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('この記事を削除しますか？')) return;
    if (useBlockBlog) {
      setDeleting(true);
      await blogSupabase.deleteBlogArticle(id);
      setDeleting(false);
      await fetchArticles();
      return;
    }
    const nextPosts = cms.blogPosts.filter((p) => p.id !== id);
    cms.setBlogPosts(nextPosts);
    setDeleting(true);
    await cms.save({ blogPosts: nextPosts });
    setDeleting(false);
  };

  if (useBlockBlog) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-textMain">記事一覧（ブロック形式）</h2>
          <button
            onClick={() => router.push('/admin/blog/new')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] text-sm"
          >
            <Plus size={16} />
            新規
          </button>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-500 text-sm">読み込み中...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchArticles}
              className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
            >
              再試行
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {articles.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                記事がありません。<br />
                「新規」から追加できます。
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-[calc(100vh-14rem)] overflow-y-auto">
                {articles.map((article) => (
                  <li key={article.id}>
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => router.push(`/admin/blog/${article.id}`)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {article.image_url ? (
                          <img src={toPublicStorageUrl(article.image_url) ?? article.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={18} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-textMain truncate">{article.title}</p>
                        <p className="text-[11px] text-gray-500">
                          {formatDate(article.published_at ?? article.updated_at)}
                          {article.is_published ? '・公開' : '・下書き'}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/admin/blog/${article.id}`); }}
                          className="p-1.5 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded"
                          title="編集"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, article.id)}
                          disabled={deleting}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="削除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {useBlockBlog ? (
          <p className="mt-3 text-[11px] text-gray-400">blog_articles（Supabase）に保存されています</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-textMain">記事一覧</h2>
        <button
          onClick={() => router.push('/admin/blog/new')}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] text-sm"
        >
          <Plus size={16} />
          新規
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {cms.blogPosts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            記事がありません。<br />
            「新規」から追加できます。
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 max-h-[calc(100vh-14rem)] overflow-y-auto">
            {cms.blogPosts.map((post: BlogPost) => (
              <li key={post.id}>
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => router.push(`/admin/blog/${post.id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {post.image ? (
                      <img src={post.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-textMain truncate">{post.title}</p>
                    <p className="text-[11px] text-gray-500">{post.date}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/admin/blog/${post.id}`); }}
                      className="p-1.5 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded"
                      title="編集"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, post.id)}
                      disabled={deleting}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                      title="削除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-[11px] text-gray-400">このブラウザのローカルに保存されています（管理画面のプレビュー用）</p>
    </div>
  );
};

export default AdminBlog;
