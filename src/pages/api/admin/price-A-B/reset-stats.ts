// src/pages/api/admin/price-A-B/reset-stats.ts
import { put } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { withAdminAuth } from "@/lib/api/middleware/adminApiMiddleware";

const BLOB_KEY = "price-tracking/stats.json";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Reset stats by writing an empty object
    await put(BLOB_KEY, JSON.stringify({}), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return res.status(200).json({ success: true, message: "Stats reset successfully" });
  } catch (error) {
    console.error("Error resetting stats:", error);
    return res.status(500).json({ 
      error: "Failed to reset stats",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Export with admin auth middleware
export default withAdminAuth(handler);