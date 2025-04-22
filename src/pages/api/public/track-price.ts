import { put, head } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminAuthenticated } from "@/lib/auth/auth"; // Using our auth helper function

const BLOB_KEY = "price-tracking/stats.json";

interface PriceStat {
  clicks: number;
  conversions: number;
  lastUpdated: string;
}

interface PriceStats {
  [price: string]: PriceStat;
}

// Rate limiting setup (moved to separate file in production)
const rateLimitCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 20
};

function checkRateLimit(ip: string | string[] | undefined): boolean {
  if (!ip) return false;
  const clientIp = Array.isArray(ip) ? ip[0] : ip;
  const now = Date.now();
  
  if (!rateLimitCache.has(clientIp)) {
    rateLimitCache.set(clientIp, { count: 1, lastReset: now });
    return false;
  }

  const clientData = rateLimitCache.get(clientIp)!;
  if (now - clientData.lastReset > RATE_LIMIT.WINDOW_MS) {
    clientData.count = 1;
    clientData.lastReset = now;
    return false;
  }

  return ++clientData.count > RATE_LIMIT.MAX_REQUESTS;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Use the isAdminAuthenticated helper function for authentication
  const isAuthenticated = await isAdminAuthenticated(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (req.method === "POST") {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      
      if (checkRateLimit(clientIp)) {
        res.setHeader('Retry-After', Math.ceil(RATE_LIMIT.WINDOW_MS / 1000));
        return res.status(429).json({ 
          error: `Too many requests. Please try again in ${Math.ceil(RATE_LIMIT.WINDOW_MS / 1000)} seconds.`
        });
      }

      const { price, isConversion = false } = req.body;
      if (typeof price !== "number" || typeof isConversion !== "boolean") {
        return res.status(400).json({ error: "Invalid input" });
      }

      let stats: PriceStats = {};
      try {
        const blob = await head(BLOB_KEY, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        if (blob) {
          const response = await fetch(blob.url);
          stats = await response.json();
        }
      } catch {
        console.log("Initializing new stats file");
      }

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

// Cleanup interval remains the same
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitCache.entries()) {
    if (now - data.lastReset > RATE_LIMIT.WINDOW_MS * 2) {
      rateLimitCache.delete(ip);
    }
  }
}, RATE_LIMIT.WINDOW_MS * 2);