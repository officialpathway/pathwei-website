// src/app/api/admin/price-A-B/get-download-url/route.ts
import { head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from '@/lib/utils/supabase/server';

const BLOB_KEY = "price-tracking/stats.json";

export async function GET() {
  console.log(`[GET /api/admin/price-A-B/get-download-url] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log(`[GET /api/admin/price-A-B/get-download-url] Admin authentication successful. User ID:`, data.user.id);
  
  try {
    const blob = await head(BLOB_KEY, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    if (!blob) {
      console.error(`[GET /api/admin/price-A-B/get-download-url] Stats file not found`);
      return NextResponse.json({ error: "Stats file not found" }, { status: 404 });
    }
    
    // Return the download URL
    console.log(`[GET /api/admin/price-A-B/get-download-url] Download URL retrieved successfully`);
    return NextResponse.json({ 
      url: blob.url,
      downloadUrl: `${blob.url}?download=1`,
      filename: "stats.json"
    });
  } catch (error) {
    console.error(`[GET /api/admin/price-A-B/get-download-url] Error getting download URL:`, error);
    return NextResponse.json({ 
      error: "Failed to get download URL",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}