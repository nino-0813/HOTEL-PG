export const ROOM_PRICING = {
  pg1: {
    name: 'HOTEL PG -I-【素泊まり】ロフト付き洋室',
    maxGuests: 2,
    baseGuests: 1,
    basePrice: 8000,
    weekendPrice: 8000,
    weekendDays: [0, 5, 6] as const, // Sun, Fri, Sat
    extraPerPerson: 5000,
    cleaningFee: 0,
  },
  pg2_single: {
    name: 'HOTEL PG -II- シングルタイプ',
    maxGuests: 1,
    baseGuests: 1,
    basePrice: 8000,
    weekendPrice: 12000,
    weekendDays: [5, 6] as const, // Fri, Sat
    extraPerPerson: 0,
    cleaningFee: 0,
  },
  pg2_family: {
    name: 'HOTEL PG -II- ファミリータイプ',
    maxGuests: 4,
    baseGuests: 2,
    basePrice: 14000,
    weekendPrice: 18000,
    weekendDays: [5, 6] as const, // Fri, Sat
    extraPerPerson: 5000,
    cleaningFee: 0,
  },
} as const;

export type RoomKey = keyof typeof ROOM_PRICING;

const MARKUP_RATE = 0.056;

export const ROOM_INVENTORY: Record<RoomKey, number> = {
  pg1: 3,
  pg2_single: 1,
  pg2_family: 3,
};

function toUtcDate(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y, m - 1, d));
}

function addDaysUtc(d: Date, days: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));
}

export function clampGuests(roomKey: RoomKey, adults: number, children: number, infants: number) {
  const room = ROOM_PRICING[roomKey];
  const a = Math.max(1, Math.min(room.maxGuests, adults));
  const c = Math.max(0, Math.min(room.maxGuests - a, children));
  const i = Math.max(0, infants);
  return { adults: a, children: c, infants: i };
}

export function calculatePrice(args: {
  roomKey: RoomKey;
  checkin: string;
  checkout: string;
  adults: number;
  children?: number;
  infants?: number;
}): { perNight: number; nights: number; subtotal: number; total: number } | null {
  const room = ROOM_PRICING[args.roomKey];
  const children = args.children ?? 0;
  const infants = args.infants ?? 0;
  const { adults, children: clampedChildren } = clampGuests(args.roomKey, args.adults, children, infants);
  const totalGuests = adults + clampedChildren;

  const ci = toUtcDate(args.checkin);
  const co = toUtcDate(args.checkout);
  if (!ci || !co || ci.getTime() >= co.getTime()) return null;

  let total = 0;
  let nights = 0;
  for (let d = new Date(ci); d.getTime() < co.getTime(); d = addDaysUtc(d, 1)) {
    const dayOfWeek = d.getUTCDay();
    const isWeekend = (room.weekendDays as readonly number[]).includes(dayOfWeek);
    let nightPrice = isWeekend ? room.weekendPrice : room.basePrice;
    const extraGuests = Math.max(0, totalGuests - room.baseGuests);
    nightPrice += extraGuests * room.extraPerPerson;
    total += nightPrice;
    nights += 1;
    if (nights > 30) break;
  }

  const subtotal = total + room.cleaningFee;
  const grandTotal = Math.ceil(subtotal * (1 + MARKUP_RATE));
  return {
    perNight: Math.round(grandTotal / Math.max(1, nights)),
    nights: Math.max(1, nights),
    subtotal,
    total: grandTotal,
  };
}

