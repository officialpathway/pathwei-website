// src/middleware.ts
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
  // Skip non-page requests
  if (request.nextUrl.pathname.includes('.') || 
      request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Handle root redirect
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  const response = intlMiddleware(request);
  const pathLocale = request.nextUrl.pathname.split('/')[1] || DEFAULT_LOCALE;

  // Track locale usage
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
      path: request.nextUrl.pathname
    }), {
      access: 'public',
      contentType: 'application/json'
    });
  }

  // Handle price A/B testing
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
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Explicitly exclude admin from locale matching
    '/((?!admin).*)'
  ]
};