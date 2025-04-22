// pages/api/admin/set-auth-cookie.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import cookie from 'cookie';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
      return res.status(401).json({ error: 'Invalid authentication' });
    }
    
    // Check if user has admin role in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (userError || !userData || userData.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }
    
    // Set secure admin cookie with modified options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const, // Changed from 'strict' to 'lax'
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/', // Changed from '/admin' to '/' so it's accessible everywhere
    };
    
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