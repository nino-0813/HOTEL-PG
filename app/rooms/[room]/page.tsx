import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ROOMS, type RoomSlug } from '@/lib/room-data';

function yen(n: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n);
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

          <div className="mt-8 flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="lg:flex-1">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain tracking-[0.08em]">
                {room.name}
              </h1>
              <p className="font-serif text-sm sm:text-base text-textLight mt-3 leading-relaxed">
                {room.subtitle}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-5">
                  <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                    住所
                  </div>
                  <div className="font-serif text-sm text-textMain mt-2">{room.address}</div>
                </div>
                <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-5">
                  <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                    チェックイン / アウト
                  </div>
                  <div className="font-serif text-sm text-textMain mt-2">
                    {room.checkin} / {room.checkout}
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-5">
                  <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                    料金（目安）
                  </div>
                  <div className="font-serif text-sm text-textMain mt-2">
                    平日 {yen(room.priceSummary.weekday)} / 週末 {yen(room.priceSummary.weekend)}
                  </div>
                  <div className="font-serif text-xs text-gray-500 mt-1">
                    週末適用: {room.priceSummary.weekendRule}
                    {room.priceSummary.extraPerson ? ` / 追加: ${room.priceSummary.extraPerson}` : ''}
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-5">
                  <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                    お問い合わせ
                  </div>
                  <div className="font-serif text-sm text-textMain mt-2">
                    <a className="underline underline-offset-2 hover:opacity-80" href={`tel:${room.phone.split('-').join('')}`}>
                      {room.phone}
                    </a>
                  </div>
                  <div className="font-serif text-xs text-gray-500 mt-1">{room.parking}</div>
                </div>
              </div>

              <div className="mt-10 bg-white/90 backdrop-blur border border-gray-200 rounded-xl p-6">
                <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                  設備・アメニティ
                </div>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {room.amenities.map((a) => (
                    <li key={a} className="font-serif text-sm text-textMain">
                      - {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:w-[420px] lg:flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <a
                  href={`/auth?next=${encodeURIComponent(`/checkout?room=${room.checkoutRoom}`)}`}
                  className="block w-full text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
                >
                  決済して予約へ進む →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <h2 className="font-display text-xl sm:text-2xl font-light text-textMain tracking-[0.08em]">
            Photos
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {room.images.map((src, i) => {
              const isHero = i === 0;
              return (
                <div
                  key={src}
                  className={[
                    'relative bg-gray-100 overflow-hidden rounded-xl border border-gray-100',
                    isHero ? 'aspect-[16/10] sm:aspect-[16/11] sm:col-span-2 lg:col-span-2 lg:row-span-2' : 'aspect-[4/3]',
                  ].join(' ')}
                >
                  <Image
                    src={src}
                    alt={room.name}
                    fill
                    sizes={isHero ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                    className="object-cover hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

