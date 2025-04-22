// pages/api/auth/admin-check.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the admin auth cookie from the request
    const { adminAuth } = req.cookies;
    
    if (!adminAuth) {
      return res.status(200).json({ authenticated: false, message: 'No admin auth cookie found' });
    }

    // Parse the admin auth cookie
    try {
      const adminAuthData = JSON.parse(adminAuth);
      
      // Check if the token is expired
      if (adminAuthData.exp && adminAuthData.exp < Math.floor(Date.now() / 1000)) {
        return res.status(200).json({ 
          authenticated: false, 
          message: 'Admin auth cookie expired'
        });
      }

      // Check if the user has admin role
      if (adminAuthData.role !== 'admin') {
        return res.status(200).json({ 
          authenticated: false, 
          message: 'User is not an admin'
        });
      }

      // All checks passed, user is authenticated as admin
      return res.status(200).json({ 
        authenticated: true, 
        userId: adminAuthData.userId,
        role: adminAuthData.role
      });
    } catch (error) {
      console.error('Error parsing admin auth cookie:', error);
      return res.status(200).json({ 
        authenticated: false, 
        message: 'Invalid admin auth cookie format'
      });
    }
  } catch (error) {
    console.error('Admin auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}