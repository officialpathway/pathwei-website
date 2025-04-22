// src/lib/auth.ts
import type { NextApiRequest } from 'next';

/**
 * Checks if the request is from an authenticated admin by calling
 * the admin-check endpoint
 * 
 * @param req The NextApiRequest object
 * @returns Promise<boolean> True if authenticated, false otherwise
 */
export async function isAdminAuthenticated(req: NextApiRequest): Promise<boolean> {
  try {
    // Use node-fetch or similar for server-side requests
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
}