// src/app/api/admin/database/action/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/simple-auth';

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { endpoint, method = 'GET', data } = await request.json();

    const baseUrl = 'http://localhost:3000/api/v1';
    const url = `${baseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add any required API keys or authentication headers here
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: result
    });
  } catch (error) {
    console.error('Database action error:', error);
    return NextResponse.json({ error: 'Failed to execute database action' }, { status: 500 });
  }
}