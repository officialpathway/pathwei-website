// src/app/api/admin/assets/[id]/route.ts
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

    const asset = await prisma.activeAsset.update({
      where: { id: params.id },
      data: {
        name: data.name,
        type: data.type,
        provider: data.provider,
        cost: parseFloat(data.cost),
        currency: data.currency || 'USD',
        purchaseDate: new Date(data.purchaseDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        status: data.status || 'active',
        autoRenew: data.autoRenew || false,
        recurringPeriod: data.recurringPeriod || 'yearly',
        notes: data.notes
      }
    });

    return NextResponse.json({ asset });
  } catch (error) {
    console.error('Asset update error:', error);
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await context.params;

    await prisma.activeAsset.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Asset deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}