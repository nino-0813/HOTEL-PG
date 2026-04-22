'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type BookingRow = {
  id: string;
  room_key: string;
  checkin_date?: string | null;
  checkout_date?: string | null;
  stripe_session_id: string;
  status: string;
  created_at: string;
};

function roomKeyToLabel(roomKey: string) {
  if (roomKey === 'pg1') return 'HOTEL PG -I-';
  if (roomKey === 'pg2_single') return 'HOTEL PG -II-（シングル）';
  if (roomKey === 'pg2_family') return 'HOTEL PG -II-（ファミリー）';
  return roomKey;
}

function statusToLabel(status: string) {
  if (status === 'paid') return '決済完了';
  return status;
}

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);

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
        return;
      }

      const { data: bookingRows } = await supabase
        .from('bookings')
        .select('id, room_key, checkin_date, checkout_date, stripe_session_id, status, created_at')
        .order('created_at', { ascending: false });
      if (!mounted) return;
      setBookings((bookingRows ?? []) as BookingRow[]);
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

          <div className="mt-8 grid gap-6">
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <div className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
                Bookings
              </div>
              {bookings.length === 0 ? (
                <p className="font-serif text-sm text-textLight mt-3">
                  予約履歴はまだありません。
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-serif text-sm text-textMain">
                            {roomKeyToLabel(b.room_key)}
                          </div>
                          <div className="font-serif text-xs text-gray-500 mt-1">
                            {new Date(b.created_at).toLocaleString('ja-JP')}
                          </div>
                          {b.checkin_date && b.checkout_date ? (
                            <div className="font-serif text-xs text-gray-500 mt-1">
                              日程: {b.checkin_date} 〜 {b.checkout_date}
                            </div>
                          ) : null}
                        </div>
                        <div className="shrink-0">
                          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 font-display text-[10px] tracking-[0.18em] uppercase text-gray-600">
                            {statusToLabel(b.status)}
                          </span>
                        </div>
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer font-display text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-textMain transition-colors">
                          決済ID（控え）
                        </summary>
                        <div className="font-serif text-xs text-gray-500 mt-1 break-all">
                          {b.stripe_session_id}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>

          <div className="grid gap-4">
            <button
              type="button"
              onClick={sendResetEmail}
              disabled={!email}
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded disabled:opacity-60"
            >
              パスワード再設定メールを送る
            </button>

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
      </div>
    </main>
  );
}

