// src/app/api/newsletter/subscribers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import { NewsletterService } from "@/lib/db/newsletter";

export async function GET() {
  console.log(`[GET /api/admin/newsletter/subscribers] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log('[GET /api/admin/newsletter/subscribers] Admin authentication successful.');
  
  const adminClient = createAdminClient();

  try {
    // Check if user has admin role
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (userError || userData?.role !== 'admin') {
      console.error('[GET /api/admin/newsletter/subscribers]');
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    // Get subscribers from database
    const subscribers = await NewsletterService.getAllSubscribers();
    const count = await NewsletterService.getSubscriberCount();
    const lastUpdated = await NewsletterService.getLatestSubscriptionDate();
    
    console.log(`[GET /api/admin/newsletter/subscribers] Retrieved ${count} subscribers`);
    
    return NextResponse.json({
      subscribers: subscribers.map(sub => ({ email: sub.email })),
      count,
      lastUpdated: lastUpdated?.toISOString()
    });
    
  } catch (error) {
    console.error(`[GET /api/admin/newsletter/subscribers] Error fetching subscribers:`, error);
    return NextResponse.json({ 
      error: "Failed to retrieve subscribers",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// Delete a subscriber
export async function DELETE(request: NextRequest) {
  console.log(`[DELETE /api/admin/newsletter/subscribers] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log('[DELETE /api/admin/newsletter/subscribers] Admin authentication successful.');
  
  const adminClient = createAdminClient();

  try {
    // Check if user has admin role
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (userError || userData?.role !== 'admin') {
      console.error('[DELETE /api/admin/newsletter/subscribers]');
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      console.error(`[DELETE /api/admin/newsletter/subscribers] Missing email parameter`);
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Delete the subscriber
    const success = await NewsletterService.deleteSubscriber(email);
    
    if (!success) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }
    
    const remainingCount = await NewsletterService.getSubscriberCount();
    
    console.log(`[DELETE /api/admin/newsletter/subscribers] Successfully removed email: ${email}`);
    
    return NextResponse.json({
      message: 'Subscriber removed successfully',
      remaining: remainingCount
    });
    
  } catch (error) {
    console.error(`[DELETE /api/admin/newsletter/subscribers] Error removing subscriber:`, error);
    return NextResponse.json({ 
      error: "Failed to remove subscriber",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}