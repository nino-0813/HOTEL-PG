import * as holidayJp from '@holiday-jp/holiday_jp';

const holidays: Record<string, { name: string }> = holidayJp.holidays;

/** ISO日付をUTCで扱い、閲覧端末のタイムゾーンで曜日をずらさない。 */
export function calendarDayInfo(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const weekday = date.getUTCDay();
  const holiday = holidays[dateStr]?.name;
  const isDayOff = (offset: number) => {
    const d = new Date(date.getTime() + offset * 86400000);
    return d.getUTCDay() === 0 || d.getUTCDay() === 6 || !!holidays[d.toISOString().slice(0, 10)];
  };
  const longWeekend = isDayOff(0) && (
    (isDayOff(-2) && isDayOff(-1)) ||
    (isDayOff(-1) && isDayOff(1)) ||
    (isDayOff(1) && isDayOff(2))
  );
  return { weekday, holiday, longWeekend };
}
