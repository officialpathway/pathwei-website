import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/api/middleware/adminApiMiddleware';
import { adminSupabase } from '@/lib/db/users';

// Response types
type SuccessResponse = {
  success: true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
};

type ErrorResponse = {
  error: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate content type
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'Unsupported media type' });
  }

  try {
    // Verify we have adminSupabase available
    if (!adminSupabase) {
      return res.status(500).json({ 
        error: 'Server configuration error: Missing service role key' 
      });
    }

    const userData = req.body;

    // Validate request body
    if (!userData.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!userData.role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    // Add the user using adminSupabase (bypasses RLS)
    const { data, error } = await adminSupabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status || 'invited',
        last_active: userData.last_active || new Date().toISOString(),
      }])
      .select();

    if (error) {
      console.error('Database error adding user:', error);
      return res.status(500).json({ 
        error: 'Failed to add user to database', 
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }

    return res.status(200).json({ 
      success: true,
      user: data[0] 
    });
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({ 
      error: 'Failed to add user', 
      details: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
}

// Export with admin auth middleware
export default withAdminAuth(handler);