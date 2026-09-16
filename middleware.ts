import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OLD_HOST = 'my-web.apexleyen2515.workers.dev';
const NEW_BASE = 'https://munecotecnology.uk';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 301 redirect: old workers.dev domain → new custom domain (fix para SEO/canonical)
  if (host === OLD_HOST) {
    return NextResponse.redirect(`${NEW_BASE}${pathname}`, { status: 301 });
  }

  // Skip Next.js internal assets (/_next/*) to avoid redirect loops
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Allow public login page and its assets
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  // Check admin auth only for /admin paths
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-auth');
    if (!token?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Covers all routes so the old-domain redirect fires everywhere
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo\\.png|manifest\\.json).*)'],
};
