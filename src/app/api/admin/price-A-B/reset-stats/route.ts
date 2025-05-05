// src/app/api/admin/price-A-B/reset-stats/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from '@/lib/utils/supabase/server';

const BLOB_KEY = "price-tracking/stats.json";

export async function POST() {
  console.log(`[POST /api/admin/price-A-B/reset-stats] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log(data);
  console.log(`[POST /api/admin/price-A-B/reset-stats] Admin authentication successful. User ID:`, data.user.id);
  
  try {
    // Reset stats by writing an empty object
    await put(BLOB_KEY, JSON.stringify({}), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    console.log(`[POST /api/admin/price-A-B/reset-stats] Stats reset successfully`);
    return NextResponse.json({ success: true, message: "Stats reset successfully" });
  } catch (error) {
    console.error(`[POST /api/admin/price-A-B/reset-stats] Error resetting stats:`, error);
    return NextResponse.json({ 
      error: "Failed to reset stats",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}