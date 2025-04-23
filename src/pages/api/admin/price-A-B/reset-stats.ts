// src/pages/api/admin/price-A-B/reset-stats.ts
import { put, del, head } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminAuthenticated } from "@/lib/api/auth/auth";

const BLOB_KEY = "price-tracking/stats.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Reset stats endpoint called", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    cookies: req.cookies,
    env: process.env.NODE_ENV
  });

  // Authentication check
  let isAuthenticated = false;
  try {
    isAuthenticated = await isAdminAuthenticated(req);
    console.log("Authentication result:", isAuthenticated);
  } catch (authError) {
    console.error("Authentication error:", authError);
    return res.status(401).json({ 
      error: "Authentication error", 
      details: authError instanceof Error ? authError.message : "Unknown authentication error" 
    });
  }

  if (!isAuthenticated) {
    console.warn("Unauthorized reset attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    console.warn(`Invalid method: ${req.method}`);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Bypass environment check for testing
  // Comment this out if needed in production
  // if (process.env.NODE_ENV !== "development") {
  //   console.warn(`Invalid environment: ${process.env.NODE_ENV}`);
  //   return res.status(403).json({
  //     error: "This endpoint is only available in development",
  //   });
  // }

  try {    
    // Check if the blob exists first
    let blobExists = false;
    try {
      const blob = await head(BLOB_KEY, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      blobExists = !!blob;
      console.log("Blob check result:", { exists: blobExists, blobInfo: blob });
    } catch (checkError) {
      console.error("Error checking if blob exists:", checkError);
    }
    
    // Delete existing stats if they exist
    if (blobExists) {
      try {
        await del(BLOB_KEY, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (deleteError) {
        console.error("Error deleting existing stats:", deleteError);
        // Continue anyway - we'll overwrite the stats
      }
    } else {
      console.log("No existing stats blob to delete");
    }

    // Initialize new stats with default price points
    console.log("Creating new stats with default values");
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

    const putResult = await put(BLOB_KEY, JSON.stringify(initialStats), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return res.status(200).json({ 
      success: true,
      message: "Stats reset successfully",
      blobUrl: putResult.url
    });
  } catch (error) {
    console.error("Error resetting stats:", error);
    return res.status(500).json({ 
      error: "Failed to reset stats",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}