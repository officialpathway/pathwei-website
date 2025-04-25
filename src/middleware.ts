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
const DEFAULT_LOCALE = 'es';

// CORS configuration
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://aihavenlabs.com',
  'https://www.aihavenlabs.com',
  'https://ai-haven-labs-git-develop-alvr10s-projects.vercel.app',
  // Add any additional domains here
];

/**
 * Initialize the internationalization middleware from next-intl
 */
const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always' // Always show locale in URL, e.g., /en/about
});

/**
 * CORS handling function
 * @param {NextRequest} request The incoming request object
 * @param {NextResponse} response The response to modify
 * @returns {NextResponse} The modified response with CORS headers
 */
function handleCORS(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin') || '';
  
  // Check if the origin is allowed
  const isAllowedOrigin = ALLOWED_ORIGINS.some(allowedOrigin => 
    origin.startsWith(allowedOrigin)
  );

  if (isAllowedOrigin) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      return new NextResponse(null, {
        status: 204,
        headers: response.headers
      });
    }

    // Set CORS headers for non-OPTIONS requests
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

/**
 * Main middleware function that processes all incoming requests
 * @param {NextRequest} request The incoming request object
 * @returns {NextResponse} The modified response
 */
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /**
   * 1. Skip middleware for static assets and Next.js internals
   */
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  /**
   * 2. Handle requests to the root path
   */
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  /**
   * 3. Apply internationalization middleware
   */
  let response = intlMiddleware(request);
  
  /**
   * 4. Handle price A/B testing
   */
  const priceCookie = request.cookies.get('selected_price');
  if (!priceCookie?.value) {
    response.cookies.set({
      name: 'selected_price',
      value: PRICE_OPTIONS[Math.floor(Math.random() * PRICE_OPTIONS.length)].toString(),
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  /**
   * 5. Apply CORS headers
   */
  response = handleCORS(request, response);

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
    // Match API routes for CORS handling
    '/api/:path*',
  ]
};