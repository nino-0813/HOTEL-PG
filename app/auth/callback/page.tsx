import { redirect } from 'next/navigation';

/** OAuth コールバックは使用しない。直接アクセス時はトップへ。 */
export default function AuthCallbackPage() {
  redirect('/');
}
