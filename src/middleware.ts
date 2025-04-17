import { type NextRequest, NextResponse } from 'next/server';

// Define our price options
const PRICE_OPTIONS = [4.99, 7.49, 9.99];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Check if the user already has a price assigned via cookie
  const priceCookie = request.cookies.get('selected_price');
  
  if (!priceCookie || !priceCookie.value) {
    // If no cookie exists, assign a new random price
    const randomIndex = Math.floor(Math.random() * PRICE_OPTIONS.length);
    const selectedPrice = PRICE_OPTIONS[randomIndex];
    
    // Set the cookie with a 30-day expiration
    response.cookies.set({
      name: 'selected_price',
      value: selectedPrice.toString(),
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }
  
  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (except track-price)
     * - Static files (_next/static, favicon.ico, etc.)
     */
    '/((?!api/(?!track-price)|_next/static|_next/image|favicon.ico).*)',
  ],
};