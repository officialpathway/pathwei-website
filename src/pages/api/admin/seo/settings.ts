// src/pages/api/admin/seo/settings.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSEOSettings, saveSEOSettings } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // AUTH CHECK // PROTECTED ROUTE
  const authCookie = req.cookies.adminAuth;
  
  if (!authCookie || authCookie !== 'true') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // AUTH CHECK // PROTECTED ROUTE
  
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
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}