'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

const POST_AUTH_NEXT_KEY = 'hotelpg:post_auth_next';

export function AuthGate({
  nextPath,
  title = 'Sign in',
}: {
  nextPath: string;
  title?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const callbackUrl = useMemo(() => new URL('/auth/callback', window.location.origin).toString(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setHasSession(!!data.session);
      setLoading(false);
      if (data.session) window.location.href = nextPath;
    })();
    return () => {
      mounted = false;
    };
  }, [nextPath]);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    localStorage.setItem(POST_AUTH_NEXT_KEY, nextPath);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl },
    });
  };

  const signUpOrSignIn = async () => {
    if (!supabase) return;
    if (!email || !password) return;

    // 既存ユーザーは signIn、未登録なら signUp の順で試す（最短導線）
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (!signIn.error) {
      window.location.href = nextPath;
      return;
    }

    const signUp = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callbackUrl },
    });
    if (!signUp.error) {
      localStorage.setItem(POST_AUTH_NEXT_KEY, nextPath);
      window.location.href = nextPath;
    } else {
      alert('ログイン/登録に失敗しました。入力内容をご確認ください。');
    }
  };

  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-lg">
        <h1 className="font-display text-3xl sm:text-4xl font-light text-textMain tracking-[0.08em]">
          {title}
        </h1>
        <p className="font-serif text-sm text-textLight mt-3 leading-relaxed">
          決済へ進むには会員登録（またはログイン）が必要です。
        </p>

        {!supabase ? (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
            <p className="font-serif text-sm text-textMain">
              Supabase が未設定です。.env に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY`
              を設定してください。
            </p>
          </div>
        ) : null}

        <div className="mt-8 bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-6 sm:p-8">
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading || !supabase}
            className="w-full font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded disabled:opacity-60"
          >
            Googleで続ける
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="font-display text-[10px] tracking-[0.2em] uppercase text-gray-400">
              or
            </span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <label className="block font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-serif text-sm outline-none focus:border-gray-400"
          />

          <label className="block font-display text-[11px] tracking-[0.2em] uppercase text-gray-500 mt-4">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-serif text-sm outline-none focus:border-gray-400"
          />

          <button
            type="button"
            onClick={signUpOrSignIn}
            disabled={loading || !supabase}
            className="mt-5 w-full font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded disabled:opacity-60"
          >
            メールで続ける（ログイン/登録）
          </button>
        </div>

        {hasSession ? (
          <p className="font-serif text-xs text-gray-500 mt-6">
            すでにログイン済みです。自動的に遷移します…
          </p>
        ) : null}
      </div>
    </main>
  );
}

