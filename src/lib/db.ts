// src/lib/db.ts
import { put, head, del } from '@vercel/blob';

const BLOB_KEY_PREFIX = 'price-tracking';
const STATS_BLOB_KEY = `${BLOB_KEY_PREFIX}/stats`;

// Type definition for our price tracking stats
interface PriceStats {
  prices: {
    [price: string]: {
      clicks: number;
      conversions: number;
      lastUpdated: string;
    };
  };
}

// Initialize or get the price tracking stats
export async function getOrInitPriceStats(): Promise<PriceStats> {
  try {
    // Check if blob exists first
    const blob = await head(STATS_BLOB_KEY).catch(() => null);
    
    if (blob) {
      const response = await fetch(blob.url);
      return await response.json() as PriceStats;
    }
  } catch (error: unknown) {
    console.log('No existing stats found, creating new ones:', error);
  }
  
  // Return default empty stats
  return { prices: {} };
}

// Save the stats back to blob storage
async function saveStats(stats: PriceStats): Promise<void> {
  try {
    const jsonString = JSON.stringify(stats);
    await put(STATS_BLOB_KEY, jsonString, {
      contentType: 'application/json',
      access: 'public',
    });
  } catch (error) {
    console.error('Error saving stats:', error);
    throw error; // Re-throw so calling functions know it failed
  }
}

// Track a click for a specific price
export async function trackPriceClick(price: number): Promise<boolean> {
  try {
    const stats = await getOrInitPriceStats();
    const priceKey = price.toFixed(2);
    
    if (!stats.prices[priceKey]) {
      stats.prices[priceKey] = {
        clicks: 0,
        conversions: 0,
        lastUpdated: new Date().toISOString()
      };
    }
    
    stats.prices[priceKey].clicks += 1;
    stats.prices[priceKey].lastUpdated = new Date().toISOString();
    
    await saveStats(stats);
    return true;
  } catch (error) {
    console.error('Error tracking price click:', error);
    return false;
  }
}

// Track a conversion for a specific price
export async function trackPriceConversion(price: number): Promise<boolean> {
  try {
    const stats = await getOrInitPriceStats();
    const priceKey = price.toFixed(2);
    
    if (!stats.prices[priceKey]) {
      stats.prices[priceKey] = {
        clicks: 0,
        conversions: 0,
        lastUpdated: new Date().toISOString()
      };
    }
    
    stats.prices[priceKey].conversions += 1;
    stats.prices[priceKey].lastUpdated = new Date().toISOString();
    
    await saveStats(stats);
    return true;
  } catch (error) {
    console.error('Error tracking price conversion:', error);
    return false;
  }
}

// Get formatted price performance stats
export async function getPriceStats() {
  try {
    const stats = await getOrInitPriceStats();
    
    // Convert to array format for easier rendering
    return Object.entries(stats.prices).map(([price, data]) => {
      const conversionRate = data.clicks > 0 
        ? Number(((data.conversions / data.clicks) * 100).toFixed(2))
        : 0;
        
      return {
        price: Number(price),
        clicks: data.clicks,
        conversions: data.conversions,
        conversion_rate: conversionRate,
        last_updated: data.lastUpdated
      };
    }).sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error getting price stats:', error);
    return [];
  }
}

// Export a utility function to reset stats (useful for development)
export async function resetStats(): Promise<boolean> {
  try {
    await del(STATS_BLOB_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting stats:', error);
    return false;
  }
}