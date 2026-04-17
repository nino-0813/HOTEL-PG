declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** 予約ボタンクリックを GA4 に送信（イベント名: reservation_click） */
export function trackReservationClick(label: string): void {
  window.gtag?.('event', 'reservation_click', {
    event_category: 'engagement',
    event_label: label,
  });
}
