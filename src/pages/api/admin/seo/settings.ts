// src/pages/api/admin/seo/settings.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSEOSettings, saveSEOSettings } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check admin authentication
  const isAuthenticated = await isAdminAuthenticated(req);
  
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Always set Content-Type first
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET') {
      const settings = await getSEOSettings();
      return res.status(200).json(settings);
    }

    if (req.method === 'POST') {
      // Validate content type
      if (req.headers['content-type'] !== 'application/json') {
        return res.status(415).json({ error: 'Unsupported media type' });
      }

      const body = req.body;
      await saveSEOSettings(body);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}