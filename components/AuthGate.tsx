'use client';

import React, { useEffect, useState } from 'react';
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
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

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

  const callbackUrl = () => `${window.location.origin}/auth/callback`;

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setNotice(null);
    localStorage.setItem(POST_AUTH_NEXT_KEY, nextPath);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl() },
    });
  };

  const loginWithEmail = async () => {
    if (!supabase) return;
    if (!email || !password) return;
    setNotice(null);

    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (signIn.error) {
      setNotice('ログインに失敗しました。メールアドレスとパスワードをご確認ください。');
      return;
    }
    window.location.href = nextPath;
  };

  const signupWithEmail = async () => {
    if (!supabase) return;
    if (!email || !password) return;
    setNotice(null);

    const signUp = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callbackUrl() },
    });

    if (signUp.error) {
      setNotice('登録に失敗しました。入力内容をご確認ください。');
      return;
    }

    // メール確認が有効な場合、ここで session が無いことがあるため案内を出す
    localStorage.setItem(POST_AUTH_NEXT_KEY, nextPath);
    if (!signUp.data.session) {
      setNotice('確認メールを送信しました。メール内のリンクからログインを完了してください。');
      return;
    }

    window.location.href = nextPath;
  };

  const sendResetEmail = async () => {
    if (!supabase) return;
    if (!email) {
      setNotice('パスワード再設定の送信先メールアドレスを入力してください。');
      return;
    }
    setNotice(null);
    localStorage.setItem(POST_AUTH_NEXT_KEY, nextPath);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: callbackUrl() });
    if (error) {
      setNotice('再設定メールの送信に失敗しました。時間をおいてお試しください。');
      return;
    }
    setNotice('パスワード再設定メールを送信しました。メールをご確認ください。');
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={[
                'flex-1 rounded-lg border px-4 py-3 text-left transition-colors',
                mode === 'login' ? 'border-textMain bg-white' : 'border-gray-200 bg-transparent hover:border-gray-400',
              ].join(' ')}
            >
              <div className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
                ログイン済みの方
              </div>
              <div className="font-serif text-sm text-textMain mt-1">ログイン</div>
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={[
                'flex-1 rounded-lg border px-4 py-3 text-left transition-colors',
                mode === 'signup' ? 'border-textMain bg-white' : 'border-gray-200 bg-transparent hover:border-gray-400',
              ].join(' ')}
            >
              <div className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
                はじめての方
              </div>
              <div className="font-serif text-sm text-textMain mt-1">新規登録</div>
            </button>
          </div>

          {notice ? (
            <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="font-serif text-sm text-textMain leading-relaxed">
                {notice}
              </p>
            </div>
          ) : null}
          <div className="mt-6">
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading || !supabase}
              className="w-full font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded disabled:opacity-60"
            >
              Googleで続ける
            </button>
            <p className="font-serif text-xs text-gray-500 mt-3 leading-relaxed">
              Googleアカウントをお持ちの方はこちらが一番スムーズです。
            </p>
          </div>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="font-display text-[10px] tracking-[0.2em] uppercase text-gray-400">
              Email
            </span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <label className="block font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
            メールアドレス
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-serif text-sm outline-none focus:border-gray-400"
          />

          <label className="block font-display text-[11px] tracking-[0.2em] uppercase text-gray-500 mt-4">
            パスワード
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-serif text-sm outline-none focus:border-gray-400"
          />

          {mode === 'login' ? (
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={loginWithEmail}
                disabled={loading || !supabase}
                className="w-full font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded disabled:opacity-60"
              >
                メールでログイン
              </button>
              <button
                type="button"
                onClick={sendResetEmail}
                disabled={loading || !supabase}
                className="w-full font-display text-[11px] tracking-[0.2em] uppercase text-gray-500 hover:text-textMain transition-colors"
              >
                パスワードを忘れた方はこちら
              </button>
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={signupWithEmail}
                disabled={loading || !supabase}
                className="w-full font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded disabled:opacity-60"
              >
                メールで新規登録
              </button>
              <p className="font-serif text-xs text-gray-500 leading-relaxed">
                登録後、確認メールをお送りします（設定によっては認証が必要です）。
              </p>
            </div>
          )}
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

