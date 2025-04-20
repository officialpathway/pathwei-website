// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const PRICE_OPTIONS = [4.99, 7.49, 9.99];

const intlMiddleware = createMiddleware({
  locales: ['en-US', 'es-ES'],
  defaultLocale: 'en-US',
  localePrefix: 'as-needed',
});

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Handle price A/B testing
  const priceCookie = request.cookies.get('selected_price');
  if (!priceCookie?.value) {
    const randomIndex = Math.floor(Math.random() * PRICE_OPTIONS.length);
    response.cookies.set({
      name: 'selected_price',
      value: PRICE_OPTIONS[randomIndex].toString(),
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (except track-price)
     * - Static files (_next/static, _next/image, favicon.ico, etc.)
     */
    '/((?!api|_next|.*\\..*).*)'
  ],
};