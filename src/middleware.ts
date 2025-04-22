import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { put } from '@vercel/blob';

const PRICE_OPTIONS = [4.99, 7.49, 9.99];
const LOCALES = ['en', 'es'];
const DEFAULT_LOCALE = 'en';

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;


  // 2. Skip non-page requests (existing logic)
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // 3. Handle root redirect (existing logic)
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  const response = intlMiddleware(request);
  const pathLocale = pathname.split('/')[1] || DEFAULT_LOCALE;

  // 4. Track locale usage (existing logic)
  if (LOCALES.includes(pathLocale)) {
    const timestamp = new Date().toISOString();
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const blobKey = `locale-tracking/${timestamp}-${Math.random().toString(36).substring(7)}`;
    
    await put(blobKey, JSON.stringify({
      locale: pathLocale,
      timestamp,
      ip,
      userAgent,
      path: pathname
    }), {
      access: 'public',
      contentType: 'application/json'
    });
  }

  // 5. Handle price A/B testing (existing logic)
  const priceCookie = request.cookies.get('selected_price');
  if (!priceCookie?.value) {
    const randomIndex = Math.floor(Math.random() * PRICE_OPTIONS.length);
    response.cookies.set({
      name: 'selected_price',
      value: PRICE_OPTIONS[randomIndex].toString(),
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Include both existing matchers and admin API routes
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/api/admin/:path*',
    '/((?!admin).*)'
  ]
};