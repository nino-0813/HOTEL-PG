'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ROOM_PRICING, calculatePrice, clampGuests, type RoomKey as PricingRoomKey } from '@/lib/pricing';

const JP_WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

function toDate(d: string): Date {
  const [y, m, day] = d.split('-').map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y, m - 1, day));
}

function toDateStr(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function addMonths(d: Date, delta: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1));
}

function daysInMonth(d: Date): number {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
}

function yen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })
    .format(amount)
    .replace('￥', '¥');
}

export function RoomBookingCalendar({
  roomKey,
  nextPath,
}: {
  roomKey: string;
  nextPath: string; // e.g. /checkout?room=pg1
}) {
  const [dayCounts, setDayCounts] = useState<Record<string, number>>({});
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const visibleRange = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const dim = daysInMonth(viewMonth);
    const firstDow = first.getUTCDay();
    const gridStart = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1 - firstDow));
    const cells = firstDow + dim;
    const weeks = Math.ceil(cells / 7);
    const gridEndExclusive = new Date(Date.UTC(gridStart.getUTCFullYear(), gridStart.getUTCMonth(), gridStart.getUTCDate() + weeks * 7));
    return { start: toDateStr(gridStart), end: toDateStr(gridEndExclusive) };
  }, [viewMonth]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/availability?room=${encodeURIComponent(roomKey)}&start=${encodeURIComponent(visibleRange.start)}&end=${encodeURIComponent(visibleRange.end)}`,
          { cache: 'no-store' },
        );
        const json = await res.json();
        if (!mounted) return;
        setDayCounts((json?.days ?? {}) as Record<string, number>);
      } catch {
        // ignore (calendar still usable without sync)
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [roomKey, visibleRange.start, visibleRange.end]);

  const pricingRoomKey = roomKey as PricingRoomKey;
  const maxGuests = ROOM_PRICING[pricingRoomKey]?.maxGuests ?? 1;
  const isSingleFixed = pricingRoomKey === 'pg2_single';

  useEffect(() => {
    // reset to defaults per room
    setAdults(1);
    setChildren(0);
    setInfants(0);
  }, [roomKey]);

  const capacity = useMemo(() => {
    // 楽天側カレンダーに合わせた「在庫数」表示用（必要に応じて調整）
    if (roomKey === 'pg2_single') return 3;
    if (roomKey === 'pg2_family') return 3;
    return 3;
  }, [roomKey]);

  const priceForDate = useMemo(() => {
    const meta: Record<string, { weekday: number; weekend: number; weekendDays: Set<number> }> = {
      pg1: { weekday: 8000, weekend: 8000, weekendDays: new Set([0, 5, 6]) }, // 日・金・土
      pg2_single: { weekday: 8000, weekend: 12000, weekendDays: new Set([5, 6]) }, // 金・土
      pg2_family: { weekday: 14000, weekend: 18000, weekendDays: new Set([5, 6]) }, // 金・土
    };
    const m = meta[roomKey];
    return (dow: number) => {
      if (!m) return null;
      return m.weekendDays.has(dow) ? m.weekend : m.weekday;
    };
  }, [roomKey]);

  const blockedDay = useMemo(() => {
    return (dateStr: string) => {
      const booked = dayCounts[dateStr] ?? 0;
      return booked >= capacity;
    };
  }, [dayCounts, capacity]);

  const blocked = useMemo(() => {
    if (!checkin || !checkout) return false;
    if (checkin >= checkout) return true;
    // if any day in selection is blocked, treat blocked
    const s = toDate(checkin);
    const e = toDate(checkout);
    for (let d = new Date(s); d.getTime() < e.getTime(); d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))) {
      if (blockedDay(toDateStr(d))) return true;
    }
    return false;
  }, [checkin, checkout, blockedDay]);

  const selectionBlocked = useMemo(() => {
    if (!checkin || !checkout) return false;
    // check any day inside is blocked
    const s = toDate(checkin);
    const e = toDate(checkout);
    for (let d = new Date(s); d.getTime() < e.getTime(); d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1))) {
      if (blockedDay(toDateStr(d))) return true;
    }
    return false;
  }, [checkin, checkout, blockedDay]);

  const clamped = useMemo(() => {
    if (!ROOM_PRICING[pricingRoomKey]) return { adults: 1, children: 0, infants: 0 };
    return clampGuests(pricingRoomKey, adults, children, infants);
  }, [pricingRoomKey, adults, children, infants]);

  useEffect(() => {
    if (clamped.adults !== adults) setAdults(clamped.adults);
    if (clamped.children !== children) setChildren(clamped.children);
    if (clamped.infants !== infants) setInfants(clamped.infants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped.adults, clamped.children, clamped.infants]);

  const price = useMemo(() => {
    if (!ROOM_PRICING[pricingRoomKey]) return null;
    if (!checkin || !checkout) return null;
    return calculatePrice({
      roomKey: pricingRoomKey,
      checkin,
      checkout,
      adults: clamped.adults,
      children: clamped.children,
      infants: clamped.infants,
    });
  }, [pricingRoomKey, checkin, checkout, clamped.adults, clamped.children, clamped.infants]);

  const ctaHref = useMemo(() => {
    const url = new URL(`/auth`, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
    const next = new URL(nextPath, url.origin);
    if (checkin) next.searchParams.set('checkin', checkin);
    if (checkout) next.searchParams.set('checkout', checkout);
    next.searchParams.set('adults', String(clamped.adults));
    next.searchParams.set('children', String(clamped.children));
    next.searchParams.set('infants', String(clamped.infants));
    url.searchParams.set('next', next.pathname + next.search);
    return url.pathname + url.search;
  }, [nextPath, checkin, checkout, clamped.adults, clamped.children, clamped.infants]);

  const monthTitle = useMemo(() => {
    const y = viewMonth.getUTCFullYear();
    const m = viewMonth.getUTCMonth() + 1;
    return `${m}月 ${y}`;
  }, [viewMonth]);

  const monthGrid = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const dim = daysInMonth(viewMonth);
    const firstDow = first.getUTCDay(); // 0=Sun
    const cells: Array<{ date: Date | null; dateStr: string | null }> = [];
    for (let i = 0; i < firstDow; i++) cells.push({ date: null, dateStr: null });
    for (let day = 1; day <= dim; day++) {
      const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), day));
      cells.push({ date: d, dateStr: toDateStr(d) });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, dateStr: null });
    return cells;
  }, [viewMonth]);

  const onPickDay = (dateStr: string) => {
    // 1st click => checkin, 2nd click => checkout
    if (blockedDay(dateStr)) return;
    if (!checkin || (checkin && checkout)) {
      setCheckin(dateStr);
      setCheckout('');
      return;
    }
    if (dateStr <= checkin) {
      setCheckin(dateStr);
      setCheckout('');
      return;
    }
    setCheckout(dateStr);
  };

  const inSelectedRange = (dateStr: string) => {
    if (!checkin) return false;
    if (!checkout) return dateStr === checkin;
    return checkin <= dateStr && dateStr < checkout;
  };

  return (
    <div className="mt-5 w-full max-w-none rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-[11px] tracking-[0.22em] uppercase text-gray-500">空き状況カレンダー</div>
          <div className="font-serif text-[11px] sm:text-xs text-gray-500 mt-1">
            {loading ? '同期中…' : '楽天Oyado/自社予約のブロックを反映'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCheckin('');
              setCheckout('');
              setViewMonth(startOfMonth(new Date()));
            }}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 font-display text-[10px] tracking-[0.18em] uppercase text-gray-600 hover:border-gray-400 transition-colors"
            aria-label="Reset"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 font-display text-[10px] tracking-[0.18em] uppercase text-gray-600 hover:border-gray-400 transition-colors"
            aria-label="Prev month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 font-display text-[10px] tracking-[0.18em] uppercase text-gray-600 hover:border-gray-400 transition-colors"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div className="font-display text-lg sm:text-xl font-light tracking-[0.08em] text-textMain">{monthTitle}</div>
        <div className="font-serif text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
          在庫: {capacity}
        </div>
      </div>

      {!isSingleFixed ? (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">宿泊者人数</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="font-serif text-sm text-gray-600">大人</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdults((v) => Math.max(1, v - 1))}
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  −
                </button>
                <div className="w-10 text-center font-serif text-sm text-textMain">{adults}</div>
                <button
                  type="button"
                  onClick={() => setAdults((v) => Math.min(maxGuests, v + 1))}
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="font-serif text-sm text-gray-600">子供（2-12歳）</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildren((v) => Math.max(0, v - 1))}
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  −
                </button>
                <div className="w-10 text-center font-serif text-sm text-textMain">{children}</div>
                <button
                  type="button"
                  onClick={() => setChildren((v) => Math.min(maxGuests - adults, v + 1))}
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="font-serif text-sm text-gray-600">乳幼児（2歳未満）</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInfants((v) => Math.max(0, v - 1))}
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  −
                </button>
                <div className="w-10 text-center font-serif text-sm text-textMain">{infants}</div>
                <button
                  type="button"
                  onClick={() => setInfants((v) => v + 1)}
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 font-serif text-xs text-gray-500">
            ※ 乳幼児（2歳未満）は無料です。ご予約人数は「大人＋子供」で最大{maxGuests}名までとなります（人数は自動で調整されます）。
          </div>
        </div>
      ) : null}

      {price && checkin && checkout ? (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">料金</div>
          <div className="mt-3 font-serif text-sm text-textMain">
            宿泊料金（税・手数料込）　{yen(price.perNight)} × {price.nights}泊
          </div>
          <div className="mt-3 border-t border-gray-200 pt-3 font-serif text-sm text-textMain font-semibold">
            合計　{yen(price.total)}
          </div>
          <div className="mt-2 font-serif text-[11px] text-gray-500">
            ※ 料金には決済手数料・消費税が含まれます。
          </div>
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-1.5">
        {JP_WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center font-display text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-gray-500 py-1"
          >
            {w}
          </div>
        ))}
        {monthGrid.map((cell, idx) => {
          if (!cell.date || !cell.dateStr) {
            return (
              <div
                key={`e-${idx}`}
                className="h-[56px] sm:h-[72px] rounded-lg bg-gray-50/40 border border-gray-100"
              />
            );
          }
          const ds = cell.dateStr;
          const booked = dayCounts[ds] ?? 0;
          const available = Math.max(0, capacity - booked);
          const dow = cell.date.getUTCDay();
          const price = priceForDate(dow);
          const isBlocked = available <= 0;
          const isSelected = inSelectedRange(ds);
          const isToday = ds === toDateStr(new Date());
          return (
            <button
              key={ds}
              type="button"
              onClick={() => onPickDay(ds)}
              disabled={isBlocked}
              className={[
                'h-[56px] sm:h-[72px] rounded-lg border text-left px-1.5 py-1.5 sm:px-2 sm:py-2 transition-colors',
                isSelected ? 'border-textMain bg-[#f5f2ea]' : 'border-gray-100 bg-white',
                isBlocked ? 'opacity-55 cursor-not-allowed bg-gray-50' : 'hover:border-gray-300',
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <div
                  className={[
                    'font-display text-[11px] sm:text-xs tracking-[0.08em]',
                    isToday ? 'text-textMain' : 'text-gray-700',
                  ].join(' ')}
                >
                  {cell.date.getUTCDate()}
                </div>
                {isToday ? (
                  <span className="hidden sm:inline font-display text-[9px] tracking-[0.18em] uppercase text-gray-500">
                    today
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-[10px] sm:text-[11px] leading-tight">
                <div className="text-gray-700 font-serif whitespace-nowrap">空き: {available}</div>
                {price ? (
                  <div className="hidden sm:block text-gray-500 font-serif whitespace-nowrap">{yen(price)}</div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {checkin && checkout ? (
        <div className="mt-3 font-serif text-xs text-gray-500">
          {selectionBlocked || blocked
            ? 'この期間は予約できません。日付を変更してください。'
            : `日程: ${checkin} 〜 ${checkout}`}
        </div>
      ) : (
        <div className="mt-3 font-serif text-xs text-gray-500">
          {checkin ? 'チェックアウト日を選んでください。' : 'チェックイン日を選んでください。'}
        </div>
      )}

      <a
        href={ctaHref}
        aria-disabled={blocked || selectionBlocked || !checkin || !checkout}
        className={[
          'mt-4 block w-full text-center font-display text-xs tracking-[0.2em] uppercase text-white px-8 py-4 transition-colors duration-300 rounded',
          blocked || selectionBlocked || !checkin || !checkout ? 'bg-gray-300 cursor-not-allowed' : 'bg-textMain hover:bg-textLight',
        ].join(' ')}
        onClick={(e) => {
          if (blocked || selectionBlocked || !checkin || !checkout) e.preventDefault();
        }}
      >
        予約へ進む →
      </a>
    </div>
  );
}

