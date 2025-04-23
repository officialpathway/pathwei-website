/**
 * Custom hook for making authenticated API requests in the admin panel
 * Automatically includes JWT token from localStorage
 */
export function useAuthFetch() {
  const authFetch = async (url: string, options: RequestInit = {}) => {
    try {
      // Get the token from localStorage - done inside the function to always get fresh token
      const token = localStorage.getItem('adminAuthToken');

      // Create headers with Authorization header when token exists
      const headers = new Headers({
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      });

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Log for debugging
      console.log(`Auth fetch to ${url}:`, { 
        hasToken: !!token,
        firstCharsOfToken: token ? `${token.substring(0, 8)}...` : 'none'
      });

      // Make the API call
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 errors (expired/invalid token)
      if (response.status === 401) {
        console.warn('Authentication failed for request:', url);
        
        // Clear tokens if unauthorized
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminAuthExpires');
        localStorage.removeItem('adminUser');
      }

      return response;
    } catch (error) {
      console.error('Error in authFetch:', error);
      throw error;
    }
  };

  return authFetch;
}

export default useAuthFetch;