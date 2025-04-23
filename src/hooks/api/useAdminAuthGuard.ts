import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import useAuthFetch from './useAuthFetch';

export function useAdminAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authFetch = useAuthFetch();
  const isCheckingRef = useRef(false);

  useEffect(() => {
    // Don't run the check if we're already on the login page or not on an admin route
    const isAdminRoute = pathname?.includes('/admin');
    const isLoginPage = pathname === '/admin';

    if (!isAdminRoute || isLoginPage) {
      setIsLoading(false);
      setIsAuthorized(isLoginPage ? null : false);
      return;
    }

    // Prevent multiple simultaneous checks and infinite loops
    if (isCheckingRef.current) {
      return;
    }

    const checkAdminAuth = async () => {
      // Set flag to prevent concurrent checks
      isCheckingRef.current = true;
      
      try {
        setIsLoading(true);
        
        // Quick check if we have a token
        const token = localStorage.getItem('adminAuthToken');
        if (!token) {
          console.log('No auth token found in localStorage');
          setIsAuthorized(false);
          router.push('/admin');
          return;
        }
        
        // Verify token with server
        const res = await authFetch('/api/auth/admin-check', {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Admin auth guard check:', data);

        if (!data.authenticated) {
          console.log('Not authenticated as admin:', data.message);
          setIsAuthorized(false);
          router.push('/admin'); // Redirect to login page
          return;
        }

        console.log('Admin authentication successful');
        setIsAuthorized(true);
      } catch (err) {
        console.error('Admin auth check failed:', err);
        setIsAuthorized(false);
        router.push('/admin');
      } finally {
        setIsLoading(false);
        // Reset the flag after check completes
        isCheckingRef.current = false;
      }
    };

    checkAdminAuth();
    
    // Only add pathname as a dependency, not router or authFetch
    // This prevents re-running when redirects happen
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Removed router and authFetch dependencies

  return { isAuthorized, isLoading };
}