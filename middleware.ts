import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internal assets
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo\\.png|manifest\\.json).*)'],
};
