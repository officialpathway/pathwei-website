// app/api/admin/seo/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import { createClient as createPgClient } from '@vercel/postgres';
import { SEOData } from '@/types/seo';

// Create a single Postgres client for reuse
let pgClient: ReturnType<typeof createPgClient> | null = null;

// Function to get a Postgres client (creating a new one if needed)
function getPgClient() {
  if (!pgClient) {
    pgClient = createPgClient();
  }
  return pgClient;
}

// GET handler
export async function GET() {
  console.log('[GET /api/admin/seo/settings] Request received');
  const startTime = Date.now();
  
  const supabase = await createClient();

  // Check if the user is authenticated
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('[GET /api/admin/seo/settings] Authentication failed:', error);
    redirect('/admin/login');
  }

  console.log(`[GET /api/admin/seo/settings] Authentication successful (${Date.now() - startTime}ms). User ID: ${data.user.id}`);
  
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
  
  console.log(`[GET /api/admin/seo/settings] Admin check successful (${Date.now() - startTime}ms)`);
  
  // Get the Postgres client
  const pg = getPgClient();
  
  try {
    // Fetch settings with a simple query
    console.log(`[GET /api/admin/seo/settings] Fetching data from DB (${Date.now() - startTime}ms)`);
    const queryStart = Date.now();
    const { rows } = await pg.query('SELECT * FROM seo_settings ORDER BY id ASC LIMIT 1');
    console.log(`[GET /api/admin/seo/settings] DB query completed in ${Date.now() - queryStart}ms`);
    
    // If no settings exist, insert default ones
    if (rows.length === 0) {
      console.log('[GET /api/admin/seo/settings] No SEO settings found, creating defaults');
      
      const defaultSettings = {
        title: 'AI Haven Labs',
        description: 'AI solutions and research for enterprises and developers',
        keywords: 'AI, machine learning, neural networks, artificial intelligence',
        allow_indexing: true,
        og_title: 'AI Haven Labs',
        og_description: 'Leading the future of AI development and research',
        og_image: '/images/og-image.jpg',
        twitter_card: 'summary_large_image',
        twitter_image: '/images/twitter-card.jpg',
        twitter_handle: '@aihavenlabs',
        sitemap_status: 'inactive',
        sitemap_frequency: 'weekly',
        sitemap_priority: '0.8',
        robots_txt: 'User-agent: *\nAllow: /\nDisallow: /admin/',
        json_ld: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "AI Haven Labs",\n  "url": "https://aihavenlabs.com"\n}',
        canonical_url: 'https://aihavenlabs.com',
        alternate_languages: '{}',
        favicon: '/favicon.ico',
        theme_color: '#4f46e5',
        meta_robots: 'index, follow',
        twitter_site: '@aihavenlabs',
        twitter_creator: '@aihavenlabs',
        fb_app_id: '',
        og_locale: 'en_US',
        og_type: 'website',
        og_site_name: 'AI Haven Labs'
      };
      
      const insertStart = Date.now();
      const result = await pg.query(`
        INSERT INTO seo_settings (
          title, description, keywords, allow_indexing, og_title, og_description, 
          og_image, twitter_card, twitter_image, twitter_handle, sitemap_status, 
          sitemap_frequency, sitemap_priority, robots_txt, json_ld, canonical_url, 
          alternate_languages, favicon, theme_color, meta_robots, twitter_site, 
          twitter_creator, fb_app_id, og_locale, og_type, og_site_name
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
          $17::jsonb, $18, $19, $20, $21, $22, $23, $24, $25, $26
        )
        RETURNING *
      `, [
        defaultSettings.title,
        defaultSettings.description,
        defaultSettings.keywords,
        defaultSettings.allow_indexing,
        defaultSettings.og_title,
        defaultSettings.og_description,
        defaultSettings.og_image,
        defaultSettings.twitter_card,
        defaultSettings.twitter_image,
        defaultSettings.twitter_handle,
        defaultSettings.sitemap_status,
        defaultSettings.sitemap_frequency,
        defaultSettings.sitemap_priority,
        defaultSettings.robots_txt,
        defaultSettings.json_ld,
        defaultSettings.canonical_url,
        defaultSettings.alternate_languages,
        defaultSettings.favicon,
        defaultSettings.theme_color,
        defaultSettings.meta_robots,
        defaultSettings.twitter_site,
        defaultSettings.twitter_creator,
        defaultSettings.fb_app_id,
        defaultSettings.og_locale,
        defaultSettings.og_type,
        defaultSettings.og_site_name
      ]);
      console.log(`[GET /api/admin/seo/settings] Insert completed in ${Date.now() - insertStart}ms`);
      
      // Format response
      const formattedResponse = formatResponse(result.rows[0]);
      console.log(`[GET /api/admin/seo/settings] Response ready in ${Date.now() - startTime}ms`);
      return NextResponse.json(formattedResponse);
    }
    
    // Format response
    const formattedResponse = formatResponse(rows[0]);
    console.log(`[GET /api/admin/seo/settings] Response ready in ${Date.now() - startTime}ms`);
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('[GET /api/admin/seo/settings] Error fetching SEO settings:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

// POST handler
export async function POST(request: NextRequest) {
  console.log('[POST /api/admin/seo/settings] Request received');
  const startTime = Date.now();
  
  const supabase = await createClient();

  // Check if the user is authenticated
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('[POST /api/admin/seo/settings] Authentication failed:', error);
    redirect('/admin/login');
  }

  console.log(`[POST /api/admin/seo/settings] Authentication successful (${Date.now() - startTime}ms). User ID: ${data.user.id}`);
  
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
  
  console.log(`[POST /api/admin/seo/settings] Admin check successful (${Date.now() - startTime}ms)`);
  
  // Check content type
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    console.error('[POST /api/admin/seo/settings] Invalid content type:', contentType);
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
  }
  
  // Get the Postgres client
  const pg = getPgClient();
  
  try {
    const parseStart = Date.now();
    const body: SEOData = await request.json();
    console.log(`[POST /api/admin/seo/settings] Request parsed in ${Date.now() - parseStart}ms`);
    
    // Check if settings exist
    const checkStart = Date.now();
    const { rows: existingRows } = await pg.query('SELECT id FROM seo_settings LIMIT 1');
    console.log(`[POST /api/admin/seo/settings] Existence check completed in ${Date.now() - checkStart}ms`);
    
    // Convert alternateLanguages object to JSON string
    const alternateLanguagesJson = JSON.stringify(body.alternateLanguages || {});
    
    const updateStart = Date.now();
    if (existingRows.length > 0) {
      // Update existing settings
      console.log('[POST /api/admin/seo/settings] Updating existing SEO settings');
      
      await pg.query(`
        UPDATE seo_settings
        SET 
          title = $1,
          description = $2,
          keywords = $3,
          allow_indexing = $4,
          og_title = $5,
          og_description = $6,
          og_image = $7,
          twitter_card = $8,
          twitter_image = $9,
          twitter_handle = $10,
          sitemap_last_generated = $11,
          sitemap_status = $12,
          sitemap_frequency = $13,
          sitemap_priority = $14,
          robots_txt = $15,
          json_ld = $16,
          canonical_url = $17,
          alternate_languages = $18::jsonb,
          favicon = $19,
          theme_color = $20,
          meta_robots = $21,
          twitter_site = $22,
          twitter_creator = $23,
          fb_app_id = $24,
          og_locale = $25,
          og_type = $26,
          og_site_name = $27,
          updated_at = NOW()
        WHERE id = $28
      `, [
        body.title || '',
        body.description || '',
        body.keywords || '',
        body.allowIndexing,
        body.ogTitle || '',
        body.ogDescription || '',
        body.ogImage || '',
        body.twitterCard || '',
        body.twitterImage || '',
        body.twitterHandle || '',
        body.sitemapLastGenerated || null,
        body.sitemapStatus || '',
        body.sitemapFrequency || '',
        body.sitemapPriority || '',
        body.robotsTxt || '',
        body.jsonLd || '',
        body.canonicalUrl || '',
        alternateLanguagesJson,
        body.favicon || '',
        body.themeColor || '',
        body.metaRobots || '',
        body.twitterSite || '',
        body.twitterCreator || '',
        body.fbAppId || '',
        body.ogLocale || '',
        body.ogType || '',
        body.ogSiteName || '',
        existingRows[0].id
      ]);
    } else {
      // Insert new settings
      console.log('[POST /api/admin/seo/settings] Creating new SEO settings');
      
      await pg.query(`
        INSERT INTO seo_settings (
          title, description, keywords, allow_indexing, og_title, og_description, 
          og_image, twitter_card, twitter_image, twitter_handle, sitemap_last_generated, 
          sitemap_status, sitemap_frequency, sitemap_priority, robots_txt, json_ld, 
          canonical_url, alternate_languages, favicon, theme_color, meta_robots, 
          twitter_site, twitter_creator, fb_app_id, og_locale, og_type, og_site_name
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
          $17, $18::jsonb, $19, $20, $21, $22, $23, $24, $25, $26, $27
        )
      `, [
        body.title || '',
        body.description || '',
        body.keywords || '',
        body.allowIndexing,
        body.ogTitle || '',
        body.ogDescription || '',
        body.ogImage || '',
        body.twitterCard || '',
        body.twitterImage || '',
        body.twitterHandle || '',
        body.sitemapLastGenerated || null,
        body.sitemapStatus || '',
        body.sitemapFrequency || '',
        body.sitemapPriority || '',
        body.robotsTxt || '',
        body.jsonLd || '',
        body.canonicalUrl || '',
        alternateLanguagesJson,
        body.favicon || '',
        body.themeColor || '',
        body.metaRobots || '',
        body.twitterSite || '',
        body.twitterCreator || '',
        body.fbAppId || '',
        body.ogLocale || '',
        body.ogType || '',
        body.ogSiteName || ''
      ]);
    }
    console.log(`[POST /api/admin/seo/settings] Update/insert completed in ${Date.now() - updateStart}ms`);
    
    console.log(`[POST /api/admin/seo/settings] SEO settings saved successfully (${Date.now() - startTime}ms)`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/admin/seo/settings] Error saving SEO settings:', error);
    return NextResponse.json({ error: 'Failed to save SEO settings' }, { status: 500 });
  }
}

