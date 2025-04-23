// lib/api/auth/adminAuth.ts
import { supabase, getCurrentUser } from '@/lib/db/supabase';

// Interface for decoded token data
interface AdminTokenData {
  userId: string;
  role: string;
  email: string;
  name: string;
  exp: number;
}

/**
 * Checks if the user is authenticated as an admin using JWT token
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    // Check for token in localStorage
    const token = localStorage.getItem('adminAuthToken');
    const expiresAt = localStorage.getItem('adminAuthExpires');
    
    if (!token || !expiresAt) {
      console.log('No auth token found');
      return false;
    }
    
    const expiryTime = parseInt(expiresAt);
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log('Token auth check:', {
      tokenPresent: true,
      expiryTime,
      currentTime,
      isExpired: expiryTime <= currentTime
    });
    
    if (expiryTime <= currentTime) {
      console.log('Token expired, clearing from localStorage');
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('adminAuthExpires');
      localStorage.removeItem('adminUser');
      return false;
    }
    
    // Token exists and is not expired, verify with server
    try {
      const response = await fetch('/api/auth/admin-check', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.authenticated) {
        console.log('Token verified with server');
        return true;
      } else {
        console.log('Server rejected token:', data.message);
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminAuthExpires');
        localStorage.removeItem('adminUser');
        return false;
      }
    } catch (serverCheckError) {
      console.error('Error checking token with server:', serverCheckError);
      
      // As a fallback, verify with Supabase if server check fails
      try {
        const user = await getCurrentUser();
        if (user) {
          console.log('Supabase session confirmed for user:', user.id);
          return true;
        }
      } catch (supabaseError) {
        console.error('Supabase session check error:', supabaseError);
      }
      
      return false;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

/**
 * Logs out the admin user
 */
export async function logoutAdmin(): Promise<void> {
  try {
    console.log('Logging out admin user');
    
    // Clear local storage tokens
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminAuthExpires');
    localStorage.removeItem('adminUser');
    
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
  // Check localStorage token
  const token = localStorage.getItem('adminAuthToken');
  if (token) {
    try {
      // Decode JWT token without verification
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

  // Fall back to token decoding
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