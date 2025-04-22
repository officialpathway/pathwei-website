import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client with proper error checking
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Supabase credentials missing: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`);
}

// Create the client with the confirmed values
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // Add additional configuration to persist session
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

// Create the admin client with service role key (server-side only)
// This should never be exposed to the client
export const adminSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastActive: string;
  status: 'active' | 'invited' | 'suspended';
  avatar?: string;
};

// Check if user is admin either via Supabase Auth or custom cookie
export async function isAdmin(): Promise<boolean> {
  try {
    // First try to get user from Supabase Auth
    const { data, error } = await supabase.auth.getUser();
    
    console.log('isAdmin check - auth.getUser result:', data?.user ? 'User found' : 'No user', error ? `Error: ${error.message}` : 'No error');
    
    if (data?.user) {
      // Check if user has admin role in app_metadata
      if (data.user.app_metadata?.role === 'admin') {
        console.log('User has admin role in app_metadata');
        return true;
      }
      
      // If not in app_metadata, check in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      console.log('isAdmin check - users table result:', userData ? `Role: ${userData.role}` : 'No user data', userError ? `Error: ${userError.message}` : 'No error');
        
      if (userData?.role === 'admin') {
        console.log('User has admin role in users table');
        return true;
      }
    }
    
    // If Supabase auth doesn't confirm admin, fallback to your custom cookie method
    console.log('No admin status from Supabase auth, falling back to cookie method');
    // This is handled by your useAdminAuthGuard hook, so we'll return false here
    // and let the hook handle the cookie check
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    // Add logging for debugging
    console.log('Attempting to fetch users from database...');
    
    // Check session before making the request
    const session = await supabase.auth.getSession();
    console.log('Current session status:', session?.data?.session ? 'Active session' : 'No session', 
                session?.error ? `Error: ${session.error.message}` : 'No session error');
    
    // Try fetching regardless of session status for debugging
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('getUsers result:', data ? `Retrieved ${data.length} users` : 'No data', 
                error ? `Error: ${error.message}` : 'No error');
    
    if (error) throw error;
    return data as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Authentication helpers with enhanced logging
export async function signIn(email: string, password: string) {
  try {
    console.log(`Attempting to sign in user: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in result:', data?.user ? 'Success' : 'Failed', 
                error ? `Error: ${error.message}` : 'No error');
    
    if (error) throw error;
    
    // Check if session was created properly
    const session = await supabase.auth.getSession();
    console.log('Session after sign in:', session?.data?.session ? 'Session created' : 'No session created');
    
    return data;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    console.log('Attempting to sign out user');
    
    const { error } = await supabase.auth.signOut();
    
    console.log('Sign out result:', error ? `Error: ${error.message}` : 'Success');
    
    if (error) throw error;
    
    // Verify session was removed
    const session = await supabase.auth.getSession();
    console.log('Session after sign out:', session?.data?.session ? 'Session still exists' : 'Session removed');
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    console.log('Attempting to get current user');
    
    // First check if we have a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Current session status:', 
                sessionData?.session ? `Active session for ${sessionData.session.user.email}` : 'No active session',
                sessionError ? `Session error: ${sessionError.message}` : 'No session error');
    
    if (!sessionData?.session) {
      console.log('No active session found, attempting to get user anyway');
    }
    
    // Try to get user even if no session (for debugging)
    const { data, error } = await supabase.auth.getUser();
    
    console.log('getUser result:', 
                data?.user ? `User found: ${data.user.email}` : 'No user found',
                error ? `Error: ${error.message}` : 'No error');
    
    if (error) {
      console.error('Auth error details:', error);
      throw error;
    }
    
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Add a new function to check authentication state in detail
export async function checkAuthState() {
  try {
    const sessionResult = await supabase.auth.getSession();
    const userResult = await supabase.auth.getUser();
    
    return {
      hasSession: !!sessionResult.data.session,
      sessionError: sessionResult.error?.message,
      hasUser: !!userResult.data.user,
      userError: userResult.error?.message,
      sessionExpiresAt: sessionResult.data.session?.expires_at,
      storageType: typeof window !== 'undefined' ? 'localStorage available' : 'server-side (no localStorage)'
    };
  } catch (error) {
    console.error('Error checking auth state:', error);
    return {
      hasSession: false,
      sessionError: 'Exception occurred',
      hasUser: false,
      userError: 'Exception occurred',
      error: String(error)
    };
  }
}