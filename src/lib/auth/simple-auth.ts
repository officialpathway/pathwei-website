import { cookies } from 'next/headers';

export interface AdminUser {
  email: string;
  role: 'admin';
}

export async function validateCredentials(email: string, password: string): Promise<boolean> {
  return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('admin-session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24 hours
  });
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin-session')?.value === 'authenticated';
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}

export function getAdminUser(): AdminUser {
  return {
    email: process.env.ADMIN_EMAIL!,
    role: 'admin'
  };
}