// /api/locale-stats/route.ts
import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Add this if you want to prevent static behavior

export async function GET() {
  // Authentication check
  const authCookie = (await cookies()).get('adminAuth');
  
  if (!authCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { blobs } = await list({
      prefix: 'locale-stats/',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    const stats = {
      total: blobs.length,
      byLocale: blobs.reduce((acc, blob) => {
        const locale = blob.pathname.split('/')[1] || 'unknown';
        acc[locale] = (acc[locale] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: blobs
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 50)
        .map(blob => ({
          url: blob.url,
          downloadUrl: blob.downloadUrl,
          uploadedAt: blob.uploadedAt
        }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Explicitly disallow other methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}