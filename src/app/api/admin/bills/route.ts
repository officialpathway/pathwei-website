// src/app/api/admin/bills/route.ts
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/simple-auth';
import { prisma } from '@/lib/db/newsletter';

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const bills = await prisma.bill.findMany({
      where,
      include: {
        asset: true
      },
      orderBy: { dueDate: 'desc' },
      take: limit
    });

    return NextResponse.json({ bills });
  } catch (error) {
    console.error('Bills fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const bill = await prisma.bill.create({
      data: {
        assetId: data.assetId || null,
        description: data.description,
        amount: parseFloat(data.amount),
        currency: data.currency || 'USD',
        category: data.category,
        vendor: data.vendor,
        dueDate: new Date(data.dueDate),
        paidDate: data.paidDate ? new Date(data.paidDate) : null,
        periodStart: data.periodStart ? new Date(data.periodStart) : null,
        periodEnd: data.periodEnd ? new Date(data.periodEnd) : null,
        status: data.status || 'pending',
        recurring: data.recurring || false,
        recurringPeriod: data.recurringPeriod,
        paymentMethod: data.paymentMethod,
        reference: data.reference,
        notes: data.notes
      },
      include: {
        asset: true
      }
    });

    return NextResponse.json({ bill });
  } catch (error) {
    console.error('Bill creation error:', error);
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 });
  }
}