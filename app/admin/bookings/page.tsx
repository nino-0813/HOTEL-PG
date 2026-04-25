import { getSupabaseServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

type BookingRow = {
  id: string;
  created_at: string;
  room_key: string;
  checkin_date: string | null;
  checkout_date: string | null;
  adults: number | null;
  children: number | null;
  total_price: number | null;
  status: string;
  user_id: string;
};

const ROOM_LABEL: Record<string, string> = {
  pg1: 'PG-I ロフト付き洋室',
  pg2_single: 'PG-II シングル',
  pg2_family: 'PG-II ファミリー',
};

function yen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount).replace('￥', '¥');
}

function todayUtcStr(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  // NOTE: protected by middleware Basic auth (ADMIN_PASSWORD)
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    redirect('/admin');
  }

  const bookingsRes = await supabase
    .from('bookings')
    .select('id, created_at, room_key, checkin_date, checkout_date, adults, children, total_price, status, user_id')
    .order('checkin_date', { ascending: true })
    .limit(500);

  if (bookingsRes.error) {
    return (
      <div className="max-w-3xl">
        <h1 className="font-display text-2xl text-textMain">予約一覧</h1>
        <p className="mt-4 font-serif text-sm text-red-600">取得に失敗しました: {bookingsRes.error.message}</p>
      </div>
    );
  }

  const rows = (bookingsRes.data ?? []) as BookingRow[];
  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  const emailMap = new Map<string, string>();

  await Promise.all(
    userIds.map(async (uid) => {
      try {
        const res = await supabase.auth.admin.getUserById(uid);
        const email = res.data?.user?.email ?? '';
        if (email) emailMap.set(uid, email);
      } catch {
        // ignore
      }
    }),
  );

  const today = todayUtcStr();
  const sorted = [...rows].sort((a, b) => {
    const aPast = (a.checkout_date ?? '') < today;
    const bPast = (b.checkout_date ?? '') < today;
    if (aPast !== bPast) return aPast ? 1 : -1;
    const ac = a.checkin_date ?? '9999-99-99';
    const bc = b.checkin_date ?? '9999-99-99';
    if (ac !== bc) return ac < bc ? -1 : 1;
    return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1;
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-textMain tracking-[0.08em]">予約一覧</h1>
          <p className="mt-2 font-serif text-xs sm:text-sm text-gray-500">
            今後の予約が上に来るよう、チェックイン日順で表示します。
          </p>
        </div>
        <div className="font-serif text-xs text-gray-500 whitespace-nowrap">件数: {sorted.length}</div>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {sorted.map((r) => {
          const isPast = (r.checkout_date ?? '') < today;
          return (
            <div
              key={r.id}
              className={[
                'rounded-xl border border-gray-200 bg-white p-4',
                isPast ? 'opacity-55' : '',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-sm tracking-[0.12em] uppercase text-gray-600">予約日</div>
                  <div className="font-serif text-sm text-textMain mt-1">{r.created_at?.slice(0, 10)}</div>
                </div>
                <div
                  className={[
                    'font-display text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full border',
                    r.status === 'paid' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-gray-200 text-gray-600 bg-gray-50',
                  ].join(' ')}
                >
                  {r.status}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">部屋</div>
                  <div className="font-serif text-sm text-textMain mt-1">{ROOM_LABEL[r.room_key] ?? r.room_key}</div>
                </div>
                <div>
                  <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">料金</div>
                  <div className="font-serif text-sm text-textMain mt-1">
                    {typeof r.total_price === 'number' ? yen(r.total_price) : '-'}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">日程</div>
                  <div className="font-serif text-sm text-textMain mt-1">
                    {(r.checkin_date ?? '-') + ' 〜 ' + (r.checkout_date ?? '-')}
                  </div>
                </div>
                <div>
                  <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">人数</div>
                  <div className="font-serif text-sm text-textMain mt-1">
                    大人{r.adults ?? 0} / 子供{r.children ?? 0}
                  </div>
                </div>
                <div>
                  <div className="font-display text-[10px] tracking-[0.18em] uppercase text-gray-500">メール</div>
                  <div className="font-serif text-sm text-textMain mt-1 break-all">
                    {emailMap.get(r.user_id) ?? '-'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="mt-6 hidden md:block rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="px-4 py-3 font-display text-[10px] tracking-[0.18em] uppercase">予約日</th>
                <th className="px-4 py-3 font-display text-[10px] tracking-[0.18em] uppercase">部屋名</th>
                <th className="px-4 py-3 font-display text-[10px] tracking-[0.18em] uppercase">チェックイン / アウト</th>
                <th className="px-4 py-3 font-display text-[10px] tracking-[0.18em] uppercase">人数</th>
                <th className="px-4 py-3 font-display text-[10px] tracking-[0.18em] uppercase">料金</th>
                <th className="px-4 py-3 font-display text-[10px] tracking-[0.18em] uppercase">ステータス</th>
                <th className="px-4 py-3 font-display text-[10px] tracking-[0.18em] uppercase">メール</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const isPast = (r.checkout_date ?? '') < today;
                return (
                  <tr key={r.id} className={['border-t border-gray-100', isPast ? 'opacity-55' : ''].join(' ')}>
                    <td className="px-4 py-3 font-serif text-sm text-textMain whitespace-nowrap">
                      {r.created_at?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-textMain whitespace-nowrap">
                      {ROOM_LABEL[r.room_key] ?? r.room_key}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-textMain whitespace-nowrap">
                      {(r.checkin_date ?? '-') + ' 〜 ' + (r.checkout_date ?? '-')}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-textMain whitespace-nowrap">
                      大人{r.adults ?? 0} / 子供{r.children ?? 0}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-textMain whitespace-nowrap">
                      {typeof r.total_price === 'number' ? yen(r.total_price) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={[
                          'inline-flex items-center rounded-full border px-2.5 py-1 font-display text-[10px] tracking-[0.18em] uppercase',
                          r.status === 'paid'
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                            : 'border-gray-200 text-gray-600 bg-gray-50',
                        ].join(' ')}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-textMain break-all">
                      {emailMap.get(r.user_id) ?? '-'}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center font-serif text-sm text-gray-500">
                    予約がありません。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

