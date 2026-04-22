import Stripe from 'stripe';

type RoomKey = 'pg1' | 'pg2_single' | 'pg2_family';

const PRICE_RULES: Record<RoomKey, { weekday: number; weekend: number; weekendDays: Set<number> }> = {
  pg1: { weekday: 8000, weekend: 8000, weekendDays: new Set([0, 5, 6]) }, // 日・金・土
  pg2_single: { weekday: 8000, weekend: 12000, weekendDays: new Set([5, 6]) }, // 金・土
  pg2_family: { weekday: 14000, weekend: 18000, weekendDays: new Set([5, 6]) }, // 金・土
};

const ROOMS: Record<
  RoomKey,
  { name: string; amountJpy: number; description: string }
> = {
  pg1: {
    name: 'HOTEL PG -I-（ロフト付き洋室）',
    amountJpy: 8000,
    description: '素泊まり / 1泊（目安）',
  },
  pg2_single: {
    name: 'HOTEL PG -II-（シングルタイプ）',
    amountJpy: 8000,
    description: '素泊まり / 1泊（平日料金・目安）',
  },
  pg2_family: {
    name: 'HOTEL PG -II-（ファミリータイプ）',
    amountJpy: 14000,
    description: '素泊まり / 1泊（平日料金・目安）',
  },
};

function toUtcDate(dateStr: string): Date | null {
  // dateStr: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y, m - 1, d));
}

function addDaysUtc(d: Date, days: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));
}

function calcAmountJpy(room: RoomKey, checkin?: string, checkout?: string): { amount: number; nights: number } {
  const ci = checkin ? toUtcDate(checkin) : null;
  const co = checkout ? toUtcDate(checkout) : null;
  if (!ci || !co) return { amount: ROOMS[room].amountJpy, nights: 1 };
  if (ci.getTime() >= co.getTime()) return { amount: ROOMS[room].amountJpy, nights: 1 };

  const rule = PRICE_RULES[room];
  let nights = 0;
  let total = 0;
  for (let d = new Date(ci); d.getTime() < co.getTime(); d = addDaysUtc(d, 1)) {
    const dow = d.getUTCDay();
    total += rule.weekendDays.has(dow) ? rule.weekend : rule.weekday;
    nights += 1;
    if (nights > 30) break; // safety
  }
  return { amount: Math.max(ROOMS[room].amountJpy, total), nights: Math.max(1, nights) };
}

export async function POST(req: Request) {
  try {
    const { room, checkin, checkout } = (await req.json().catch(() => ({}))) as {
      room?: RoomKey;
      checkin?: string;
      checkout?: string;
    };
    if (!room || !(room in ROOMS)) {
      return Response.json({ error: 'invalid_room' }, { status: 400 });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return Response.json({ error: 'missing_stripe_secret_key' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2026-03-25.dahlia',
    });

    const origin = req.headers.get('origin') ?? 'http://localhost:3003';
    const { name, description } = ROOMS[room];
    const { amount: amountJpy, nights } = calcAmountJpy(room, checkin, checkout);

    const qs = new URLSearchParams({ room });
    if (checkin) qs.set('checkin', checkin);
    if (checkout) qs.set('checkout', checkout);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name,
              description,
            },
            unit_amount: amountJpy,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?${qs.toString()}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?room=${room}`,
      metadata: { room, checkin: checkin ?? '', checkout: checkout ?? '', nights: String(nights) },
    });

    return Response.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: 'checkout_failed' },
      { status: 500 },
    );
  }
}

