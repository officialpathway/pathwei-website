// src/pages/api/admin/price-A-B/get-download-url.ts
import { head } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminAuthenticated } from "@/lib/api/auth/auth";

const BLOB_KEY = "price-tracking/stats.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Authentication check
  const isAuthenticated = await isAdminAuthenticated(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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