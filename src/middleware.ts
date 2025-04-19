// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const PRICE_OPTIONS = [4.99, 7.49, 9.99];
const locales = ['en', 'es'];
const defaultLocale = 'en';

export async function middleware(request: NextRequest) {
  // Handle locale detection first
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  let response;
  let locale = defaultLocale;

  if (pathnameIsMissingLocale) {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' };
    const languages = new Negotiator({ headers }).languages();
    locale = match(languages, locales, defaultLocale);
    response = NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  } else {
    response = NextResponse.next();
    // Extract locale from pathname for cookie setting
    const maybeLocale = pathname.split('/')[1];
    locale = locales.includes(maybeLocale) ? maybeLocale : defaultLocale;
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
  } else if (pathnameIsMissingLocale) {
    // Preserve existing cookie during redirect
    response.cookies.set(priceCookie);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (except track-price)
     * - Static files (_next/static, _next/image, favicon.ico, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};