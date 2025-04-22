// src/app/admin/analytics
"use client";

import AdminLayout from './layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useAdminAuthGuard } from '@/hooks/useAdminAuthGuard';

export default function AnalyticsDashboard() {
  useAdminAuthGuard();

  // Date range state
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });

  // Chart data state
  const [chartData, setChartData] = useState({
    visitors: {
      labels: Array.from({ length: 30 }, (_, i) => 
        new Date(new Date().setDate(new Date().getDate() - 30 + i + 1))
          .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Visitors',
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000)),
          backgroundColor: 'hsl(221.2 83.2% 53.3%)',
        },
      ],
    },
    sources: {
      labels: ['Direct', 'Organic Search', 'Social', 'Referral', 'Email'],
      datasets: [
        {
          data: [15, 45, 20, 10, 10],
          backgroundColor: [
            'hsl(221.2 83.2% 53.3%)',
            'hsl(142.1 76.2% 36.3%)',
            'hsl(346.8 77.2% 49.8%)',
            'hsl(262.1 83.3% 57.8%)',
            'hsl(47.9 95.8% 53.1%)',
          ],
        },
      ],
    },
    pages: {
      labels: ['Home', 'Pricing', 'Features', 'Blog', 'Contact'],
      datasets: [
        {
          label: 'Page Views',
          data: [1200, 800, 600, 400, 200],
          backgroundColor: 'hsl(221.2 83.2% 53.3%)',
        },
      ],
    },
  });

  // Metrics data
  const [metrics] = useState({
    totalVisitors: 12453,
    bounceRate: 42.3,
    avgSession: '2m 45s',
    conversionRate: 3.2,
  });

  // Refresh data
  const refreshData = () => {
    // Simulate data refresh
    setChartData({
      ...chartData,
      visitors: {
        ...chartData.visitors,
        datasets: [
          {
            ...chartData.visitors.datasets[0],
            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000)),
          },
        ],
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex gap-2">
              <DatePicker
                selected={dateRange.start}
                onSelect={(date: Date | null) => setDateRange({ ...dateRange, start: date || new Date() })}
                customInput={
                  <Button variant="outline" className="pl-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRange.start.toLocaleDateString()}
                  </Button>
                }
              />
              <span className="flex items-center px-2">to</span>
              <DatePicker
                selected={dateRange.end}
                onSelect={(date: Date | null) => setDateRange({ ...dateRange, end: date || new Date() })}
                customInput={
                  <Button variant="outline" className="pl-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRange.end.toLocaleDateString()}
                  </Button>
                }
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Traffic</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Badge variant="outline" className="text-green-600">
                +12.5%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                vs {Math.floor(metrics.totalVisitors * 0.875).toLocaleString()} previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <Badge variant="outline" className="text-red-600">
                +2.1%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.bounceRate}%</div>
              <p className="text-xs text-muted-foreground">
                vs {Math.floor(metrics.bounceRate * 0.979)}% previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Badge variant="outline" className="text-green-600">
                +0.5%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgSession}</div>
              <p className="text-xs text-muted-foreground">
                vs 2m 43s previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Badge variant="outline" className="text-green-600">
                +0.8%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                vs {Math.floor(metrics.conversionRate * 0.992)}% previous period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="visitors" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="visitors">Visitors</TabsTrigger>
              <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
              <TabsTrigger value="pages">Top Pages</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <TabsContent value="visitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visitors Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <LineChart
                  type="line"
                  data={chartData.visitors}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => Number(value).toLocaleString(),
                        },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <BarChart
                    type="bar"
                    data={chartData.sources}
                    options={{ maintainAspectRatio: false }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Source Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <PieChart
                    type="pie"
                    data={chartData.sources}
                    options={{ maintainAspectRatio: false }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BarChart
                  type="bar"
                  data={chartData.pages}
                  options={{
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}