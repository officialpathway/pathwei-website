import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useAdminAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAdminRoute = pathname!.includes('/admin');

    if (!isAdminRoute) return;

    const check = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include' // 👈 Necesario para cookies
        });
        const data = await res.json();
        console.log('API says authenticated:', data.authenticated);
        if (!data.authenticated) {
          router.push('/admin'); // Redirigir a login
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/admin');
      }
    };

    check();
  }, [pathname, router]);
}
