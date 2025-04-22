/**
 * middleware.ts
 * 
 * This middleware handles several application-wide concerns:
 * 1. Internationalization (i18n) via next-intl
 * 2. A/B price testing with cookie-based user assignment
 * 3. Request filtering for static assets and API routes
 * 4. Root path redirection to the default locale
 *
 * The middleware runs on every request before it reaches the actual route handler.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

/**
 * Configuration constants
 */
// Price options for A/B testing (in USD)
const PRICE_OPTIONS = [4.99, 7.49, 9.99];

// Supported locale codes
const LOCALES = ['en', 'es'];

// Default locale for redirects and fallbacks
const DEFAULT_LOCALE = 'en';

/**
 * Initialize the internationalization middleware from next-intl
 */
const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always' // Always show locale in URL, e.g., /en/about
});

/**
 * Main middleware function that processes all incoming requests
 * @param {NextRequest} request The incoming request object
 * @returns {NextResponse} The modified response
 */
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /**
   * 1. Skip middleware for static assets and Next.js internals
   * This improves performance by avoiding unnecessary processing
   */
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  /**
   * 2. Handle requests to the root path
   * Redirect to the default locale, e.g., / → /en
   */
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  /**
   * 3. Apply internationalization middleware
   * This handles locale detection and routing based on URL path
   */
  const response = intlMiddleware(request);
  
  /**
   * 4. Handle price A/B testing
   * If the user doesn't have a price selection cookie, randomly assign one
   * This ensures consistent price display across visits
   */
  const priceCookie = request.cookies.get('selected_price');
  if (!priceCookie?.value) {
    const randomIndex = Math.floor(Math.random() * PRICE_OPTIONS.length);
    response.cookies.set({
      name: 'selected_price',
      value: PRICE_OPTIONS[randomIndex].toString(),
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return response;
}

/**
 * Matcher configuration for Next.js
 * Defines which paths the middleware should run on
 */
export const config = {
  matcher: [
    // Match all paths except static files, API routes, and Next.js internals
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match admin API routes for authentication
    '/api/admin/:path*',
    // Exclude admin paths for performance (already covered by first matcher)
    '/((?!admin).*)'
  ]
};