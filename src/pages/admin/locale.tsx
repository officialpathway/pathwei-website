"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, PieChart } from '@/components/ui/charts';
import { Globe, Users, Clock, Download, LogOut } from 'lucide-react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import AdminLayout from './layout';

export default function LocaleStatsPage() {
  const router = useRouter();
  interface Stats {
    total?: number;
    byLocale?: Record<string, number>;
    recent?: { uploadedAt: string; url: string; downloadUrl: string }[];
  }

  const [stats, setStats] = useState<Stats | null>(null);
  const [, setError] = useState<string | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/public/locale-stats');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin');
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    deleteCookie('adminAuth');
    router.push('/admin');
  }

  function formatLocaleData() {
    if (!stats?.byLocale) return {
      labels: [],
      datasets: [{
        label: 'Visits',
        data: [],
        backgroundColor: []
      }]
    };

    const locales = Object.entries(stats.byLocale);
    const colors = [
      'hsl(221.2 83.2% 53.3%)',
      'hsl(142.1 76.2% 36.3%)',
      'hsl(346.8 77.2% 49.8%)',
      'hsl(262.1 83.3% 57.8%)',
      'hsl(47.9 95.8% 53.1%)'
    ];

    return {
      labels: locales.map(([locale]) => locale.toUpperCase()),
      datasets: [{
        label: 'Visits',
        data: locales.map(([, count]) => count),
        backgroundColor: locales.map((_, i) => colors[i % colors.length])
      }]
    };
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Locale Statistics</h1>
              <p className="text-gray-600 mt-2">Track language preferences across your users</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Globe className="h-6 w-6 text-blue-500 mr-2" />
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total?.toLocaleString() || '0'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-6 w-6 text-green-500 mr-2" />
                <CardTitle className="text-sm font-medium">Locales Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.byLocale ? Object.keys(stats.byLocale).length : '0'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Clock className="h-6 w-6 text-purple-500 mr-2" />
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.recent?.[0] ? formatDate(stats.recent[0].uploadedAt) : 'Never'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Locale Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart
                  type="bar"
                  data={formatLocaleData()}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.parsed.y} hits`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => Number(value).toLocaleString()
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Locale Percentage</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart
                  type="pie"
                  data={formatLocaleData()}
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.parsed / total) * 100);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locale</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats?.recent?.map((activity, index) => {
                      const locale = activity.url.split('/')[4] || 'unknown';
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              locale === 'en' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {locale.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(activity.uploadedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="link" className="h-auto p-0" asChild>
                              <a href={activity.downloadUrl} download>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}