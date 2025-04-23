// lib/api/auth/adminAuth.ts
import { supabase, getCurrentUser } from '@/lib/db/supabase';

// Interfaces for auth data
interface AdminTokenData {
  userId: string;
  role: string;
  email: string;
  name: string;
  exp: number;
}

/**
 * Checks if the user is authenticated as an admin
 * Tries both cookie-based and token-based authentication
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    // Log initial auth state
    console.log('Auth check:', {
      cookieAuth: localStorage.getItem('adminAuthToken') ? 'Present' : 'None',
      cookieAuthDetails: localStorage.getItem('adminAuthToken') ? 'Token exists' : {},
      supabaseAuth: 'Checking...'
    });

    // First check cookie-based auth
    try {
      const res = await fetch('/api/auth/admin-check', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        console.warn('Cookie auth check returned non-OK response:', res.status);
        throw new Error(`Cookie auth check failed with status: ${res.status}`);
      }
      
      const cookieAuthData = await res.json();
      
      if (cookieAuthData.authenticated) {
        console.log('Authenticated via cookie');
        return true;
      }
    } catch (cookieError) {
      console.warn('Cookie auth check failed:', cookieError);
    }
    
    // If cookie auth fails, check for token in localStorage
    const token = localStorage.getItem('adminAuthToken');
    const expiresAt = localStorage.getItem('adminAuthExpires');
    
    if (token && expiresAt) {
      const expiryTime = parseInt(expiresAt);
      const currentTime = Math.floor(Date.now() / 1000);
      
      console.log('Token auth check:', {
        tokenPresent: !!token,
        expiryTime,
        currentTime,
        isExpired: expiryTime <= currentTime
      });
      
      if (expiryTime > currentTime) {
        // Token exists and is not expired
        console.log('Found valid token in localStorage');
        
        try {
          // Verify the token is still valid with Supabase
          const user = await getCurrentUser();
          if (user) {
            console.log('Supabase session confirmed for user:', user.id);
            return true;
          } else {
            console.log('No valid Supabase session found');
            // Supabase session expired, clear token
            localStorage.removeItem('adminAuthToken');
            localStorage.removeItem('adminAuthExpires');
            return false;
          }
        } catch (supabaseError) {
          console.error('Supabase session check error:', supabaseError);
          return false;
        }
      } else {
        // Token is expired, clear it
        console.log('Token expired, clearing from localStorage');
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminAuthExpires');
      }
    }
    
    console.log('No valid authentication found');
    return false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

/**
 * Logs out the user from both cookie and token auth
 */
export async function logoutAdmin(): Promise<void> {
  try {
    console.log('Logging out admin user');
    
    // Clear local storage tokens
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminAuthExpires');
    localStorage.removeItem('adminUser');
    
    // Clear cookies
    try {
      const cookieResponse = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!cookieResponse.ok) {
        console.warn('Logout cookie clearing failed:', await cookieResponse.text());
      } else {
        console.log('Logout cookie cleared successfully');
      }
    } catch (cookieError) {
      console.warn('Error during cookie logout:', cookieError);
    }
    
    // Sign out from Supabase
    try {
      await supabase.auth.signOut();
      console.log('Supabase signout successful');
    } catch (supabaseError) {
      console.warn('Error during Supabase signout:', supabaseError);
    }
    
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Gets the current admin user ID
 * @returns The user ID if authenticated, null otherwise
 */
export function getAdminUserId(): string | null {
  // Check localStorage token first
  const token = localStorage.getItem('adminAuthToken');
  if (token) {
    try {
      // For JWT tokens, we can decode without verification to get the payload
      // Note: This is safe for client-side use as we're not trusting this data for auth decisions
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload) as AdminTokenData;
      return payload.userId || null;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
  
  // Fallback to cookie if available (needs to be added to the cookie when setting it)
  // This requires the cookie to be accessible from JS, which might not be the case for httpOnly cookies
  // This is just a placeholder for custom implementation if needed
  return null;
}

/**
 * Gets the current admin user information
 * @returns The user information if authenticated, null otherwise
 */
export function getAdminUser(): { id: string; name: string; email: string; role: string } | null {
  // Check localStorage for stored user data first
  const userJson = localStorage.getItem('adminUser');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing stored user data:', e);
    }
  }

  // Fall back to token decoding if user data isn't stored directly
  const token = localStorage.getItem('adminAuthToken');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload) as AdminTokenData;
      
      return {
        id: payload.userId,
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        role: payload.role
      };
    } catch (e) {
      console.error('Error decoding token for user data:', e);
      return null;
    }
  }
  
  return null;
}