// pages/api/auth/admin-check.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_AUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Check for cookie-based auth
    const { adminAuth } = req.cookies;
    let isAuthenticated = false;
    let userId = null;
    let role = null;
    let authMethod = null;
    
    // Log initial state
    console.log('Admin auth check:', {
      cookiePresent: !!adminAuth,
      authHeaderPresent: !!req.headers.authorization,
      requestOrigin: req.headers.origin || 'unknown'
    });
    
    // 2. Check cookie-based auth
    if (adminAuth) {
      try {
        const adminAuthData = JSON.parse(adminAuth);
    
        console.log('Admin cookie auth check:', {
          cookieData: adminAuthData,
          isExpired: adminAuthData.exp < Math.floor(Date.now() / 1000),
          currentTime: Math.floor(Date.now() / 1000),
          isAdmin: adminAuthData.role === 'admin'
        });
        
        // Check if the token is expired
        if (adminAuthData.exp && adminAuthData.exp < Math.floor(Date.now() / 1000)) {
          console.log('Admin auth cookie expired');
        } else if (adminAuthData.role !== 'admin') {
          console.log('User is not an admin in cookie data');
        } else {
          // Valid cookie auth
          isAuthenticated = true;
          userId = adminAuthData.userId;
          role = adminAuthData.role;
          authMethod = 'cookie';
        }
      } catch (error) {
        console.error('Error parsing admin auth cookie:', error);
      }
    }
    
    // 3. If cookie auth failed, check for token-based auth in Authorization header
    if (!isAuthenticated && req.headers.authorization && JWT_SECRET) {
      try {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          
          // Verify the JWT token
          const decoded = jwt.verify(token, JWT_SECRET) as { 
            userId: string; 
            role: string;
            exp?: number;
          };
          
          console.log('Token auth check:', {
            tokenValid: !!decoded,
            tokenRole: decoded?.role,
            isExpired: decoded.exp ? decoded.exp < Math.floor(Date.now() / 1000) : false
          });
          
          // Check if token is valid and has admin role
          if (decoded && decoded.role === 'admin') {
            if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
              console.log('Admin auth token expired');
            } else {
              isAuthenticated = true;
              userId = decoded.userId;
              role = decoded.role;
              authMethod = 'token';
            }
          }
        }
      } catch (error) {
        console.error('Token verification error:', error);
      }
    }
    
    // 4. Return authentication result
    if (isAuthenticated) {
      return res.status(200).json({ 
        authenticated: true, 
        userId,
        role,
        authMethod
      });
    } else {
      return res.status(200).json({ 
        authenticated: false, 
        message: 'Not authenticated as admin'
      });
    }
  } catch (error) {
    console.error('Admin auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}