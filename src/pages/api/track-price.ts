// src/pages/api/track-price.ts
import { put, head } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

const BLOB_KEY = "price-tracking/stats.json";

interface PriceStat {
  clicks: number;
  conversions: number;
  lastUpdated: string;
}

interface PriceStats {
  [price: string]: PriceStat;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Handle tracking requests
    try {
      const { price, isConversion = false } = req.body;

      // Validate price
      if (typeof price !== "number" || isNaN(price)) {
        return res.status(400).json({ error: "Invalid price value" });
      }

      // Get or initialize stats
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

      // Update stats
      const priceKey = price.toFixed(2);
      if (!stats[priceKey]) {
        stats[priceKey] = {
          clicks: 0,
          conversions: 0,
          lastUpdated: new Date().toISOString(),
        };
      }

      if (isConversion) {
        stats[priceKey].conversions += 1;
      } else {
        stats[priceKey].clicks += 1;
      }
      stats[priceKey].lastUpdated = new Date().toISOString();

      // Save updated stats
      await put(BLOB_KEY, JSON.stringify(stats), {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: "application/json",
        addRandomSuffix: false,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error tracking price:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    // Handle stats retrieval with basic auth
    try {
      // Basic auth check
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Basic ")) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Price Testing Stats"');
        return res.status(401).json({ error: "Unauthorized" });
      }

      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
      const [username, password] = credentials.split(":");

      // Validate credentials
      const validUsername = process.env.STATS_USERNAME || "admin";
      const validPassword = process.env.STATS_PASSWORD || "password";

      if (username !== validUsername || password !== validPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Get stats
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
        console.log("No stats file found, returning empty");
      }

      // Format response
      const formattedStats = Object.entries(stats).map(([price, data]) => ({
        price: Number(price),
        clicks: data.clicks,
        conversions: data.conversions,
        conversion_rate: data.clicks > 0 
          ? Number(((data.conversions / data.clicks) * 100).toFixed(2))
          : 0,
        last_updated: data.lastUpdated,
      }));

      return res.status(200).json(formattedStats);
    } catch (error) {
      console.error("Error retrieving stats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}