// Format database response for the client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatResponse(data: any): SEOData {
  return {
    title: data.title || '',
    description: data.description || '',
    keywords: data.keywords || '',
    allowIndexing: data.allow_indexing || true,
    ogTitle: data.og_title || '',
    ogDescription: data.og_description || '',
    ogImage: data.og_image || '',
    twitterCard: data.twitter_card || '',
    twitterImage: data.twitter_image || '',
    twitterHandle: data.twitter_handle || '',
    sitemapLastGenerated: data.sitemap_last_generated || '',
    sitemapStatus: data.sitemap_status || '',
    sitemapFrequency: data.sitemap_frequency || '',
    sitemapPriority: data.sitemap_priority || '',
    robotsTxt: data.robots_txt || '',
    jsonLd: data.json_ld || '',
    canonicalUrl: data.canonical_url || '',
    alternateLanguages: data.alternate_languages || {},
    favicon: data.favicon || '',
    themeColor: data.theme_color || '',
    metaRobots: data.meta_robots || '',
    twitterSite: data.twitter_site || '',
    twitterCreator: data.twitter_creator || '',
    fbAppId: data.fb_app_id || '',
    ogLocale: data.og_locale || '',
    ogType: data.og_type || '',
    ogSiteName: data.og_site_name || ''
  };
}