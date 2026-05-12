'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  Image,
  LogOut,
  Home,
  Plus,
  CalendarDays,
  SlidersHorizontal,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { isAdminLoggedIn, adminLogout } from '@/lib/admin-auth';

/**
 * /admin 以外の管理画面のみで使用（(panel) レイアウト）。
 * 未ログイン時は /admin へ誘導。ログイン画面とは分離しているため pathname 判定不要。
 */
export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [blogSubOpen, setBlogSubOpen] = useState(false);

  useEffect(() => {
    if (!pathname?.startsWith('/admin/blog')) {
      setBlogSubOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAdminLoggedIn()) {
      router.replace('/admin');
    }
  }, [mounted, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-9 h-9 text-textMain animate-spin" aria-label="読み込み中" />
      </div>
    );
  }

  if (!isAdminLoggedIn()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-9 h-9 text-textMain animate-spin" aria-label="読み込み中" />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/session', { method: 'DELETE', credentials: 'include' });
    } catch {
      // ignore
    }
    adminLogout();
    router.replace('/admin');
  };

  const nav = [
    { path: '/admin/bookings', label: '予約一覧', icon: CalendarDays },
    { path: '/admin/room-settings', label: '料金・在庫設定', icon: SlidersHorizontal },
    { path: '/admin/blog', label: 'ブログ', icon: FileText },
    { path: '/admin/content', label: 'コンテンツ・写真', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-display text-lg text-textMain">HOTEL PG 管理</h1>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {nav.map(({ path, label, icon: Icon }) => (
            <div key={path}>
              {path === '/admin/blog' ? (
                <div className="rounded-lg border border-transparent">
                  <div className="flex items-stretch gap-0.5">
                    <button
                      type="button"
                      onClick={() => router.push(path)}
                      className={`min-w-0 flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        pathname?.startsWith('/admin/blog')
                          ? 'bg-gray-100 text-textMain'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                    <button
                      type="button"
                      aria-expanded={blogSubOpen}
                      aria-label={blogSubOpen ? 'ブログのサブメニューを閉じる' : 'ブログのサブメニューを開く'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlogSubOpen((v) => !v);
                      }}
                      className={`shrink-0 flex items-center justify-center w-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors ${
                        pathname?.startsWith('/admin/blog') ? 'text-textMain' : ''
                      }`}
                    >
                      <ChevronRight
                        size={18}
                        className={`transition-transform duration-200 ${blogSubOpen ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      blogSubOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      <button
                        type="button"
                        onClick={() => router.push('/admin/blog/new')}
                        className={`w-full flex items-center gap-2 px-3 py-2 pl-9 rounded-lg text-left text-sm transition-colors ${
                          pathname === '/admin/blog/new'
                            ? 'bg-gray-100 text-textMain font-medium'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <Plus size={16} />
                        新規記事の作成
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push(path)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    pathname === path ? 'bg-gray-100 text-textMain' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              )}
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-200 space-y-1">
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.open('/', '_blank')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-gray-600 hover:bg-gray-50"
          >
            <Home size={18} />
            サイトを開く
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-gray-600 hover:bg-gray-50"
          >
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
