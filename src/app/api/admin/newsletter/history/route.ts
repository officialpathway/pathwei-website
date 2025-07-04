// src/app/api/admin/newsletter/history/route.ts
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/simple-auth';
import { prisma } from '@/lib/db/newsletter';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emails = await prisma.bulkEmail.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50 // Limit to last 50 emails
    });

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Email history fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch email history' }, { status: 500 });
  }
}