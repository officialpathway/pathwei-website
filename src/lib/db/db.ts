// src/lib/db.ts
import { put, head, del } from '@vercel/blob';
import { cache } from 'react';

const BLOB_KEY_PREFIX = 'price-tracking';
const STATS_BLOB_KEY = `${BLOB_KEY_PREFIX}/stats`;


// Add these constants at the top
const SEO_BLOB_KEY = 'seo/settings';
const SITEMAP_METADATA_KEY = 'seo/sitemap-metadata';

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

// Type definitions
export interface SEOSettings {
  // Core SEO fields
  title: string;
  description: string;
  keywords: string;
  allowIndexing: boolean;
  
  // OpenGraph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogLocale: string;
  ogSiteName: string;
  
  // Twitter
  twitterCard: string;
  twitterImage: string;
  twitterHandle: string;
  twitterSite: string;
  twitterCreator: string;
  
  // Facebook
  fbAppId: string;
  
  // Sitemap settings
  sitemapLastGenerated: string;
  sitemapStatus: string;
  sitemapFrequency: string;
  sitemapPriority: string;
  
  // Advanced settings
  robotsTxt: string;
  jsonLd: string;
  canonicalUrl: string;
  metaRobots: string;
  
  // Appearance
  favicon: string;
  themeColor: string;
  
  // Multilingual
  alternateLanguages: Record<string, string>;
}

export interface SitemapMetadata {
  lastGenerated: string;
  status: 'active' | 'inactive' | 'error';
}

export interface SitemapOptions {
  frequency: string;
  priority: string;
}

// Helper to handle blob operations
async function getBlobJSON<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const blob = await head(key).catch(() => null);
    if (!blob) return defaultValue;
    
    const response = await fetch(blob.url);
    return await response.json() as T;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return defaultValue;
  }
}

// Sitemap Metadata Operations
export async function getSitemapMetadata(): Promise<SitemapMetadata> {
  return getBlobJSON(SITEMAP_METADATA_KEY, {
    lastGenerated: new Date(0).toISOString(),
    status: 'inactive'
  });
}

export async function updateSitemapMetadata(metadata: Partial<SitemapMetadata>): Promise<boolean> {
  try {
    const current = await getSitemapMetadata();
    await put(SITEMAP_METADATA_KEY, JSON.stringify({ ...current, ...metadata }), {
      contentType: 'application/json',
      access: 'public',
    });
    return true;
  } catch (error) {
    console.error('Error updating sitemap metadata:', error);
    return false;
  }
}

// SEO Settings Operations with React cache for server components
export const getSEOSettings = cache(async (): Promise<SEOSettings> => {
  const defaults: SEOSettings = {
    // Core SEO fields
    title: "AI Haven Labs | AI-Powered Productivity Suite",
    description: "Building AI tools to enhance human potential through technology. Explore our suite of productivity applications.",
    keywords: "AI, productivity, tools, technology",
    allowIndexing: true,
    
    // OpenGraph
    ogTitle: "AI Haven Labs",
    ogDescription: "Next-generation AI tools for personal and professional growth",
    ogImage: "/og-default.jpg",
    ogType: "website",
    ogLocale: "en_US",
    ogSiteName: "AI Haven Labs",
    
    // Twitter
    twitterCard: "summary_large_image",
    twitterImage: "/twitter-default.jpg",
    twitterHandle: "@aihavenlabs",
    twitterSite: "@aihavenlabs",
    twitterCreator: "@aihavenlabs",
    
    // Facebook
    fbAppId: "",
    
    // Sitemap settings
    sitemapLastGenerated: "",
    sitemapStatus: "inactive",
    sitemapFrequency: "weekly",
    sitemapPriority: "0.8",
    
    // Advanced settings
    robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://aihavenlabs.com/sitemap.xml",
    jsonLd: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "AI Haven Labs",\n  "url": "https://aihavenlabs.com"\n}',
    canonicalUrl: "https://aihavenlabs.com",
    metaRobots: "index, follow",
    
    // Appearance
    favicon: "/icons/pathway/favicon.ico",
    themeColor: "#ffffff",
    
    // Multilingual
    alternateLanguages: {}
  };
  
  return getBlobJSON(SEO_BLOB_KEY, defaults);
});

export async function saveSEOSettings(settings: SEOSettings): Promise<boolean> {
  try {
    await put(SEO_BLOB_KEY, JSON.stringify(settings), {
      contentType: 'application/json',
      access: 'public',
      allowOverwrite: true,
    });
    return true;
  } catch (error) {
    console.error('Error saving SEO settings:', error);
    return false;
  }
}

export async function generateSitemap(): Promise<boolean> {
  try {
    // This is a placeholder for the actual sitemap generation logic
    // In a real implementation, you would:
    // 1. Fetch all public URLs from your database
    // 2. Create XML sitemap with the provided frequency and priority
    // 3. Save the sitemap to a public location
    
    // For this example, we'll just update the metadata
    await updateSitemapMetadata({
      lastGenerated: new Date().toISOString(),
      status: 'active'
    });
    
    return true;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Update metadata to show error
    await updateSitemapMetadata({
      status: 'error'
    });
    
    return false;
  }
}

/**
 * Updates SEO settings and returns the updated settings
 */
export async function updateSEOSettings(
  updates: Partial<SEOSettings>
): Promise<SEOSettings> {
  const currentSettings = await getSEOSettings();
  const updatedSettings = { ...currentSettings, ...updates };
  
  await saveSEOSettings(updatedSettings);
  return updatedSettings;
}

/**
 * Validates robots.txt content
 */
export function validateRobotsTxt(content: string): boolean {
  // Basic validation - ensure it has at least one user-agent directive
  return /user-agent:/i.test(content);
}

/**
 * Validates JSON-LD structured data
 */
export function validateJsonLd(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets default robots.txt content
 */
export function getDefaultRobotsTxt(siteUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml`;
}

/**
 * Gets default JSON-LD for organization
 */
export function getDefaultJsonLd(
  name: string = "AI Haven Labs",
  url: string = "https://aihavenlabs.com"
): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": `${url}/logo.png`
  };
  
  return JSON.stringify(data, null, 2);
}