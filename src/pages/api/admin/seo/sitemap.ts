import type { NextApiRequest, NextApiResponse } from 'next';
import { isAdminAuthenticated } from '@/lib/auth/auth';
import { updateSitemapMetadata } from '@/lib/db';
import { writeFileSync } from 'fs';
import { join } from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check admin authentication
  const isAuthenticated = await isAdminAuthenticated(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aihavenlabs.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;

    writeFileSync(
      join(process.cwd(), 'public', 'sitemap.xml'),
      sitemapContent
    );

    await updateSitemapMetadata({
      lastGenerated: new Date().toISOString(),
      status: 'active'
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    await updateSitemapMetadata({ status: 'error' });
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}