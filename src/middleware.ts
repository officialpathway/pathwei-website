// src/middleware.ts
import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const PRICE_OPTIONS = [4.99, 7.49, 9.99];
const LOCALES = ['en-US', 'es-ES'];
const DEFAULT_LOCALE = 'en-US';

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});

export default async function middleware(request: NextRequest) {
  // Handle locale cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  const pathLocale = request.nextUrl.pathname.split('/')[1];
  
  // Set locale cookie if not present or doesn't match path
  if (!localeCookie || !LOCALES.includes(localeCookie.value)) {
    const effectiveLocale = LOCALES.includes(pathLocale) 
      ? pathLocale 
      : DEFAULT_LOCALE;
    
    request.cookies.set({
      name: 'NEXT_LOCALE',
      value: effectiveLocale
    });
  }

  // Handle price A/B testing
  const response = intlMiddleware(request);
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

  return response;
}
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