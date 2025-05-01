import { supabase } from './supabase';

/**
 * Sign in with email and password
 * 
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<{data: any, error: any}>} Auth response
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Sign out the current user
 * 
 * @returns {Promise<{error: any}>} Result of sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current user
 * 
 * @returns {Promise<any>} User object or null
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current session
 * 
 * @returns {Promise<any>} Session object or null
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Request a password reset
 * 
 * @param {string} email - The email to send reset instructions to
 * @returns {Promise<{data: any, error: any}>} Result
 */
export async function requestPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  });
  
  return { data, error };
}

/**
 * Update user password
 * 
 * @param {string} password - The new password
 * @returns {Promise<{data: any, error: any}>} Result
 */
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password
  });
  
  return { data, error };
}

/**
 * Set up event listeners for auth state changes
 * 
 * @param {Function} onAuthStateChange - Callback function when auth state changes
 * @returns {Function} Unsubscribe function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupAuthListener(onAuthStateChange: (event: string, session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    onAuthStateChange(event, session);
  });
  
  return () => {
    subscription.unsubscribe();
  };
}