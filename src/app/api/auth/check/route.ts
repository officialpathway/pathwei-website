// app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { isAuthenticated, getAdminUser } from '@/lib/auth/simple-auth';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json(getAdminUser());
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
  }
}