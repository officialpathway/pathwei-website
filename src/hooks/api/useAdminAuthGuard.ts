// hooks/api/useAdminAuthGuard.ts
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import useAuthFetch from './useAuthFetch';

export function useAdminAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authFetch = useAuthFetch();
  
  // Use refs to track if we've already checked auth for this pathname
  // and to prevent multiple redirects
  const checkedPathRef = useRef<string | null>(null);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    // Reset the check when pathname changes
    if (checkedPathRef.current !== pathname) {
      checkedPathRef.current = pathname;
    }
    
    // Don't run the check if we're already on the login page or not on an admin route
    const isAdminRoute = pathname?.includes('/admin');
    const isLoginPage = pathname === '/admin';

    if (!isAdminRoute || isLoginPage) {
      setIsLoading(false);
      setIsAuthorized(isLoginPage ? null : true);
      return;
    }

    // Skip if we're already performing a check
    if (isCheckingRef.current) {
      return;
    }

    const checkAdminAuth = async () => {
      // Set flag to prevent concurrent checks
      isCheckingRef.current = true;
      
      try {
        setIsLoading(true);
        
        // Call the server API to check auth status
        const res = await authFetch('/api/auth/admin-check', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }

        const data = await res.json();
        
        if (!data.authenticated) {
          console.log('Not authenticated as admin:', data.message);
          setIsAuthorized(false);
          router.push('/admin'); // Redirect to login page
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Admin auth check failed:', err);
        setIsAuthorized(false);
        router.push('/admin');
      } finally {
        setIsLoading(false);
        // Reset the checking flag when done
        isCheckingRef.current = false;
      }
    };

    checkAdminAuth();
    
    // We don't need authFetch in the dependency array since we're using
    // the refs to prevent duplicate checks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

  return { isAuthorized, isLoading };
}