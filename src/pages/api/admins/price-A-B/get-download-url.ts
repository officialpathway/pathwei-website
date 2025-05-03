// src/pages/api/admin/price-A-B/get-download-url.ts
import { head } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { withAdminAuth } from "@/lib/api/middleware/adminApiMiddleware";

const BLOB_KEY = "price-tracking/stats.json";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const blob = await head(BLOB_KEY, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    if (!blob) {
      return res.status(404).json({ error: "Stats file not found" });
    }
    
    // Return the download URL
    return res.status(200).json({ 
      url: blob.url,
      downloadUrl: `${blob.url}?download=1`,
      filename: "stats.json"
    });
  } catch (error) {
    console.error("Error getting download URL:", error);
    return res.status(500).json({ 
      error: "Failed to get download URL",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

// Export with admin auth middleware
export default withAdminAuth(handler);