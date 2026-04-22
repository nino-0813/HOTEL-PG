export type DateRange = { start: string; end: string };

function ymd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function buildIcal(args: { roomLabel: string; events: { uid: string; start: string; end: string }[] }) {
  const lines: string[] = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//HotelPG//Reservation//JP');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');

  for (const ev of args.events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART;VALUE=DATE:${ev.start.split('-').join('')}`);
    lines.push(`DTEND;VALUE=DATE:${ev.end.split('-').join('')}`);
    lines.push('SUMMARY:予約済み');
    lines.push(`UID:${ev.uid}@hotelpg.com`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

export function toAllDayDateYmd(dateStr: string): string {
  // dateStr: YYYY-MM-DD
  const [y, m, d] = dateStr.split('-').map((x) => parseInt(x, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  return ymd(dt);
}

