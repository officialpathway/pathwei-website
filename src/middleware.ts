import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { isAdmin } from '@/lib/new/admin';

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
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /**
   * 1. Skip middleware for static assets and Next.js internals
   */
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  /**
   * 2. Handle admin authentication for admin routes
   * 
   * When using (admin) route group, the actual URLs will be:
   * - /login (not /(admin)/login)
   * - /dashboard (not /(admin)/dashboard)
   */
  // Check if this is an admin route - checking for actual URL patterns, not file structure
  const adminRoutes = ['/login', '/dashboard', '/users', '/settings', '/profile', '/content', '/forgot-password', '/reset-password', '/activity', '/analytics', '/manage-users', '/system-logs'];
  const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
                     
  if (isAdminRoute) {
    // Skip authentication check for login page and password recovery pages
    if (pathname === '/login' || pathname === '/forgot-password' || pathname === '/reset-password') {
      return NextResponse.next();
    }

    // Create a Supabase client for the middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: () => {}, // No-op in middleware
          remove: () => {}, // No-op in middleware
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Redirect to login if no session
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has admin dashboard access
    const userId = session.user.id;
    const hasAccess = await isAdmin(userId);

    if (!hasAccess) {
      // Redirect non-authorized users to homepage with appropriate locale
      const homePath = `/${DEFAULT_LOCALE}`;
      return NextResponse.redirect(new URL(homePath, request.url));
    }

    // Update the last_active timestamp
    try {
      await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      // Non-critical error, can proceed without updating last_active
      console.error('Failed to update last_active timestamp', error);
    }

    // Continue with the request for authenticated authorized users
    return NextResponse.next();
  }

  /**
   * 3. Handle requests to the root path
   */
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  /**
   * 4. Apply internationalization middleware
   * Only for non-admin routes
   */
  let response = intlMiddleware(request);
  
  /**
   * 5. Handle price A/B testing
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
   * 6. Apply CORS headers
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
    '/dashboard',
    '/dashboard/:path*',
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
    '/system-logs/:path*'
  ]
};