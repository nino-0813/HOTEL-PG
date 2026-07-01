'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ROOM_PRICING, clampGuests, type RoomKey as PricingRoomKey } from '@/lib/pricing';
import { fetchPublicBookingWindows, advanceMonthsForRoom } from '@/lib/booking-window';

const JP_WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

type SaasAvailabilityDay = {
  date: string;
  availableRooms: number;
  /** SaaS が null を返す日はカレンダーでは「料金未設定」と表示 */
  minPrice: number | null;
  bookable: boolean;
};

type SaasAvailabilityResponse = {
  start?: string;
  days?: number;
  dates?: SaasAvailabilityDay[];
};

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

const SAME_DAY_CUTOFF_HOUR = 18;

/** 日本時間での「今日の日付」と「現在の時」を取得（サーバー/訪問者のタイムゾーンに依存しない） */
function getJstDateAndHour(d: Date): { dateStr: string; hour: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const hourPart = get('hour');
  return {
    dateStr: `${get('year')}-${get('month')}-${get('day')}`,
    hour: hourPart === '24' ? 0 : parseInt(hourPart, 10),
  };
}

/** 当日の18時以降は、当日分の新規予約を締め切る（翌日以降の予約には影響しない） */
function sameDayCutoffDateStr(d: Date): string | null {
  const { dateStr, hour } = getJstDateAndHour(d);
  return hour >= SAME_DAY_CUTOFF_HOUR ? dateStr : null;
}

