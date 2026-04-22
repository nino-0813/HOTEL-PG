'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const POST_AUTH_NEXT_KEY = 'hotelpg:post_auth_next';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('ログイン処理中…');

  const nextPath = useMemo(() => {
    const n = searchParams.get('next');
    if (n && n.startsWith('/')) return n;
    const stored = typeof window !== 'undefined' ? localStorage.getItem(POST_AUTH_NEXT_KEY) : null;
    return stored && stored.startsWith('/') ? stored : '/checkout';
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) {
        setMessage('Supabase が未設定です。環境変数をご確認ください。');
        return;
      }

      try {
        // OAuth/PKCE の code をセッションへ交換
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          setMessage('ログインに失敗しました。もう一度お試しください。');
          return;
        }
        if (!mounted) return;
        localStorage.removeItem(POST_AUTH_NEXT_KEY);
        window.location.href = nextPath;
      } catch {
        setMessage('ログインに失敗しました。もう一度お試しください。');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [nextPath]);

  return (
    <main className="min-h-screen bg-background flex items-center">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-lg py-20">
        <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm">
          <p className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
            AUTH
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-light text-textMain tracking-[0.08em] mt-4">
            {message}
          </h1>
          <p className="font-serif text-sm text-textLight mt-4 leading-relaxed">
            しばらく待っても画面が切り替わらない場合は、戻ってもう一度お試しください。
          </p>
          <div className="mt-8">
            <a
              href={`/auth?next=${encodeURIComponent(nextPath)}`}
              className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded"
            >
              ログイン画面へ戻る
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

