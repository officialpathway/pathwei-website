// src/pages/api/maintenance/reset-stats.ts
import { put, del } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

const BLOB_KEY = "price-tracking/stats.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    // Initialize new stats
    const initialStats = {
      "4.99": { clicks: 0, conversions: 0, lastUpdated: new Date().toISOString() },
      "7.49": { clicks: 0, conversions: 0, lastUpdated: new Date().toISOString() },
      "9.99": { clicks: 0, conversions: 0, lastUpdated: new Date().toISOString() }
    };

    await put(BLOB_KEY, JSON.stringify(initialStats), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error resetting stats:", error);
    return res.status(500).json({ error: "Failed to reset stats" });
  }
}