// app/api/seo-data.json/route.ts
import { getSeoSettings } from '@/lib/api/seo';
import { NextResponse } from 'next/server';

export async function GET() {
  const seoData = await getSeoSettings();
  
  return NextResponse.json(seoData, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

// This ensures the route is treated as dynamic during build
export const dynamic = 'force-dynamic';

// Optional: Generate during build time
export async function generateStaticParams() {
  return [{}]; // Generate one static instance
}