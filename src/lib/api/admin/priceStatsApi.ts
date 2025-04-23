// lib/api/admin/priceStatsApi.ts
import { useAdminApi } from './adminApi';

/**
 * Price stats data structure
 */
export interface PriceStatData {
  price: number;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  last_updated: string;
}

/**
 * Download URL response
 */
export interface DownloadUrlResponse {
  url: string;
  downloadUrl: string;
  filename: string;
}

/**
 * Hook to get Price Stats API functions
 */
export function usePriceStatsApi() {
  const adminApi = useAdminApi();
  
  /**
   * Fetch price tracking stats
   */
  const getStats = async (): Promise<PriceStatData[]> => {
    try {
      return await adminApi.get<PriceStatData[]>('price-A-B/track-price');
    } catch (error) {
      console.error('Failed to fetch price stats:', error);
      throw error;
    }
  };
  
  /**
   * Get download URL for stats file
   */
  const getDownloadUrl = async (): Promise<DownloadUrlResponse> => {
    try {
      return await adminApi.get<DownloadUrlResponse>('price-A-B/get-download-url');
    } catch (error) {
      console.error('Failed to get download URL:', error);
      throw error;
    }
  };
  
  /**
   * Reset all stats
   */
  const resetStats = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      return await adminApi.post<{}, { success: boolean; message: string }>('price-A-B/reset-stats', {});
    } catch (error) {
      console.error('Failed to reset stats:', error);
      throw error;
    }
  };
  
  return {
    getStats,
    getDownloadUrl,
    resetStats
  };
}