// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/utils/supabase/middleware';

/**
 * Configuration constants
 */

// SEO-related paths
const SEO_STATIC_PATHS = ['/api/seo-data.json'];

// Cache configuration
const CACHE_CONFIG = {
  // Static SEO data - longer cache with stale-while-revalidate
  seoStaticData: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  
  // HTML pages - shorter cache with quick revalidation
  htmlPages: 'public, max-age=120, s-maxage=600, stale-while-revalidate=3600',
  
  // API routes - minimal caching
  apiRoutes: 'public, max-age=10, s-maxage=30, stale-while-revalidate=60',
  
  // Assets - aggressive caching
  staticAssets: 'public, max-age=31536000, immutable'
};

// CORS configuration
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://aihavenlabs.com',
  'https://www.aihavenlabs.com',
  'https://www.mypathwayapp.com',
  'https://mypathwayapp.com',
  // Add any additional domains here
];

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
 * Cache optimization function
 * Sets appropriate cache headers based on the request path
 * @param {NextRequest} request The incoming request object
 * @param {NextResponse} response The response to modify
 * @returns {NextResponse} The modified response with cache headers
 */
function applyCacheHeaders(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;
  
  // Set appropriate cache headers based on the path
  if (SEO_STATIC_PATHS.includes(pathname)) {
    // SEO data - longer cache with stale-while-revalidate
    response.headers.set('Cache-Control', CACHE_CONFIG.seoStaticData);
  } else if (pathname.startsWith('/api/')) {
    // API routes - minimal caching
    response.headers.set('Cache-Control', CACHE_CONFIG.apiRoutes);
  } else if (pathname.match(/\.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf)$/)) {
    // Static assets - aggressive caching
    response.headers.set('Cache-Control', CACHE_CONFIG.staticAssets);
  } else if (pathname.endsWith('/') || !pathname.includes('.') || pathname.endsWith('.html')) {
    // HTML pages - shorter cache with quick revalidation
    response.headers.set('Cache-Control', CACHE_CONFIG.htmlPages);
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
  if (pathname.includes('.') && !SEO_STATIC_PATHS.includes(pathname) && !pathname.startsWith('/api/')) {
    // For regular static assets, still apply cache headers
    const response = NextResponse.next();
    return applyCacheHeaders(request, response);
  }
  
  /**
   * 2. Special handling for SEO data
   */
  if (SEO_STATIC_PATHS.includes(pathname)) {
    const response = NextResponse.next();
    // Apply cache headers and return
    return applyCacheHeaders(request, handleCORS(request, response));
  }
  
  /**
   * 3. Handle admin routes
   */
  if (pathname.startsWith('/admin')) {
    // Skip authentication for login and password recovery pages
    if (pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password') {
      const response = NextResponse.next();
      return applyCacheHeaders(request, response);
    }
    
    // Process authentication for other admin routes
    const authResponse = await updateSession(request);
    return applyCacheHeaders(request, authResponse);
  }

  /**
   * 4. Handle regular pages - no locale processing needed
   */
  let response = NextResponse.next();
  
  /**
   * 5. Apply CORS headers
   */
  response = handleCORS(request, response);
  
  /**
   * 6. Apply cache headers
   */
  response = applyCacheHeaders(request, response);

  return response;
}

/**
 * Matcher configuration for Next.js
 * Defines which paths the middleware should run on
 */
export const config = {
  matcher: [
    // Match all paths except static files, API routes, and Next.js internals
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
    // Match API routes for CORS handling and caching
    '/api/:path*',
    // Match SEO static data path
    '/api/seo-data.json',
    // Match static assets for caching
    '/:path*\\.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf)',
    // Match admin routes
    '/admin/:path*'
  ]
};