import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/utils/supabase/middleware';

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
  localePrefix: 'always', // Always show locale in URL, e.g., /en/about
  pathnames: {
    // Define paths to exclude from locale prefixing
    '/admin': {
      exclude: 'true'
    },
    // Add other admin routes
  }
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
export default async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
  const pathname = request.nextUrl.pathname;

  /**
   * 1. Skip middleware for static assets and Next.js internals
   */
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  /**
   * 3. Handle admin routes - check both direct admin routes and localized admin routes
   */
  const adminPaths = ['/login', '/', '/users', '/settings', '/profile', '/content', 
    '/forgot-password', '/reset-password', '/activity', '/analytics', '/manage-users', '/system-logs'];
  
  // Check if this is a direct admin route
  const isDirectAdminRoute = adminPaths.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if this is a localized admin route
  const isLocalizedAdminRoute = LOCALES.some(locale => 
    adminPaths.some(route => 
      pathname === `/${locale}${route}` || pathname.startsWith(`/${locale}${route}/`)
    )
  );
  
  // Handle admin authentication
  if (isDirectAdminRoute || isLocalizedAdminRoute) {
    // Skip authentication for login and password recovery pages
    if (pathname.endsWith('/login') || pathname.endsWith('/forgot-password') || pathname.endsWith('/reset-password')) {
      return NextResponse.next();
    }
    
    // Process authentication
    return await updateSession(request);
  }

  /**
   * 4. Handle requests to the root path
   */
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  /**
   * 5. Apply internationalization middleware for non-admin routes
   */
  let response = intlMiddleware(request);
  
  /**
   * 6. Handle price A/B testing
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
   * 7. Apply CORS headers
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
    // Match admin routes directly (the actual URL patterns)
    '/login',
    '/forgot-password',
    '/reset-password',
    '/users',
    '/users/:path*',
    '/settings',
    '/settings/:path*',
    '/profile',
    '/profile/:path*',
    '/content',
    '/content/:path*',
    '/activity',
    '/activity/:path*',
    '/analytics',
    '/analytics/:path*',
    '/manage-users',
    '/manage-users/:path*',
    '/system-logs',
    '/system-logs/:path*',
    // Match localized admin routes
    '/:locale/login',
    '/:locale/forgot-password',
    '/:locale/reset-password',
    '/:locale/users',
    '/:locale/users/:path*',
    '/:locale/settings',
    '/:locale/settings/:path*',
    '/:locale/profile',
    '/:locale/profile/:path*',
    '/:locale/content',
    '/:locale/content/:path*',
    '/:locale/activity',
    '/:locale/activity/:path*',
    '/:locale/analytics',
    '/:locale/analytics/:path*',
    '/:locale/manage-users',
    '/:locale/manage-users/:path*',
    '/:locale/system-logs',
    '/:locale/system-logs/:path*'
  ]
};