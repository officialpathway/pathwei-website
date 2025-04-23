// lib/api/admin/adminApi.ts
import useAuthFetch from '@/hooks/api/useAuthFetch';

/**
 * Hook to get a generic admin API client
 * This provides methods for common API operations with authentication
 */
export function useAdminApi() {
  const authFetch = useAuthFetch();
  
  /**
   * Generic GET request with authentication
   * @param endpoint The API endpoint path
   */
  const get = async <T>(endpoint: string): Promise<T> => {
    const response = await authFetch(`/api/admin/${endpoint}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  };
  
  /**
   * Generic POST request with authentication
   * @param endpoint The API endpoint path
   * @param data The data to send
   */
  const post = async <T, R>(endpoint: string, data: T): Promise<R> => {
    const response = await authFetch(`/api/admin/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  };
  
  /**
   * Generic PUT request with authentication
   * @param endpoint The API endpoint path
   * @param data The data to send
   */
  const put = async <T, R>(endpoint: string, data: T): Promise<R> => {
    const response = await authFetch(`/api/admin/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  };
  
  /**
   * Generic DELETE request with authentication
   * @param endpoint The API endpoint path
   */
  const del = async <R>(endpoint: string): Promise<R> => {
    const response = await authFetch(`/api/admin/${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  };
  
  return {
    get,
    post,
    put,
    delete: del
  };
}