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
 * Handle auth cookie checks for admin routes
 * @param {NextRequest} request The incoming request
 * @param {NextResponse} response The response
 * @returns {NextResponse} Modified response
 */
function handleAdminAuth(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;
  
  // Only process admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return response;
  }
  
  // Check for admin cookie or auth token in header
  const adminAuthCookie = request.cookies.get('adminAuth');
  const authToken = request.headers.get('authorization')?.split(' ')[1];
  
  // For API routes, just check presence of auth but let the API handler handle validation
  if (pathname.startsWith('/api/')) {
    // Log authentication attempt but don't block - API endpoints will validate
    if (!adminAuthCookie?.value && !authToken) {
      console.log('No auth credentials found for admin API route:', pathname);
    }
    return response;
  }
  
  // For admin UI routes, validate cookie
  if (adminAuthCookie?.value) {
    try {
      // Parse and validate the cookie
      const adminAuthData = JSON.parse(adminAuthCookie.value);
      const isExpired = adminAuthData.exp && adminAuthData.exp < Math.floor(Date.now() / 1000);
      const isAdmin = adminAuthData.role === 'admin';
      
      console.log('Admin middleware check:', {
        path: pathname,
        isExpired,
        isAdmin,
        userId: adminAuthData.userId
      });
      
      // If expired or not admin, redirect to login
      if (isExpired || !isAdmin) {
        // Allow access to the admin login page even with invalid auth
        if (pathname === '/admin') {
          return response;
        }
        
        // Redirect other admin pages to login
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (error) {
      console.error('Error parsing admin auth cookie in middleware:', error);
      // Redirect to login page on error
      if (pathname !== '/admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  } else {
    // No auth cookie - allow access to admin login page but redirect other admin pages
    if (pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
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
   * 5. Check admin authentication for admin routes
   */
  response = handleAdminAuth(request, response);

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
    // Match API routes for authentication and CORS
    '/api/:path*',
  ]
};