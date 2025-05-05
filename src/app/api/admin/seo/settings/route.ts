// app/api/admin/seo/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import { getSEOSettings, saveSEOSettings } from '@/lib/db/db';

// GET handler
export async function GET() {
  console.log('[GET /api/admin/seo/settings] Request received');
  
  const supabase = await createClient();

  // Check if the user is authenticated
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('[GET /api/admin/seo/settings] Authentication failed:', error);
    redirect('/admin/login');
  }
  
  console.log('[GET /api/admin/seo/settings] Authentication successful. User ID:', data.user.id);
  
  // Create the admin client for administrative operations
  const adminClient = createAdminClient();
  
  // Check if user is an admin
  const { data: userData, error: userError } = await adminClient
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();
    
  if (userError || !userData || userData.role !== 'admin') {
    console.error('[GET /api/admin/seo/settings] Admin authorization failed:', userError);
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  
  try {
    console.log('[GET /api/admin/seo/settings] Fetching SEO settings');
    const settings = await getSEOSettings();
    console.log('[GET /api/admin/seo/settings] Settings retrieved successfully');
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[GET /api/admin/seo/settings] Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

// POST handler
export async function POST(request: NextRequest) {
  console.log('[POST /api/admin/seo/settings] Request received');
  
  const supabase = await createClient();

  // Check if the user is authenticated
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('[POST /api/admin/seo/settings] Authentication failed:', error);
    redirect('/admin/login');
  }
  
  console.log('[POST /api/admin/seo/settings] Authentication successful. User ID:', data.user.id);
  
  // Create the admin client for administrative operations
  const adminClient = createAdminClient();
  
  // Check if user is an admin
  const { data: userData, error: userError } = await adminClient
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();
    
  if (userError || !userData || userData.role !== 'admin') {
    console.error('[POST /api/admin/seo/settings] Admin authorization failed:', userError);
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  
  // Validate content type
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    console.error('[POST /api/admin/seo/settings] Invalid content type:', contentType);
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
  }

  try {
    const body = await request.json();
    console.log('[POST /api/admin/seo/settings] Saving SEO settings');
    await saveSEOSettings(body);
    console.log('[POST /api/admin/seo/settings] Settings saved successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/admin/seo/settings] Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save SEO settings' }, { status: 500 });
  }
}