// pages/api/auth/get-auth-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import Cors from 'cors';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const JWT_SECRET = process.env.JWT_AUTH_SECRET!; // Add this to your env vars

// Initialize cors middleware
const cors = Cors({
  origin: [
    'http://localhost:3000',
    'https://aihavenlabs.com',
    'https://www.aihavenlabs.com',
    'https://ai-haven-labs-git-develop-alvr10s-projects.vercel.app',
  ],
  methods: ['POST', 'OPTIONS'],
  credentials: true,
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Run CORS middleware
    await runMiddleware(req, res, cors);
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get Supabase token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Validate the token with Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Supabase auth error:', error);
      return res.status(401).json({ error: 'Invalid authentication' });
    }
    
    // Check if user has admin role in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, name, email')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      console.error('User lookup error:', userError);
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }
    
    if (!userData || userData.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_AUTH_SECRET environment variable is not set' });
    }
    
    // Calculate expiry time (7 days from now)
    const expiresAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
    
    // Generate a custom JWT token for admin access
    const authToken = jwt.sign(
      { 
        userId: user.id,
        role: 'admin',
        email: user.email,
        name: userData.name || user.email?.split('@')[0] || 'Admin User',
        // Add iat (issued at) and exp (expiration) claims for better security
        iat: Math.floor(Date.now() / 1000),
        exp: expiresAt
      },
      JWT_SECRET
    );
    
    // Return the token and expiry to the client
    return res.status(200).json({ 
      success: true,
      token: authToken,
      expiresAt: expiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: userData.name || user.email?.split('@')[0] || 'Admin User',
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Error generating auth token:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}