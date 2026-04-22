import { AuthGate } from '@/components/AuthGate';

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const nextPath = sp?.next ?? '/checkout';
  return <AuthGate nextPath={nextPath} title="Account" />;
}

