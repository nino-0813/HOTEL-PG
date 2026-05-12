import { NextResponse } from 'next/server';

/** 旧 Stripe Checkout（サイト直）は廃止。SaaS の create-checkout-session を利用してください。 */
export async function POST() {
  return NextResponse.json(
    { error: 'deprecated', message: 'This checkout API is disabled. Use the room calendar and SaaS checkout.' },
    { status: 410 },
  );
}
