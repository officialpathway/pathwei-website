// lib/api/auth/auth.ts
import type { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_AUTH_SECRET;

/**
 * Checks if the request is from an authenticated admin using JWT token
 * 
 * @param req The NextApiRequest object
 * @returns Promise<boolean> True if authenticated, false otherwise
 */
export async function isAdminAuthenticated(req: NextApiRequest): Promise<boolean> {
  try {
    // Check if JWT_SECRET is configured
    if (!JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return false;
    }
    
    // Extract authorization header
    const authHeader = req.headers.authorization;
    
    // Debug: Log request details
    console.log(`Auth check for ${req.url}:`, { 
      hasAuthHeader: !!authHeader,
      method: req.method,
      contentType: req.headers['content-type']
    });
    
    // Verify authorization header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authentication header found');
      return false;
    }
    
    // Get token from header
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { 
        userId: string; 
        role: string;
        exp?: number;
      };
      
      // Check if token is valid and has admin role
      if (decoded && decoded.role === 'admin') {
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
          console.log('JWT token expired');
          return false;
        }
        
        console.log('Valid admin JWT token found for user:', decoded.userId);
        return true;
      } else {
        console.log('JWT token missing admin role or invalid');
        return false;
      }
    } catch (tokenError) {
      console.error('JWT token validation failed:', tokenError);
      return false;
    }
  } catch (error) {
    console.error('Admin authentication check error:', error);
    return false;
  }
}