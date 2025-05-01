import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { isAdmin } from './admin';

/**
 * Get the server-side session for server components
 * Also validates the user has admin access
 * 
 * @returns {Promise<any>} The session object or null
 */
export async function getServerSession() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => (await cookieStore).get(name)?.value,
        set: () => {}, // No-op in server component
        remove: () => {}, // No-op in server component
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }
  
  // Verify user has admin access
  const hasAccess = await isAdmin(session.user.id);
  
  if (!hasAccess) {
    return null;
  }
  
  return session;
}

/**
 * Get the server-side session without admin validation
 * Used for basic auth checks where admin status isn't required
 * 
 * @returns {Promise<any>} The session object or null
 */
export async function getServerSessionBasic() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => (await cookieStore).get(name)?.value,
        set: () => {}, // No-op in server component
        remove: () => {}, // No-op in server component
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  return session;
}