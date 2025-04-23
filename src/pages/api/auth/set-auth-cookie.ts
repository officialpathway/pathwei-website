// pages/api/auth/set-auth-cookie.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';
import Cors from 'cors';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Improved CORS configuration
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

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  fn: Function
) {
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
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Create a Supabase client to validate the token
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Invalid authentication' });
    }
    
    // Check if user has admin role in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (userError || !userData || userData.role !== 'admin') {
      console.error('User role error:', userError);
      return res.status(403).json({ error: 'Not authorized as admin' });
    }
    
    // Get the host from request to determine domain
    const host = req.headers.host || '';
    
    // Determine appropriate domain settings based on host
    let cookieDomain;
    if (process.env.NODE_ENV === 'production') {
      // Extract base domain for production
      if (host.includes('aihavenlabs.com')) {
        // Use root domain for production to work across all subdomains
        cookieDomain = 'aihavenlabs.com';
      } else if (host.includes('vercel.app')) {
        // For Vercel preview deployments
        cookieDomain = undefined; // Let the browser set it based on current domain
      } else {
        // Fallback to configured domain
        cookieDomain = process.env.COOKIE_DOMAIN;
      }
    } else {
      // For development
      cookieDomain = undefined;
    }
    
    // Configure cookie options with improved security
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      domain: cookieDomain
    };

    console.log('Setting admin cookie with options:', {
      domain: cookieOptions.domain,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      httpOnly: cookieOptions.httpOnly,
      env: process.env.NODE_ENV,
      requestHost: host,
      requestOrigin: req.headers.origin
    });
    
    // Set cookie with admin role
    res.setHeader('Set-Cookie', cookie.serialize('adminAuth', 
      JSON.stringify({ 
        userId: user.id,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      }), 
      cookieOptions
    ));
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error setting admin cookie:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}