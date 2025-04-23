// pages/api/admin/seo/settings.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSEOSettings, saveSEOSettings } from '@/lib/db/db';
import { withAdminAuth } from '@/lib/api/middleware/adminApiMiddleware';

// Handler function
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const settings = await getSEOSettings();
    return res.status(200).json(settings);
  }

  if (req.method === 'POST') {
    // Validate content type
    if (!req.headers['content-type']?.includes('application/json')) {
      return res.status(415).json({ error: 'Unsupported media type' });
    }

    const body = req.body;
    await saveSEOSettings(body);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Export with admin auth middleware
export default withAdminAuth(handler);