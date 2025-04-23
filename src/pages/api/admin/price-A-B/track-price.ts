// src/pages/api/admin/price-A-B/track-price.ts
import { put, head } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminAuthenticated } from "@/lib/api/auth/auth";

const BLOB_KEY = "price-tracking/stats.json";

interface PriceStat {
  clicks: number;
  conversions: number;
  lastUpdated: string;
}

interface PriceStats {
  [price: string]: PriceStat;
}

// Helper function to get stats from blob storage
async function getStatsFromBlob(): Promise<PriceStats> {
  try {
    const blob = await head(BLOB_KEY, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    if (blob) {
      const response = await fetch(blob.url);
      return await response.json();
    }
  } catch {
    console.log("Error getting stats or stats file doesn't exist yet");
  }
  
  // Return empty stats if none exist yet
  return {}; 
}

// Helper function to transform raw stats to frontend format
function transformStatsForFrontend(rawStats: PriceStats): Array<{
  price: number;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  last_updated: string;
}> {
  return Object.entries(rawStats).map(([priceStr, stat]) => {
    const price = parseFloat(priceStr);
    const clicks = stat.clicks || 0;
    const conversions = stat.conversions || 0;
    const conversion_rate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    return {
      price,
      clicks,
      conversions,
      conversion_rate,
      last_updated: stat.lastUpdated
    };
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET request to fetch stats
    if (req.method === "GET") {
      // Authentication check for GET
      const isAuthenticated = await isAdminAuthenticated(req);
      if (!isAuthenticated) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const rawStats = await getStatsFromBlob();
      const formattedStats = transformStatsForFrontend(rawStats);
      
      // Sort by price
      formattedStats.sort((a, b) => a.price - b.price);
      
      return res.status(200).json(formattedStats);
    }
    
    // POST request to update stats
    else if (req.method === "POST") {
      const { price, isConversion = false } = req.body;
      
      if (typeof price !== "number") {
        return res.status(400).json({ error: "Invalid input: price must be a number" });
      }

      const stats = await getStatsFromBlob();

      const priceKey = price.toFixed(2);
      stats[priceKey] = {
        clicks: (stats[priceKey]?.clicks || 0) + (isConversion ? 0 : 1),
        conversions: (stats[priceKey]?.conversions || 0) + (isConversion ? 1 : 0),
        lastUpdated: new Date().toISOString()
      };

      await put(BLOB_KEY, JSON.stringify(stats), {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}