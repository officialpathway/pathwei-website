// lib/api/admin/adminApiClient.ts
import { useAdminApi } from './adminApi';

/**
 * Type for SEO settings data
 */
export type SEOData = {
  title: string;
  description: string;
  keywords: string;
  allowIndexing: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterImage: string;
  twitterHandle: string;
  sitemapLastGenerated: string;
  sitemapStatus: string;
  sitemapFrequency: string;
  sitemapPriority: string;
  robotsTxt: string;
  jsonLd: string;
  canonicalUrl: string;
};

/**
 * Hook to get SEO API functions
 */
export function useSeoApi() {
  const adminApi = useAdminApi();
  
  /**
   * Fetch SEO settings from server
   */
  const getSeoSettings = async (): Promise<SEOData> => {
    try {
      return await adminApi.get<SEOData>('seo/settings');
    } catch (error) {
      console.error('Failed to fetch SEO settings:', error);
      throw error;
    }
  };
  
  /**
   * Save SEO settings to server
   */
  const saveSeoSettings = async (settings: SEOData): Promise<{ success: boolean }> => {
    try {
      return await adminApi.post<SEOData, { success: boolean }>('seo/settings', settings);
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      throw error;
    }
  };
  
  /**
   * Generate sitemap
   */
  const generateSitemap = async (options?: { frequency?: string; priority?: string }): Promise<{ success: boolean }> => {
    try {
      return await adminApi.post<{ frequency?: string; priority?: string }, { success: boolean }>('seo/sitemap', options || {});
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
      throw error;
    }
  };
  
  return {
    getSeoSettings,
    saveSeoSettings,
    generateSitemap
  };
}