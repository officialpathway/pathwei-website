// app/api/admin/seo/sitemap/route.ts
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import { updateSitemapMetadata } from '@/lib/db/db';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Helper to add CORS headers
function addCorsHeaders(headers: Headers) {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  console.log('[OPTIONS /api/admin/seo/sitemap] CORS preflight request received');
  
  const response = new NextResponse(null, { status: 204 });
  addCorsHeaders(response.headers);
  
  return response;
}

// POST handler
export async function POST() {
  console.log('[POST /api/admin/seo/sitemap] Request received');
  
  const response = NextResponse.next();
  addCorsHeaders(response.headers);
  
  const supabase = await createClient();

  // Check if the user is authenticated
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('[POST /api/admin/seo/sitemap] Authentication failed:', error);
    redirect('/admin/login');
  }
  
  console.log('[POST /api/admin/seo/sitemap] Authentication successful. User ID:', data.user.id);
  
  // Create the admin client for administrative operations
  const adminClient = createAdminClient();
  
  // Check if user is an admin
  const { data: userData, error: userError } = await adminClient
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();
    
  if (userError || !userData || userData.role !== 'admin') {
    console.error('[POST /api/admin/seo/sitemap] Admin authorization failed:', userError);
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    // Generate sitemap content
    console.log('[POST /api/admin/seo/sitemap] Generating sitemap content');
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aihavenlabs.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;

    try {
      console.log('[POST /api/admin/seo/sitemap] Writing sitemap file to disk');
      await writeFile(
        join(process.cwd(), 'public', 'sitemap.xml'),
        sitemapContent
      );
      console.log('[POST /api/admin/seo/sitemap] Sitemap file written successfully');
    } catch (writeError) {
      console.error('[POST /api/admin/seo/sitemap] Error writing sitemap file:', writeError);
      throw new Error('Failed to write sitemap file');
    }

    console.log('[POST /api/admin/seo/sitemap] Updating sitemap metadata');
    await updateSitemapMetadata({
      lastGenerated: new Date().toISOString(),
      status: 'active'
    });
    console.log('[POST /api/admin/seo/sitemap] Sitemap metadata updated successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/admin/seo/sitemap] Sitemap Generation Error:', error);
    
    try {
      console.log('[POST /api/admin/seo/sitemap] Updating sitemap metadata with error status');
      await updateSitemapMetadata({ status: 'error' });
    } catch (metadataError) {
      console.error('[POST /api/admin/seo/sitemap] Failed to update sitemap metadata:', metadataError);
    }
    
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}