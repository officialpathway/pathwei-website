import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAdminAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const isAdminRoute = pathname?.includes('/admin');

    if (!isAdminRoute) return;

    const checkAdminAuth = async () => {
      try {
        // Call the server API to check the admin auth cookie
        const res = await fetch('/api/auth/admin-check', {
          method: 'GET',
          credentials: 'include', // Important for sending cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Admin auth check response:', data);

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
      }
    };

    checkAdminAuth();
  }, [pathname, router]);

  return { isAuthorized };
}