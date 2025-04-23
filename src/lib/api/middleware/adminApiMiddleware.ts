import type { NextApiRequest, NextApiResponse } from 'next';
import { isAdminAuthenticated } from '@/lib/api/auth/auth';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

/**
 * Admin API middleware
 * Provides consistent handling for authentication, CORS, and error management
 */
export function withAdminAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    // Set common headers for CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Set Content-Type
    res.setHeader('Content-Type', 'application/json');
    
    try {
      // Check admin authentication
      const isAuthenticated = await isAdminAuthenticated(req);
      
      if (!isAuthenticated) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      // If authenticated, call the handler
      await handler(req, res);
      return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('API Error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
      return;
    }
  };
}