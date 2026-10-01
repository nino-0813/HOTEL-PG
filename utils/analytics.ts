declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function trackEvent(name: string, params: Record<string, string | number> = {}): void {
  if (window.gtag) {
    window.gtag('event', name, params);
    return;
  }

  // Next.js の画面表示がGA4スクリプトの初期化より先に完了しても、
  // イベントを破棄せず、gtag.jsが読み込まれた時に処理できるようキューへ積む。
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(['event', name, params]);
}

/** 外部予約サイトへ移動した時だけ送信する。 */
export function trackReservationClick(roomSlug: string): void {
  trackEvent('reservation_click', {
    booking_provider: 'rakuten',
    room_slug: roomSlug,
  });
}

/** 客室詳細ページを選んだ時に送信する。 */
export function trackRoomView(roomSlug: string, source: string): void {
  trackEvent('select_room', { room_slug: roomSlug, source });
}

/** サイト内の予約導線を押した時に送信する。 */
export function trackReservationCta(source: string): void {
  trackEvent('reservation_cta_click', { source });
}

/** 入力済みの予約フォームから決済処理を開始した時に送信する。 */
export function trackBeginCheckout(params: {
  roomSlug: string;
  checkin: string;
  checkout: string;
  guests: number;
}): void {
  trackEvent('begin_checkout', {
    room_slug: params.roomSlug,
    checkin_date: params.checkin,
    checkout_date: params.checkout,
    number_of_guests: params.guests,
  });
}

/** Stripe決済後の完了ページで送信する。transaction_idで再送を判別できる。 */
export function trackBookingComplete(transactionId: string, roomSlug: string): void {
  trackEvent('booking_complete', {
    transaction_id: transactionId,
    room_slug: roomSlug,
  });
}
