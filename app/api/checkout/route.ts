import Stripe from 'stripe';
import { ROOM_PRICING, calculatePrice, clampGuests, type RoomKey as PricingRoomKey } from '@/lib/pricing';

type RoomKey = PricingRoomKey;

const ROOMS: Record<RoomKey, { name: string; description: string }> = {
  pg1: { name: ROOM_PRICING.pg1.name, description: '素泊まり' },
  pg2_single: { name: ROOM_PRICING.pg2_single.name, description: '素泊まり' },
  pg2_family: { name: ROOM_PRICING.pg2_family.name, description: '素泊まり' },
};

export async function POST(req: Request) {
  try {
    const { room, checkin, checkout, adults, children, infants } = (await req.json().catch(() => ({}))) as {
      room?: RoomKey;
      checkin?: string;
      checkout?: string;
      adults?: number;
      children?: number;
      infants?: number;
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
    const clamped = clampGuests(room, adults ?? 1, children ?? 0, infants ?? 0);
    const price = checkin && checkout
      ? calculatePrice({
          roomKey: room,
          checkin,
          checkout,
          adults: clamped.adults,
          children: clamped.children,
          infants: clamped.infants,
        })
      : null;
    if (!price) {
      return Response.json({ error: 'missing_dates' }, { status: 400 });
    }
    const amountJpy = price.total;
    const nights = price.nights;

    const qs = new URLSearchParams({ room });
    qs.set('checkin', checkin ?? '');
    qs.set('checkout', checkout ?? '');
    qs.set('adults', String(clamped.adults));
    qs.set('children', String(clamped.children));
    qs.set('infants', String(clamped.infants));
    qs.set('total_price', String(amountJpy));

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
      metadata: {
        room,
        checkin: checkin ?? '',
        checkout: checkout ?? '',
        nights: String(nights),
        adults: String(clamped.adults),
        children: String(clamped.children),
        infants: String(clamped.infants),
        total_price: String(amountJpy),
      },
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

