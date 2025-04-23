// lib/api/auth/auth.ts
import type { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_AUTH_SECRET;

/**
 * Checks if the request is from an authenticated admin by checking both cookies and JWT tokens
 * 
 * @param req The NextApiRequest object
 * @returns Promise<boolean> True if authenticated, false otherwise
 */
export async function isAdminAuthenticated(req: NextApiRequest): Promise<boolean> {
  try {
    console.log('Checking admin authentication for API request');
    
    // 1. First check the authorization header for token-based auth
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ') && JWT_SECRET) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { 
          userId: string; 
          role: string;
          exp?: number;
        };
        
        if (decoded && decoded.role === 'admin') {
          if (!decoded.exp || decoded.exp > Math.floor(Date.now() / 1000)) {
            console.log('Valid admin JWT token found in Authorization header');
            return true;
          }
        }
      } catch (tokenError) {
        console.warn('JWT token validation failed:', tokenError);
      }
    }
    
    // 2. If token auth fails, check for cookie-based auth
    try {
      // Check for admin auth cookie directly
      const adminAuthCookie = req.cookies.adminAuth;
      
      if (adminAuthCookie) {
        try {
          const adminAuthData = JSON.parse(adminAuthCookie);
          
          // Check if the cookie is valid
          if (adminAuthData.role === 'admin' && 
              adminAuthData.exp && 
              adminAuthData.exp > Math.floor(Date.now() / 1000)) {
            console.log('Valid admin cookie found directly in request');
            return true;
          }
        } catch (cookieParseError) {
          console.warn('Admin cookie parsing failed:', cookieParseError);
        }
      }
      
      // 3. As a last resort, call the admin-check endpoint
      const fetch = (await import('node-fetch')).default;
      
      // Get the hostname from the request to construct the absolute URL
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = req.headers.host || 'localhost:3000';
      
      // Make request to admin-check endpoint
      const response = await fetch(`${protocol}://${host}/api/auth/admin-check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || '',
          'Authorization': req.headers.authorization || '',
        },
      });
      
      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await response.json();
        return data.authenticated === true;
      }
      
      return false;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  } catch (error) {
    console.error('Admin authentication check error:', error);
    return false;
  }
}