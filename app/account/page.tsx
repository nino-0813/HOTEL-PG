'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    return typeof window !== 'undefined'
      ? new URL('/auth/callback?next=/account', window.location.origin).toString()
      : '';
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) {
        setStatus('Supabase が未設定です。環境変数をご確認ください。');
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const userEmail = data.session?.user?.email ?? null;
      setEmail(userEmail);
      setLoading(false);
      if (!data.session) {
        window.location.href = `/auth?next=${encodeURIComponent('/account')}`;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sendResetEmail = async () => {
    if (!supabase || !email) return;
    setStatus(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setStatus('再設定メールの送信に失敗しました。時間をおいてお試しください。');
      return;
    }
    setStatus('パスワード再設定メールを送信しました。メールをご確認ください。');
  };

  const updatePassword = async () => {
    if (!supabase) return;
    if (!newPassword || newPassword.length < 8) {
      setStatus('パスワードは8文字以上で入力してください。');
      return;
    }
    setStatus(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setStatus('パスワード更新に失敗しました。時間をおいてお試しください。');
      return;
    }
    setNewPassword('');
    setStatus('パスワードを更新しました。');
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain mb-10 hover:opacity-70 transition-opacity"
        >
          ← トップへ
        </Link>

        <h1 className="font-display text-3xl sm:text-4xl font-light text-textMain tracking-[0.08em]">
          My page
        </h1>
        <p className="font-serif text-sm text-textLight mt-3 leading-relaxed">
          アカウント情報と、ログイン・パスワード関連の操作ができます。
        </p>

        <div className="mt-8 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
            Account
          </div>
          <div className="font-serif text-sm text-textMain mt-3">
            {loading ? '読み込み中…' : `ログインメール：${email ?? '-'}`}
          </div>

          {status ? (
            <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="font-serif text-sm text-textMain leading-relaxed">
                {status}
              </p>
            </div>
          ) : null}

          <div className="mt-8 grid gap-4">
            <button
              type="button"
              onClick={sendResetEmail}
              disabled={!email}
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded disabled:opacity-60"
            >
              パスワード再設定メールを送る
            </button>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
                Change password
              </div>
              <label className="block font-display text-[11px] tracking-[0.2em] uppercase text-gray-500 mt-4">
                New password
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 font-serif text-sm outline-none focus:border-gray-400"
              />
              <button
                type="button"
                onClick={updatePassword}
                className="mt-4 w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
              >
                パスワードを更新
              </button>
              <p className="font-serif text-xs text-gray-500 mt-3">
                ※ パスワード再設定メールからアクセスした場合も、この画面で更新できます。
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-gray-900 px-8 py-4 hover:bg-black transition-colors duration-300 rounded"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

