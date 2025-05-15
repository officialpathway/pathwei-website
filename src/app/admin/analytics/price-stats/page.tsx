'use client';

import { useState, useEffect } from 'react';
import {
  WidgetGrid,
  StatsWidget,
  TableWidget,
  BestPriceWidget,
  PriceDistributionChartWidget
} from '@/components/widgets/index';
import {
  BarChart,
  TrendingUp,
  Eye,
  CheckCircle,
  RefreshCw,
  Download,
  AlertTriangle,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/client/admin/sidebar';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { signOut } from '@/lib/auth/auth';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

// Define the PriceStatData type to match what's returned from the API
interface PriceStatData {
  price: number;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  last_updated: string;
}

export default function PriceStats() {
  const { adminData, loading, error } = useAdminAuth();
  const router = useRouter();
  const [stats, setStats] = useState<PriceStatData[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push('/admin/login');
  }

  // Helper function to get the correct API path
  function getApiPath(endpoint: string): string {
    // If we're in development, we need to handle the locale differently
    if (process.env.NODE_ENV === 'development') {
      // Remove the locale from the pathname if it exists
      // Get the current pathname from window.location
      const currentPath = window.location.pathname;
      // Check if the path starts with a locale (e.g., /es/, /en/)
      const localeMatch = currentPath.match(/^\/([a-z]{2})\//);
      
      if (localeMatch) {
        // If there's a locale prefix, we need to ensure it's excluded from API calls
        return endpoint; // The rewrite rule should handle this
      }
    }
    
    // Default case - just use the endpoint directly
    return endpoint;
  }

  async function fetchStats() {
    try {
      setDataLoading(true);
      setStatsError(null);
      
      console.log('Fetching price stats...');
      const apiPath = getApiPath('/api/admin/price-A-B/track-price');
      console.log('Using API path:', apiPath);
      
      const response = await fetch(apiPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching stats: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched price stats:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStatsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setDataLoading(false);
    }
  }

  // Fetch stats when authorized
  useEffect(() => {
    if (adminData) {
      fetchStats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminData]);

  async function handleResetStats() {
    try {
      setResetLoading(true);
      console.log("Resetting stats...");
      
      const apiPath = getApiPath('/api/admin/price-A-B/reset-stats');
      console.log('Using API path:', apiPath);
      
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error resetting stats: ${response.status} ${response.statusText}`);
      }
      
      console.log("Reset successful, fetching updated stats");
      
      await fetchStats();
      console.log("Stats refreshed successfully");
      setShowResetModal(false);
    } catch (error) {
      console.error("Error resetting stats:", error);
      setStatsError(error instanceof Error ? error.message : 'Failed to reset stats');
    } finally {
      setResetLoading(false);
    }
  }

  async function handleDownloadStats() {
    try {
      setDownloadLoading(true);
      console.log("Getting download URL...");
      
      const apiPath = getApiPath('/api/admin/price-A-B/get-download-url');
      console.log('Using API path:', apiPath);
      
      const response = await fetch(apiPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error getting download URL: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Got download URL:", data);
      
      // Create a temporary link element and click it to trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename || 'stats.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading stats:', error);
      setStatsError(error instanceof Error ? error.message : 'Failed to download stats');
    } finally {
      setDownloadLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  const bestPrice = stats.length > 0 
    ? stats.reduce((best, current) => 
        current.conversion_rate > best.conversion_rate ? current : best, stats[0])
    : null;
    
  const totalClicks = stats.reduce((sum, stat) => sum + stat.clicks, 0);
  const totalConversions = stats.reduce((sum, stat) => sum + stat.conversions, 0);
  const avgConversionRate = (stats.reduce((sum, stat) => sum + stat.conversion_rate, 0) / stats.length) || 0;

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={handleSignOut} 
          className="mt-4"
        >
          Sign Out
        </Button>
      </div>
    );
  }
  
  // Handle no admin data (shouldn't happen if useAdminAuth is working correctly)
  if (!adminData) {
    return (
      <div className="p-8 bg-gray-950 text-gray-200">
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have admin privileges.</AlertDescription>
        </Alert>
        <Button 
          onClick={handleSignOut} 
          className="mt-4"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  // Table columns for the price stats
  const priceColumns = [
    {
      key: 'price',
      title: 'Price',
      render: (value: number, item: { price: number; conversion_rate: number }) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-200">
            ${value.toFixed(2)}
          </div>
          {bestPrice && item.price === bestPrice.price && (
            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-300">
              Best Performer
            </span>
          )}
        </div>
      )
    },
    {
      key: 'clicks',
      title: 'Clicks',
      render: (value: number) => (
        <div className="text-gray-200">{value.toLocaleString()}</div>
      )
    },
    {
      key: 'conversions',
      title: 'Conversions',
      render: (value: number) => (
        <div className="text-gray-200">{value.toLocaleString()}</div>
      )
    },
    {
      key: 'conversion_rate',
      title: 'Conversion Rate',
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-20 mr-3">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full 
                    ${value >= (bestPrice?.conversion_rate || 0) * 0.8 ? 'text-blue-200 bg-blue-900/50' : 'text-gray-300 bg-gray-800'}`}>
                    {value.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                <div 
                  style={{ width: `${Math.min(100, value * 2)}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center 
                    ${value >= (bestPrice?.conversion_rate || 0) * 0.8 ? 'bg-blue-500' : 'bg-gray-500'}`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'last_updated',
      title: 'Last Updated',
      render: (value: string) => (
        <div className="text-sm text-gray-400">{formatDate(value)}</div>
      )
    }
  ];

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Include Sidebar with adminData */}
      <Sidebar user={{ ...adminData, avatarUrl: adminData.avatarUrl ?? undefined }} />

      {/* Reset Stats Modal */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-white">Reset Statistics</DialogTitle>
            <DialogDescription className="text-gray-400">
              This will delete all tracking data and reset to initial values. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetModal(false)}
              disabled={resetLoading}
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetStats}
              disabled={resetLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {resetLoading ? 'Resetting...' : 'Confirm Reset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Price Performance Dashboard</h1>
            <p className="text-gray-400">Analyze conversion rates across different price points</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button
              onClick={fetchStats}
              disabled={dataLoading}
              variant="outline" 
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {dataLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            <Button
              onClick={handleDownloadStats}
              disabled={downloadLoading}
              variant="outline" 
              className="border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadLoading ? 'Downloading...' : 'Download'}
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Button
                onClick={() => setShowResetModal(true)}
                className="bg-red-700/20 text-red-400 hover:bg-red-700/30"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reset Data
              </Button>
            )}
          </div>
        </div>
        
        {statsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{statsError}</AlertDescription>
          </Alert>
        )}
        
        <WidgetGrid>
          {/* Stats Summary Cards */}
          <StatsWidget 
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            icon={Eye}
            iconClassName="bg-blue-500/20"
            size="1x1"
          />
          
          <StatsWidget 
            title="Total Conversions"
            value={totalConversions.toLocaleString()}
            icon={CheckCircle}
            iconClassName="bg-green-500/20"
            size="1x1"
          />
          
          <StatsWidget 
            title="Avg. Conversion Rate"
            value={`${avgConversionRate.toFixed(2)}%`}
            icon={TrendingUp}
            iconClassName="bg-purple-500/20"
            size="1x1"
          />

          {/* Best Price Card */}
          <BestPriceWidget
            bestPrice={bestPrice}
            title="Best Performing Price"
            description="Price point with highest conversion rate"
            size="1x2"
            icon={Award}
            iconClassName="bg-amber-500/20"
          />
          
          {/* Price Performance Table */}
          <TableWidget
            columns={priceColumns}
            data={stats}
            title="Price Performance Metrics"
            description="Detailed statistics for each price point"
            size="3x2"
            icon={BarChart}
            iconClassName="bg-indigo-500/20"
            emptyMessage="No price statistics available"
          />
          
          {/* Price Distribution Chart */}
          <PriceDistributionChartWidget
            data={stats}
            bestPrice={bestPrice}
            title="Conversion Rate by Price"
            description="Visual comparison of all price points"
            size="4x1"
            icon={BarChart}
            iconClassName="bg-green-500/20"
          />
        </WidgetGrid>
      </main>
    </div>
  );
}