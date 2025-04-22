// src/pages/api/admin/stats/reset.ts
import { put, del } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { validateBasicAuth } from '@/lib/auth';

const BLOB_KEY = "price-tracking/stats.json";

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error: "This endpoint is only available in development",
    });
  }

  try {
    // Delete existing stats
    await del(BLOB_KEY, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Initialize new stats with default price points
    const initialStats = {
      "4.99": { 
        clicks: 0, 
        conversions: 0, 
        lastUpdated: new Date().toISOString() 
      },
      "7.49": { 
        clicks: 0, 
        conversions: 0, 
        lastUpdated: new Date().toISOString() 
      },
      "9.99": { 
        clicks: 0, 
        conversions: 0, 
        lastUpdated: new Date().toISOString() 
      }
    };

    await put(BLOB_KEY, JSON.stringify(initialStats), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error resetting stats:", error);
    return res.status(500).json({ 
      error: "Failed to reset stats",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}