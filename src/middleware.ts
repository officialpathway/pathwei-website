// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth/simple-auth';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Add pathname to response headers for layout conditional rendering
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Skip middleware for static assets and non-admin routes
  if (
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    !pathname.startsWith('/admin')
  ) {
    return response;
  }

  // Allow login page
  if (pathname === '/admin/login') {
    return response;
  }

  // Check authentication for admin routes
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Match all routes except static files
  ]
};