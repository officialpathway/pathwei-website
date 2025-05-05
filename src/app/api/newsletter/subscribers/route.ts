// src/app/api/admin/newsletter/subscribers/route.ts
import { list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function GET() {
  console.log(`[GET /api/admin/newsletter/subscribers] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log(`[GET /api/admin/newsletter/subscribers] Admin authentication successful. User ID:`, data.user.id);
  
  const adminClient = createAdminClient();

  try {
    // Check if user has admin role
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (userError || userData?.role !== 'admin') {
      console.error(`[GET /api/admin/newsletter/subscribers] Unauthorized access attempt by user:`, data.user.id);
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    // Fetch emails from blob storage
    const { blobs } = await list({
      prefix: "emails.txt",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    if (blobs.length === 0) {
      console.log(`[GET /api/admin/newsletter/subscribers] No subscribers found`);
      return NextResponse.json({ subscribers: [] });
    }
    
    // Get content from the blob
    const response = await fetch(blobs[0].url);
    const content = await response.text();
    
    // Parse the content into an array of emails
    const emails = content
      .split('\n')
      .filter(email => email.trim() !== '')
      .map(email => email.trim());
    
    console.log(`[GET /api/admin/newsletter/subscribers] Retrieved ${emails.length} subscribers`);
    
    return NextResponse.json({
      subscribers: emails,
      count: emails.length,
      lastUpdated: blobs[0].uploadedAt
    });
  } catch (error) {
    console.error(`[GET /api/admin/newsletter/subscribers] Error fetching subscribers:`, error);
    return NextResponse.json({ 
      error: "Failed to retrieve subscribers",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// Optional: Add DELETE endpoint to remove a subscriber
export async function DELETE(request: NextRequest) {
  console.log(`[DELETE /api/admin/newsletter/subscribers] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log(`[DELETE /api/admin/newsletter/subscribers] Admin authentication successful. User ID:`, data.user.id);
  
  const adminClient = createAdminClient();

  try {
    // Check if user has admin role
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (userError || userData?.role !== 'admin') {
      console.error(`[DELETE /api/admin/newsletter/subscribers] Unauthorized access attempt by user:`, data.user.id);
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      console.error(`[DELETE /api/admin/newsletter/subscribers] Missing email parameter`);
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Fetch existing emails
    const { blobs } = await list({
      prefix: "emails.txt",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    if (blobs.length === 0) {
      console.log(`[DELETE /api/admin/newsletter/subscribers] No subscribers found`);
      return NextResponse.json({ message: 'No subscribers found' });
    }
    
    const response = await fetch(blobs[0].url);
    const content = await response.text();
    
    // Filter out the email to remove
    const emails = content
      .split('\n')
      .filter(e => e.trim() !== '' && e.trim() !== email.trim())
      .map(e => e.trim());
    
    // Update the blob with the new list
    const { put } = await import("@vercel/blob");
    await put("emails.txt", emails.join('\n') + '\n', {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    console.log(`[DELETE /api/admin/newsletter/subscribers] Successfully removed email: ${email}`);
    
    return NextResponse.json({
      message: 'Subscriber removed successfully',
      remaining: emails.length
    });
  } catch (error) {
    console.error(`[DELETE /api/admin/newsletter/subscribers] Error removing subscriber:`, error);
    return NextResponse.json({ 
      error: "Failed to remove subscriber",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}