// pages/api/auth/admin-check.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_AUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ') || !JWT_SECRET) {
      return res.status(200).json({ 
        authenticated: false, 
        message: 'No valid authentication token found' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { 
        userId: string; 
        role: string;
        name?: string;
        email?: string;
        exp?: number;
      };
      
      // Check if token is valid and has admin role
      if (decoded && decoded.role === 'admin') {
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
          return res.status(200).json({ 
            authenticated: false, 
            message: 'Token expired' 
          });
        }
        
        return res.status(200).json({ 
          authenticated: true, 
          userId: decoded.userId,
          role: decoded.role,
          name: decoded.name,
          email: decoded.email
        });
      } else {
        return res.status(200).json({ 
          authenticated: false, 
          message: 'Not authorized as admin' 
        });
      }
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(200).json({ 
        authenticated: false, 
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    console.error('Admin auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}