// src/components/auth-wrapper.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const authCookie = getCookie('adminAuth');
    if (!authCookie) {
      router.push('/admin');
    }
  }, [router]);

  return <>{children}</>;
}