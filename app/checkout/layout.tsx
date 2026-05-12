import { Suspense, type ReactNode } from 'react';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl">
            <p className="font-serif text-sm text-gray-500">読み込み中…</p>
          </div>
        </main>
      }
    >
      {children}
    </Suspense>
  );
}
