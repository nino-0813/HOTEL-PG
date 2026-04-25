'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Image, LogOut, Home, Plus, CalendarDays } from 'lucide-react';
import { isAdminLoggedIn, adminLogout } from '@/lib/admin-auth';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isIndex = pathname === '/admin';

  if (isIndex) {
    return <>{children}</>;
  }

  if (!isAdminLoggedIn()) {
    router.replace('/admin');
    return null;
  }

  const handleLogout = () => {
    adminLogout();
    router.replace('/admin');
  };

  const nav = [
    { path: '/admin/bookings', label: '予約一覧', icon: CalendarDays },
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
              <button
                onClick={() => router.push(path)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  path === '/admin/blog' ? (pathname?.startsWith('/admin/blog') ? 'bg-gray-100 text-textMain' : 'text-gray-600 hover:bg-gray-50')
                    : pathname === path
                      ? 'bg-gray-100 text-textMain'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
              {path === '/admin/blog' && (
                <button
                  onClick={() => router.push('/admin/blog/new')}
                  className={`w-full flex items-center gap-2 px-3 py-2 pl-9 rounded-lg text-left text-sm transition-colors ${
                    pathname === '/admin/blog/new' ? 'bg-gray-100 text-textMain font-medium' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Plus size={16} />
                  新規記事の作成
                </button>
              )}
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-200 space-y-1">
          <button
            onClick={() => typeof window !== 'undefined' && window.open('/', '_blank')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-gray-600 hover:bg-gray-50"
          >
            <Home size={18} />
            サイトを開く
          </button>
          <button
            onClick={handleLogout}
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
