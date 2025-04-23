/**
 * Custom hook for making authenticated API requests in the admin panel
 * Automatically includes auth tokens from localStorage and cookies
 */
import { useCallback } from 'react';

export function useAuthFetch() {
  // Use useCallback to ensure a stable function reference
  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      // Get auth headers (this function is inside the callback to ensure fresh token)
      const getAuthHeaders = (): Record<string, string> => {
        const token = localStorage.getItem('adminAuthToken');
        return token 
          ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' };
      };
      
      // Properly type the headers
      const combinedHeaders: Record<string, string> = {
        ...getAuthHeaders(),
        ...(options.headers as Record<string, string> || {}),
      };
      
      const response = await fetch(url, {
        ...options,
        headers: combinedHeaders,
        credentials: 'include', // Always include cookies when available
      });
      
      // Check for auth errors and attempt refresh/retry
      if (response.status === 401 || response.status === 403) {
        // If this was a token-based auth failure, try with cookies only
        const token = localStorage.getItem('adminAuthToken');
        if (token) {
          console.log('Token-based auth failed, trying with cookies only');
          
          // Create new headers without Authorization
          const cookieOnlyHeaders: Record<string, string> = { ...combinedHeaders };
          delete cookieOnlyHeaders.Authorization;
          
          const cookieOnlyResponse = await fetch(url, {
            ...options,
            headers: cookieOnlyHeaders,
            credentials: 'include',
          });
          
          if (cookieOnlyResponse.ok) {
            return cookieOnlyResponse;
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error in authFetch:', error);
      throw error;
    }
  }, []); // Empty dependency array ensures this function reference is stable
  
  return authFetch;
}

export default useAuthFetch;