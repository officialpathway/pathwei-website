import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { adminSupabase } from '@/lib/db/users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request received:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log cookies for debugging
  console.log('Cookies:', req.headers.cookie);
  
  try {
    // Create authenticated client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => {
            const cookies = req.headers.cookie || '';
            const cookie = cookies.split(';').find(c => c.trim().startsWith(`${name}=`));
            const value = cookie ? cookie.split('=')[1] : undefined;
            console.log(`Cookie ${name}:`, value ? 'found' : 'not found');
            return value;
          },
          set: (name, value, options) => {
            res.setHeader('Set-Cookie', `${name}=${value}; Path=${options?.path || '/'}`);
          },
          remove: (name, options) => {
            res.setHeader('Set-Cookie', `${name}=; Path=${options?.path || '/'}; Max-Age=0`);
          },
        },
      }
    );

    // Check session
    console.log('Checking auth session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return res.status(401).json({ error: 'Session error', details: sessionError });
    }

    if (!sessionData.session) {
      console.log('No session found');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    console.log('Session found, user ID:', sessionData.session.user.id);
    
    // Check admin status - first verify adminSupabase exists
    if (!adminSupabase) {
      console.error('adminSupabase is not configured');
      return res.status(500).json({ error: 'Server configuration error: Missing service role key' });
    }
    
    console.log('Checking admin status...');
    const { data: adminCheck, error: adminCheckError } = await adminSupabase
      .from('users')
      .select('role')
      .eq('id', sessionData.session.user.id)
      .single();

    if (adminCheckError) {
      console.error('Admin check error:', adminCheckError);
      return res.status(500).json({ error: 'Failed to verify admin status', details: adminCheckError });
    }

    if (!adminCheck || adminCheck.role !== 'admin') {
      console.log('User is not admin:', adminCheck?.role || 'no role');
      return res.status(403).json({ error: 'Not authorized - Admin access required' });
    }

    console.log('Admin status confirmed');
    
    // Everything is good - request is authorized
    return res.status(200).json({ 
      message: 'Authentication successful',
      user: {
        id: sessionData.session.user.id,
        role: adminCheck.role
      }
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
}