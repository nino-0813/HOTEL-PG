import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ROOMS, type RoomSlug } from '@/lib/room-data';

function yen(n: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n);
}

function mapHref(address: string, label?: string) {
  const q = encodeURIComponent(label ? `${label} ${address}` : address);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function rakutenHref(checkoutRoom: string) {
  if (checkoutRoom === 'pg1') return 'https://vacation-stay.jp/listings/917598';
  if (checkoutRoom === 'pg2_single') return 'https://vacation-stay.jp/listings/1138330';
  if (checkoutRoom === 'pg2_family') return 'https://vacation-stay.jp/listings/1138335';
  return 'https://vacation-stay.jp/';
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room: roomParam } = await params;
  const slug = roomParam as RoomSlug;
  const room = ROOMS[slug];
  if (!room) return notFound();

  return (
    <main className="min-h-screen bg-background">
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <a
            href="/#reservation"
            className="inline-flex items-center gap-2 font-display text-[11px] tracking-[0.2em] uppercase text-gray-500 hover:text-textMain transition-colors"
          >
            ← 予約一覧へ戻る
          </a>

          {/* Hero photos */}
          <div className="mt-8">
            {/* Mobile: horizontal swipe */}
            <div className="sm:hidden -mx-4 px-4 overflow-x-auto">
              <div className="flex gap-3 snap-x snap-mandatory">
                {room.images.map((src, i) => {
                  const isHero = i === 0;
                  return (
                    <div
                      key={src}
                      className={[
                        'relative snap-start shrink-0 bg-gray-100 overflow-hidden rounded-xl border border-gray-100',
                        isHero ? 'w-[88%] aspect-[16/10]' : 'w-[78%] aspect-[4/3]',
                      ].join(' ')}
                    >
                      <Image
                        src={src}
                        alt={room.name}
                        fill
                        sizes="90vw"
                        className="object-cover"
                        priority={isHero}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* sm+ : collage grid */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
              {room.images.map((src, i) => {
                const isHero = i === 0;
                return (
                  <div
                    key={src}
                    className={[
                      'relative bg-gray-100 overflow-hidden rounded-xl border border-gray-100',
                      isHero ? 'aspect-[16/11] col-span-2 lg:col-span-2 lg:row-span-2' : 'aspect-[4/3]',
                    ].join(' ')}
                  >
                    <Image
                      src={src}
                      alt={room.name}
                      fill
                      sizes={isHero ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                      className="object-cover"
                      priority={isHero}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain tracking-[0.08em]">
                {room.name}
              </h1>
              <p className="font-serif text-sm sm:text-base text-textLight mt-3 leading-relaxed">
                {room.subtitle}
              </p>

              <div className="mt-6">
                <a
                  href={rakutenHref(room.checkoutRoom)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-textMain px-8 py-4 font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white hover:bg-textLight transition-colors duration-300"
                >
                  楽天で予約をする
                </a>
              </div>

              <div className="mt-8 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center rounded-md bg-gray-900 px-2.5 py-1 font-display text-[10px] tracking-[0.18em] uppercase text-white">
                      ホテル
                    </div>
                    <div className="mt-3 font-display text-2xl sm:text-3xl font-light text-textMain tracking-[0.08em]">
                      {room.subtitle}
                    </div>
                    <div className="mt-2 font-display text-sm tracking-[0.12em] uppercase text-gray-600">
                      {room.name}
                    </div>
                    <div className="mt-2 font-serif text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-gray-400">〒</span>
                        {room.address}
                      </span>
                      <a
                        className="ml-2 underline underline-offset-2 hover:opacity-80"
                        href={mapHref(room.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        地図で表示
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">
                        チェックイン
                      </div>
                      <div className="font-serif text-sm text-textMain mt-2">{room.checkin}</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">
                        チェックアウト
                      </div>
                      <div className="font-serif text-sm text-textMain mt-2">{room.checkout}</div>
                    </div>
                  </div>
                </div>

                {room.facts?.length ? (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {room.facts.map((f) => (
                      <div key={f.label} className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">{f.label}</div>
                        <div className="font-serif text-sm text-textMain mt-2">{f.value}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {room.plan?.description?.length ? (
                  <div className="mt-8">
                    {room.plan.title ? (
                      <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                        {room.plan.title}
                      </div>
                    ) : null}
                    <div className="mt-3 space-y-2">
                      {room.plan.description.map((p) => (
                        <p key={p} className="font-serif text-sm text-textMain leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {room.about?.length ? (
                  <div className="mt-10">
                    <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                      この宿泊施設について
                    </div>
                    <div className="mt-3 space-y-2">
                      {room.about.map((p) => (
                        <p key={p} className="font-serif text-sm text-textMain leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {room.notes?.length ? (
                  <div className="mt-10">
                    <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                      注意点
                    </div>
                    <ul className="mt-3 space-y-2">
                      {room.notes.map((p) => (
                        <li key={p} className="font-serif text-sm text-textMain leading-relaxed">
                          - {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                      料金（目安）
                    </div>
                    <div className="font-serif text-sm text-textMain mt-2">
                      平日 {yen(room.priceSummary.weekday)} / 週末 {yen(room.priceSummary.weekend)}
                    </div>
                    <div className="font-serif text-xs text-gray-500 mt-2 leading-relaxed">
                      週末適用: {room.priceSummary.weekendRule}
                      {room.priceSummary.extraPerson ? ` / 追加: ${room.priceSummary.extraPerson}` : ''}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                      お問い合わせ
                    </div>
                    <div className="font-serif text-sm text-textMain mt-2">
                      <a
                        className="underline underline-offset-2 hover:opacity-80"
                        href={`tel:${room.phone.split('-').join('')}`}
                      >
                        {room.phone}
                      </a>
                    </div>
                    <div className="font-serif text-xs text-gray-500 mt-2">{room.parking}</div>
                  </div>
                </div>

                {room.bedTypes?.length ? (
                  <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                      ベッドタイプ
                    </div>
                    <ul className="mt-3 space-y-2">
                      {room.bedTypes.map((b) => (
                        <li key={b} className="font-serif text-sm text-textMain">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
                  <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                    設備・アメニティ
                  </div>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {room.amenities.map((a) => (
                      <li key={a} className="font-serif text-sm text-textMain">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                {room.cancellationPolicy?.length ? (
                  <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                      キャンセルポリシー
                    </div>
                    <ul className="mt-3 space-y-2">
                      {room.cancellationPolicy.map((c) => (
                        <li key={c} className="font-serif text-sm text-textMain">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {room.houseRules?.length ? (
                  <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                      ハウスルール
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {room.houseRules.map((r) => (
                        <div key={r.label} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                          <div className="font-serif text-sm text-gray-600">{r.label}</div>
                          <div className="font-serif text-sm text-textMain font-semibold">{r.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

