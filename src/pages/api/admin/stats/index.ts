// src/pages/api/admin/stats/index.ts
import { list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateBasicAuth } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Authentication check
  const isAuthenticated = req.cookies.adminAuth === process.env.ADMIN_AUTH_TOKEN || 
                        validateBasicAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { blobs } = await list({
      prefix: 'locale-stats/',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    const stats = {
      total: blobs.length,
      byLocale: blobs.reduce((acc, blob) => {
        const locale = blob.pathname.split('/')[1] || 'unknown';
        acc[locale] = (acc[locale] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: blobs
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 50)
        .map(blob => ({
          url: blob.url,
          downloadUrl: blob.downloadUrl,
          uploadedAt: blob.uploadedAt,
          size: blob.size
        }))
    };

    // Add caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}