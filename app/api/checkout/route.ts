import Stripe from 'stripe';

type RoomKey = 'pg1' | 'pg2_single' | 'pg2_family';

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

function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const { room } = (await req.json().catch(() => ({}))) as { room?: RoomKey };
    if (!room || !(room in ROOMS)) {
      return Response.json({ error: 'invalid_room' }, { status: 400 });
    }

    const stripe = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia',
    });

    const origin = req.headers.get('origin') ?? 'http://localhost:3003';
    const { name, amountJpy, description } = ROOMS[room];

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
      success_url: `${origin}/checkout/success?room=${room}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?room=${room}`,
      metadata: { room },
    });

    return Response.json({ url: session.url });
  } catch (e) {
    return Response.json(
      { error: 'checkout_failed' },
      { status: 500 },
    );
  }
}

