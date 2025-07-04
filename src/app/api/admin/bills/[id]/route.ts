// src/app/api/admin/bills/[id]/route.ts
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/simple-auth';
import { prisma } from '@/lib/db/newsletter';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;
    const data = await request.json();

    const bill = await prisma.bill.update({
      where: { id: params.id },
      data: {
        assetId: data.assetId || null,
        description: data.description,
        amount: parseFloat(data.amount),
        currency: data.currency || 'USD',
        category: data.category,
        vendor: data.vendor,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
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
    console.error('Bill update error:', error);
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;

    await prisma.bill.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bill deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
}