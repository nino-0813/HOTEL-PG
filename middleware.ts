import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const MAINTENANCE = process.env.MAINTENANCE_MODE === '1';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Basic auth for admin bookings
  if (pathname.startsWith('/admin/bookings')) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return new NextResponse('ADMIN_PASSWORD is not set', { status: 500 });
    }
    const auth = req.headers.get('authorization') ?? '';
    const [scheme, encoded] = auth.split(' ');
    let ok = false;
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf8');
        const pass = decoded.split(':').slice(1).join(':'); // allow ":" in password
        ok = pass === adminPassword;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      const res = new NextResponse('Unauthorized', { status: 401 });
      res.headers.set('WWW-Authenticate', 'Basic realm="HOTEL PG Admin"');
      return res;
    }
  }

  if (!MAINTENANCE) return NextResponse.next();

  // allow maintenance page itself, Next internals, and public files
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml')
  ) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/maintenance';
  url.search = '';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