function gridDayCount(startStr: string, endExclusiveStr: string): number {
  const s = toDate(startStr);
  const e = toDate(endExclusiveStr);
  const n = Math.round((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(1, n);
}

function normalizeSaasDay(row: unknown): SaasAvailabilityDay | null {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  if (typeof r.date !== 'string') return null;
  const availableRooms = Number(r.availableRooms);
  if (!Number.isFinite(availableRooms)) return null;
  let minPrice: number | null = null;
  if (r.minPrice !== null && r.minPrice !== undefined && r.minPrice !== '') {
    const p = Number(r.minPrice);
    minPrice = Number.isFinite(p) ? p : null;
  }
  const bookable = r.bookable === true || r.bookable === 1 || r.bookable === 'true';
  return { date: r.date, availableRooms, minPrice, bookable };
}

/** checkout roomKey → SaaS 公開空室APIの絞り込み（未対応キーは null） */
function saasAvailabilityQueryForRoom(
  roomKey: string,
): { propertyCode: string; roomType: string } | null {
  switch (roomKey) {
    case 'pg1':
      return { propertyCode: 'PG1', roomType: 'standard' };
    case 'pg2_single':
      return { propertyCode: 'PG2', roomType: 'single' };
    case 'pg2_family':
      return { propertyCode: 'PG2', roomType: 'family' };
    case 'pg3_three':
      return { propertyCode: 'PG3', roomType: 'washitsu_modern_3' };
    case 'pg3_four':
      return { propertyCode: 'PG3', roomType: 'washitsu_modern_4' };
    case 'pg3_maisonette':
      return { propertyCode: 'PG3', roomType: 'maisonette_6' };
    default:
      return null;
  }
}

export function RoomBookingCalendar({
  roomKey,
}: {
  roomKey: string;
}) {
  const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, SaasAvailabilityDay>>({});
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [guestCountError, setGuestCountError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const [advanceMonths, setAdvanceMonths] = useState(0);
  const [todayCutoffDateStr, setTodayCutoffDateStr] = useState<string | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

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

  // 部屋ごとの予約受付期間（今日から N ヶ月先まで）。0 は無制限。
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const map = await fetchPublicBookingWindows();
        if (mounted) setAdvanceMonths(advanceMonthsForRoom(map, roomKey));
      } catch {
        if (mounted) setAdvanceMonths(0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [roomKey]);

  // 当日18時以降は当日分の予約を締め切る（日本時間基準）。1分おきに再判定する。
  useEffect(() => {
    const update = () => setTodayCutoffDateStr(sameDayCutoffDateStr(new Date()));
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  /** 受付上限日（この日まで予約可。null は無制限） */
  const maxBookableDateStr = useMemo(() => {
    if (!advanceMonths || advanceMonths <= 0) return null;
    const base = new Date();
    const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + advanceMonths, base.getUTCDate()));
    return toDateStr(d);
  }, [advanceMonths]);

  /** 受付上限日を含む月（これより先の月へはカレンダーを進められない） */
  const maxViewMonthStr = useMemo(
    () => (maxBookableDateStr ? toDateStr(startOfMonth(toDate(maxBookableDateStr))) : null),
    [maxBookableDateStr],
  );

  const apiBase = process.env.NEXT_PUBLIC_AVAILABILITY_API_URL?.trim() ?? '';
  const saasBase = process.env.NEXT_PUBLIC_SAAS_API_BASE_URL?.trim() ?? '';
  const saasQuery = useMemo(() => saasAvailabilityQueryForRoom(roomKey), [roomKey]);
  const pricingRoomKey = roomKey as PricingRoomKey;

  useEffect(() => {
    const paying = adults + children;
    if (pricingRoomKey === 'pg2_family' && paying > 4) {
      setGuestCountError('最大4名までです');
    } else if (pricingRoomKey === 'pg3_three' && paying > 3) {
      setGuestCountError('最大3名までです');
    } else if (pricingRoomKey === 'pg3_four' && paying > 4) {
      setGuestCountError('最大4名までです');
    } else if (pricingRoomKey === 'pg3_maisonette' && paying > 6) {
      setGuestCountError('最大6名までです');
    } else {
      setGuestCountError(null);
    }
  }, [pricingRoomKey, adults, children]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      if (!apiBase || !saasQuery) {
        if (mounted) {
          setAvailabilityByDate({});
          setAvailabilityError('空室情報を取得できませんでした');
          setLoading(false);
        }
        return;
      }
      if (pricingRoomKey === 'pg2_family' && adults + children > 4) {
        if (mounted) {
          setAvailabilityByDate({});
          setAvailabilityError(null);
          setLoading(false);
        }
        return;
      }
      if (pricingRoomKey === 'pg3_three' && adults + children > 3) {
        if (mounted) {
          setAvailabilityByDate({});
          setAvailabilityError(null);
          setLoading(false);
        }
        return;
      }
      if (pricingRoomKey === 'pg3_four' && adults + children > 4) {
        if (mounted) {
          setAvailabilityByDate({});
          setAvailabilityError(null);
          setLoading(false);
        }
        return;
      }
      if (pricingRoomKey === 'pg3_maisonette' && adults + children > 6) {
        if (mounted) {
          setAvailabilityByDate({});
          setAvailabilityError(null);
          setLoading(false);
        }
        return;
      }
      if (!(pricingRoomKey in ROOM_PRICING)) {
        if (mounted) {
          setAvailabilityByDate({});
          setAvailabilityError('空室情報を取得できませんでした');
          setLoading(false);
        }
        return;
      }
      const gridDays = gridDayCount(visibleRange.start, visibleRange.end);
      const days = Math.max(31, gridDays);
      const clampedForApi = clampGuests(
        pricingRoomKey,
        adults,
        children,
        infants,
      );
      if (mounted) setAvailabilityByDate({});
      try {
        let url: URL;
        try {
          url = new URL(apiBase);
        } catch {
          if (mounted) {
            setAvailabilityByDate({});
            setAvailabilityError('空室情報を取得できませんでした');
          }
          return;
        }
        url.searchParams.set('start', visibleRange.start);
        url.searchParams.set('days', String(days));
        url.searchParams.set('adults', String(clampedForApi.adults));
        url.searchParams.set('children', String(clampedForApi.children));
        url.searchParams.set('propertyCode', saasQuery.propertyCode);
        url.searchParams.set('roomType', saasQuery.roomType);

        const urlString = url.toString();
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console -- 開発時のみ: SaaS URL と propertyCode / roomType の付与確認用
          console.log('[RoomBookingCalendar] SaaS availability URL:', urlString);
        }

        const res = await fetch(urlString, { cache: 'no-store' });
        const json: unknown = await res.json().catch(() => null);
        if (!mounted) return;
        if (!res.ok || !json || typeof json !== 'object') {
          setAvailabilityByDate({});
          setAvailabilityError('空室情報を取得できませんでした');
          return;
        }
        const dates = (json as SaasAvailabilityResponse).dates;
        if (!Array.isArray(dates)) {
          setAvailabilityByDate({});
          setAvailabilityError('空室情報を取得できませんでした');
          return;
        }
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console -- 開発時のみ: API レスポンス先頭の確認用
          console.log('[RoomBookingCalendar] dates (first 5):', dates.slice(0, 5));
        }
        const map: Record<string, SaasAvailabilityDay> = {};
        for (const row of dates) {
          const n = normalizeSaasDay(row);
          if (n) map[n.date] = n;
        }
        setAvailabilityByDate(map);
        setAvailabilityError(null);
      } catch {
        if (mounted) {
          setAvailabilityByDate({});
          setAvailabilityError('空室情報を取得できませんでした');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiBase, saasQuery, visibleRange.start, visibleRange.end, pricingRoomKey, adults, children, infants]);

  const maxGuests = ROOM_PRICING[pricingRoomKey]?.maxGuests ?? 1;
  // 人数入力を隠す部屋（現在はなし）。シングルも最大2名のため人数選択を表示する。
  const isSingleFixed = false;

  useEffect(() => {
    // reset to defaults per room
    setAdults(1);
    setChildren(0);
    setInfants(0);
  }, [roomKey]);

  const blockedDay = useMemo(() => {
    return (dateStr: string) => {
      if (guestCountError) return true;
      if (availabilityError) return true;
      if (maxBookableDateStr && dateStr > maxBookableDateStr) return true;
      if (todayCutoffDateStr && dateStr === todayCutoffDateStr) return true;
      const row = availabilityByDate[dateStr];
      if (!row) return true;
      if (!row.bookable) return true;
      if (row.availableRooms <= 0) return true;
      return false;
    };
  }, [availabilityByDate, availabilityError, guestCountError, maxBookableDateStr, todayCutoffDateStr]);

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

  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateFetchFailed, setEstimateFetchFailed] = useState(false);
  const [checkoutEstimate, setCheckoutEstimate] = useState<{
    stripeChargeAmount: number;
    targetRoomNetAmount: number;
    /** 内訳表示: 両方あるときのみ別行にする */
    accommodationTaxAmount?: number;
    onlinePaymentFeeAmount?: number;
  } | null>(null);

  useEffect(() => {
    setCheckoutEstimate(null);
    setEstimateFetchFailed(false);

    if (!saasBase || !saasQuery) {
      setEstimateLoading(false);
      return;
    }
    if (!checkin || !checkout || checkin >= checkout) {
      setEstimateLoading(false);
      return;
    }
    if (guestCountError) {
      setEstimateLoading(false);
      return;
    }
    if (selectionBlocked || blocked) {
      setEstimateLoading(false);
      return;
    }

    setEstimateLoading(true);
    const ac = new AbortController();
    let cancelled = false;

    (async () => {
      setEstimateFetchFailed(false);
      try {
        const url = `${saasBase.replace(/\/$/, '')}/api/public/checkout-estimate`;
        const clampedForApi = clampGuests(pricingRoomKey, adults, children, infants);
        const res = await fetch(url, {
          method: 'POST',
          signal: ac.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyCode: saasQuery.propertyCode,
            roomType: saasQuery.roomType,
            checkInDate: checkin,
            checkOutDate: checkout,
            adults: clampedForApi.adults,
            children: clampedForApi.children,
            infants: clampedForApi.infants,
          }),
        });
        const json: unknown = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !json || typeof json !== 'object') {
          setEstimateFetchFailed(true);
          return;
        }
        const o = json as Record<string, unknown>;
        const num = (v: unknown): number | null => {
          const n = Number(v);
          return Number.isFinite(n) ? n : null;
        };
        const stripeChargeAmount = num(o.stripeChargeAmount);
        const targetRoomNetAmount = num(o.targetRoomNetAmount);
        if (stripeChargeAmount === null || targetRoomNetAmount === null) {
          setEstimateFetchFailed(true);
          return;
        }
        const accommodationTaxAmount = num(o.accommodationTaxAmount);
        const onlinePaymentFeeAmount =
          num(o.onlinePaymentFeeAmount) ?? num(o.online_payment_fee_amount);
        const payload: {
          stripeChargeAmount: number;
          targetRoomNetAmount: number;
          accommodationTaxAmount?: number;
          onlinePaymentFeeAmount?: number;
        } = { stripeChargeAmount, targetRoomNetAmount };
        if (
          accommodationTaxAmount !== null &&
          onlinePaymentFeeAmount !== null
        ) {
          payload.accommodationTaxAmount = accommodationTaxAmount;
          payload.onlinePaymentFeeAmount = onlinePaymentFeeAmount;
        }
        setCheckoutEstimate(payload);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setEstimateFetchFailed(true);
      } finally {
        if (!cancelled) setEstimateLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
      setEstimateLoading(false);
    };
  }, [
    saasBase,
    saasQuery,
    checkin,
    checkout,
    adults,
    children,
    infants,
    pricingRoomKey,
    guestCountError,
    selectionBlocked,
    blocked,
  ]);

  const canSubmitCheckout = useMemo(() => {
    if (checkoutLoading) return false;
    if (guestCountError) return false;
    if (!checkin || !checkout) return false;
    if (checkin >= checkout) return false;
    if (!guestName.trim()) return false;
    if (!guestEmail.trim()) return false;
    return true;
  }, [checkoutLoading, guestCountError, checkin, checkout, guestName, guestEmail]);

  const startCheckout = async () => {
    setCheckoutError(null);

    if (guestCountError) {
      setCheckoutError(guestCountError);
      return;
    }
    if (!checkin || !checkout) {
      setCheckoutError('チェックイン日とチェックアウト日を選択してください');
      return;
    }
    if (checkin >= checkout) {
      setCheckoutError('チェックアウト日はチェックイン日の翌日以降を選択してください');
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setCheckoutError('氏名とメールアドレスは必須です');
      return;
    }
    if (!saasBase || !saasQuery) {
      setCheckoutError('決済ページを作成できませんでした。時間をおいて再度お試しください。');
      return;
    }

    const clampedForApi = clampGuests(pricingRoomKey, adults, children, infants);
    const paying = clampedForApi.adults + clampedForApi.children;
    if (pricingRoomKey === 'pg2_family' && paying > 4) {
      setCheckoutError('最大4名までです');
      return;
    }
    if (pricingRoomKey === 'pg3_three' && paying > 3) {
      setCheckoutError('最大3名までです');
      return;
    }
    if (pricingRoomKey === 'pg3_four' && paying > 4) {
      setCheckoutError('最大4名までです');
      return;
    }
    if (pricingRoomKey === 'pg3_maisonette' && paying > 6) {
      setCheckoutError('最大6名までです');
      return;
    }

    setCheckoutLoading(true);
    try {
      const endpoint = `${saasBase.replace(/\/$/, '')}/api/public/create-checkout-session`;
      const origin = window.location.origin;

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console -- 開発時のみ: checkout API 呼び出し先確認
        console.log('[RoomBookingCalendar] create-checkout-session endpoint:', endpoint);
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyCode: saasQuery.propertyCode,
          roomType: saasQuery.roomType,
          checkInDate: checkin,
          checkOutDate: checkout,
          adults: clampedForApi.adults,
          children: clampedForApi.children,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim() || undefined,
          successUrl: `${origin}/checkout/success`,
          cancelUrl: `${origin}/checkout/cancel`,
        }),
      });

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console -- 開発時のみ: ステータス確認
        console.log('[RoomBookingCalendar] create-checkout-session status:', res.status);
      }

      const data = (await res.json().catch(() => null)) as
        | { checkoutUrl?: string; error?: string; message?: string }
        | null;

      if (res.status === 409) {
        setCheckoutError('選択された日程は満室になりました。別の日程を選択してください。');
        return;
      }
      if (res.status === 400) {
        setCheckoutError(data?.message || data?.error || '入力内容に誤りがあります。');
        return;
      }
      if (!res.ok || !data?.checkoutUrl) {
        setCheckoutError('決済ページを作成できませんでした。時間をおいて再度お試しください。');
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setCheckoutError('決済ページを作成できませんでした。時間をおいて再度お試しください。');
    } finally {
      setCheckoutLoading(false);
    }
  };

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
    return checkin <= dateStr && dateStr <= checkout;
  };

  return (
    <div className="mt-4 w-full max-w-none rounded-xl border border-gray-200 bg-white/90 backdrop-blur p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-sm sm:text-base font-light text-textMain tracking-wide">
            空き状況カレンダー
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
            onClick={() =>
              setViewMonth((m) => {
                const next = addMonths(m, 1);
                if (maxViewMonthStr && toDateStr(next) > maxViewMonthStr) return m;
                return next;
              })
            }
            disabled={!!maxViewMonthStr && toDateStr(viewMonth) >= maxViewMonthStr}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 font-display text-[10px] tracking-[0.18em] uppercase text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="font-display text-lg sm:text-xl font-light tracking-[0.08em] text-textMain">{monthTitle}</div>
      </div>

      {advanceMonths > 0 ? (
        <div className="mt-2 font-serif text-xs text-gray-500">
          現在、{advanceMonths}ヶ月先までご予約いただけます。
        </div>
      ) : null}

      {guestCountError ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-serif text-xs text-red-900">
          {guestCountError}
        </div>
      ) : null}

      {availabilityError ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-serif text-xs text-amber-900">
          {availabilityError}
        </div>
      ) : null}

      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="font-serif text-sm font-medium text-textMain">お客様情報</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="block">
            <div className="font-serif text-xs text-gray-600 mb-1">氏名（必須）</div>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-serif text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="山田太郎"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <div className="font-serif text-xs text-gray-600 mb-1">メールアドレス（必須）</div>
            <input
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              type="email"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-serif text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="test@example.com"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <div className="font-serif text-xs text-gray-600 mb-1">電話番号（任意）</div>
            <input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              type="tel"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-serif text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="09000000000"
              autoComplete="tel"
            />
          </label>
        </div>

        {checkoutError ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-serif text-xs text-amber-900">
            {checkoutError}
          </div>
        ) : null}
      </div>

      {!isSingleFixed ? (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="font-serif text-sm font-medium text-textMain">宿泊者人数</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
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
                  onClick={() =>
                    setAdults((v) => Math.min(maxGuests - children, v + 1))
                  }
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
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
                  onClick={() =>
                    setChildren((v) => Math.min(maxGuests - adults, v + 1))
                  }
                  className="h-8 w-8 rounded-md border border-gray-200 bg-white font-display text-sm text-gray-700 hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
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
            ※ 乳幼児（2歳未満）は無料です。ご予約人数は「大人＋子供」で最大{maxGuests}
            名までとなります（人数は自動で調整されます）。
            {pricingRoomKey === 'pg2_family'
              ? ' ファミリータイプは5名以上のご予約はできません。'
              : pricingRoomKey === 'pg3_three'
                ? ' PG-III 3名タイプは4名以上のご予約はできません。'
                : pricingRoomKey === 'pg3_four'
                  ? ' PG-III 4名タイプは5名以上のご予約はできません。'
                  : ''}
          </div>
        </div>
      ) : null}

      {checkin && checkout && !guestCountError && !selectionBlocked && !blocked ? (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="font-serif text-sm font-medium text-textMain">料金</div>
          {estimateLoading ? (
            <p className="mt-3 font-serif text-sm text-gray-600">料金を計算中...</p>
          ) : estimateFetchFailed ? (
            <p className="mt-3 font-serif text-sm text-amber-900">料金を取得できませんでした</p>
          ) : checkoutEstimate ? (
            <>
              <div className="mt-3 font-serif text-sm text-textMain">
                宿泊料金：{yen(checkoutEstimate.targetRoomNetAmount)}
              </div>
              {checkoutEstimate.accommodationTaxAmount != null &&
              checkoutEstimate.onlinePaymentFeeAmount != null ? (
                <>
                  <div className="mt-2 font-serif text-sm text-textMain">
                    宿泊税：{yen(checkoutEstimate.accommodationTaxAmount)}
                  </div>
                  <div className="mt-2 font-serif text-sm text-textMain">
                    オンライン決済手数料：{yen(checkoutEstimate.onlinePaymentFeeAmount)}
                  </div>
                </>
              ) : (
                <div className="mt-2 font-serif text-sm text-textMain">
                  宿泊税・オンライン決済手数料：
                  {yen(
                    checkoutEstimate.stripeChargeAmount -
                      checkoutEstimate.targetRoomNetAmount,
                  )}
                </div>
              )}
              <div className="mt-2 border-t border-gray-200 pt-3 font-serif text-sm text-textMain font-semibold">
                お支払い合計：{yen(checkoutEstimate.stripeChargeAmount)}
              </div>
              <div className="mt-2 font-serif text-[11px] text-gray-500">
                ※お支払い合計には、宿泊税およびオンライン決済手数料が含まれます。
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {/* 翻訳で曜日(日月火→day/month/fire)や空室表記が伸びてセルが崩れるため、グリッドは翻訳対象外にする */}
      <div className="notranslate mt-3 grid grid-cols-7 gap-1 sm:gap-1.5" translate="no">
        {JP_WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center font-serif text-xs sm:text-sm text-gray-600 py-1.5"
          >
            {w}
          </div>
        ))}
        {monthGrid.map((cell, idx) => {
          if (!cell.date || !cell.dateStr) {
            return (
              <div
                key={`e-${idx}`}
                className="h-[56px] sm:h-[72px] rounded-lg bg-gray-50 border border-gray-100"
              />
            );
          }
          const ds = cell.dateStr;
          const row = availabilityByDate[ds];
          const beyondWindow = !!maxBookableDateStr && ds > maxBookableDateStr;
          const pastCutoff = !!todayCutoffDateStr && ds === todayCutoffDateStr;
          const isBlocked = blockedDay(ds);
          const isSelected = inSelectedRange(ds);
          const isToday = ds === toDateStr(new Date());
          const isFull =
            !row || row.availableRooms <= 0 || !row.bookable;
          const showAvail = !beyondWindow && !pastCutoff && row && row.bookable && row.availableRooms > 0;
          const line1 = beyondWindow
            ? '受付期間外'
            : pastCutoff
              ? '本日受付終了'
              : !row
              ? availabilityError || guestCountError
                ? '—'
                : loading
                  ? '…'
                  : '—'
              : isFull
                ? '満室'
                : `空き: ${row.availableRooms}`;
          const line2 =
            showAvail && row ? (
              <div className="text-gray-500 font-serif whitespace-nowrap text-[9px] sm:text-[11px]">
                {row.minPrice !== null ? yen(row.minPrice) : '料金未設定'}
              </div>
            ) : null;
          return (
            <button
              key={ds}
              type="button"
              onClick={() => onPickDay(ds)}
              disabled={isBlocked}
              className={[
                'h-[56px] sm:h-[72px] rounded-lg border text-left px-1.5 py-1.5 sm:px-2 sm:py-2 transition-colors',
                isSelected ? 'border-textMain bg-[#f5f2ea]' : 'border-gray-200 bg-white',
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
                  <span className="hidden sm:inline font-serif text-[10px] text-gray-500">
                    今日
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-[10px] sm:text-[11px] leading-tight">
                <div className="text-gray-700 font-serif whitespace-nowrap">{line1}</div>
                {line2}
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

      <button
        type="button"
        disabled={!canSubmitCheckout || blocked || selectionBlocked}
        className={[
          'mt-4 block w-full text-center font-serif text-sm font-medium text-white px-8 py-4 transition-colors duration-300 rounded-lg',
          !canSubmitCheckout || blocked || selectionBlocked
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-textMain hover:bg-textLight',
        ].join(' ')}
        onClick={startCheckout}
      >
        {checkoutLoading ? '決済ページを作成中…' : '予約へ進む →'}
      </button>

      {checkoutError ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-serif text-xs text-amber-900">
          {checkoutError}
        </div>
      ) : null}
    </div>
  );
}

