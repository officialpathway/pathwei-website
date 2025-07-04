// src/app/api/admin/assets/route.ts
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/simple-auth';
import { prisma } from '@/lib/db/newsletter';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const assets = await prisma.activeAsset.findMany({
      include: {
        bills: {
          orderBy: { dueDate: 'desc' },
          take: 5 // Latest 5 bills per asset
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Assets fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    const asset = await prisma.activeAsset.create({
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
    console.error('Asset creation error:', error);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}