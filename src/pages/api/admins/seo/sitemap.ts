// pages/api/admin/seo/sitemap.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { isAdminAuthenticated } from '@/lib/api/auth/auth';
import { updateSitemapMetadata } from '@/lib/db/db';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Helper to add CORS headers
function addCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  addCorsHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Set Content-Type
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated(req);

    if (!isAuthenticated) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate sitemap content
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aihavenlabs.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;

    try {
      writeFileSync(
        join(process.cwd(), 'public', 'sitemap.xml'),
        sitemapContent
      );
    } catch (writeError) {
      console.error('Error writing sitemap file:', writeError);
      throw new Error('Failed to write sitemap file');
    }

    await updateSitemapMetadata({
      lastGenerated: new Date().toISOString(),
      status: 'active'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    
    try {
      await updateSitemapMetadata({ status: 'error' });
    } catch (metadataError) {
      console.error('Failed to update sitemap metadata:', metadataError);
    }
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}