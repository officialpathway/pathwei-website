// src/pages/admin/price-stats.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAdminAuthGuard } from '@/hooks/api/useAdminAuthGuard';
import './layout';
import '@/pages/globals.css';
import AdminLayout from './layout';
import { usePriceStatsApi, PriceStatData } from '@/lib/api/admin/priceStatsApi';

export default function StatsPage() {
  const [stats, setStats] = useState<PriceStatData[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const { isAuthorized } = useAdminAuthGuard();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  // Get the price stats API client
  const priceStatsApi = usePriceStatsApi();

  async function fetchStats() {
    try {
      setDataLoading(true);
      setError(null);
      
      console.log('Fetching price stats...');
      const data = await priceStatsApi.getStats();
      console.log('Successfully fetched price stats:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setDataLoading(false);
    }
  }

  // Fetch stats when authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchStats();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized]);

  async function handleResetStats() {
    try {
      setResetLoading(true);
      console.log("Resetting stats...");
      
      await priceStatsApi.resetStats();
      console.log("Reset successful, fetching updated stats");
      
      await fetchStats();
      console.log("Stats refreshed successfully");
      setShowResetModal(false);
    } catch (error) {
      console.error("Error resetting stats:", error);
      setError(error instanceof Error ? error.message : 'Failed to reset stats');
    } finally {
      setResetLoading(false);
    }
  }

  async function handleDownloadStats() {
    try {
      setDownloadLoading(true);
      console.log("Getting download URL...");
      
      const data = await priceStatsApi.getDownloadUrl();
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
      setError(error instanceof Error ? error.message : 'Failed to download stats');
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Reset Stats Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reset Statistics</h3>
              <p className="text-gray-600 mb-6">
                This will delete all tracking data and reset to initial values. 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowResetModal(false)}
                  disabled={resetLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={handleResetStats}
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Resetting...' : 'Confirm Reset'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Price Performance Dashboard</h1>
              <p className="text-gray-600 mt-2">Analyze conversion rates across different price points</p>
            </div>
            {/* No need for manual sign out - handled by auth system */}
          </div>

          {!isAuthorized ? (
            /* Loading or unauthorized message */
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h2 className="mt-2 text-xl font-semibold text-gray-900">Access Restricted</h2>
                <p className="mt-2 text-gray-600">Please login to access this dashboard.</p>
              </div>
            </div>
          ) : (
            /* Dashboard Content */
            <div className="space-y-6">
              {/* Stats Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.reduce((sum, stat) => sum + stat.clicks, 0).toLocaleString()}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Conversions</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stats.reduce((sum, stat) => sum + stat.conversions, 0).toLocaleString()}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Avg. Conversion Rate</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {(stats.reduce((sum, stat) => sum + stat.conversion_rate, 0) / stats.length || 0).toFixed(2)}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Price Performance Metrics</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed statistics for each price point</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type='button'
                      onClick={fetchStats}
                      disabled={dataLoading}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                    
                    {/* Download Button */}
                    <button
                      type='button'
                      onClick={handleDownloadStats}
                      disabled={downloadLoading}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {downloadLoading ? 'Downloading...' : 'Download'}
                    </button>
                    
                    {process.env.NODE_ENV === 'development' && (
                      <button
                        onClick={() => setShowResetModal(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Reset Data
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.map((stat) => (
                        <tr key={stat.price} className={bestPrice && stat.price === bestPrice.price ? "bg-blue-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                ${stat.price.toFixed(2)}
                              </div>
                              {bestPrice && stat.price === bestPrice.price && (
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Best Performer
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{stat.clicks.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{stat.conversions.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-20 mr-3">
                                <div className="relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                      <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${stat.conversion_rate >= (bestPrice?.conversion_rate || 0) * 0.8 ? 'text-blue-600 bg-blue-200' : 'text-gray-600 bg-gray-200'}`}>
                                        {stat.conversion_rate.toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                    <div 
                                      style={{ width: `${Math.min(100, stat.conversion_rate * 2)}%` }} 
                                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${stat.conversion_rate >= (bestPrice?.conversion_rate || 0) * 0.8 ? 'bg-blue-500' : 'bg-gray-500'}`}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(stat.last_updated)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Best Performer Section */}
              {bestPrice && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Best Performing Price</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">${bestPrice.price.toFixed(2)}</h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {bestPrice.conversion_rate.toFixed(2)}% conversion rate
                            </p>
                          </div>
                          <div className="mt-3 sm:mt-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <svg className="-ml-1 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx={4} cy={4} r={3} />
                              </svg>
                              Highest conversion rate
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="px-4 py-2 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Clicks</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{bestPrice.clicks.toLocaleString()}</p>
                          </div>
                          <div className="px-4 py-2 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Conversions</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{bestPrice.conversions.toLocaleString()}</p>
                          </div>
                          <div className="px-4 py-2 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{bestPrice.conversion_rate.toFixed(2)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}