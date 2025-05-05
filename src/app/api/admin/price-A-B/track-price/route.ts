// src/app/api/admin/price-A-B/track-price/route.ts
import { put, head } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET() {
  console.log(`[GET /api/admin/price-A-B/track-price] Request received`);
  
  try {
    const rawStats = await getStatsFromBlob();
    const formattedStats = transformStatsForFrontend(rawStats);
    
    // Sort by price
    formattedStats.sort((a, b) => a.price - b.price);
    
    console.log(`[GET /api/admin/price-A-B/track-price] Stats retrieved successfully`);
    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error(`[GET /api/admin/price-A-B/track-price] Error fetching stats:`, error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log(`[POST /api/admin/price-A-B/track-price] Request received`);
  
  try {
    const body = await request.json();
    const { price, isConversion = false } = body;
    
    if (typeof price !== "number") {
      console.error(`[POST /api/admin/price-A-B/track-price] Invalid input: price must be a number`);
      return NextResponse.json(
        { error: "Invalid input: price must be a number" }, 
        { status: 400 }
      );
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

    console.log(`[POST /api/admin/price-A-B/track-price] Stats updated successfully`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[POST /api/admin/price-A-B/track-price] Error updating stats:`, error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}