// src/app/admin/analytics/page.tsx
"use client";

import { useState, useEffect } from 'react';
import AdminLayout from './layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Download, RefreshCw, AlertCircle, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Type definitions
type DateRange = {
  start: Date;
  end: Date;
};

type MetricsData = {
  totalVisitors: number;
  bounceRate: number;
  avgSession: string;
  conversionRate: number;
  activeUsers: number;
};

type ChartDataset = {
  label?: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

type AllChartData = {
  visitors: ChartData;
  realtime: ChartData;
  sources: ChartData;
  pages: ChartData;
  devices: ChartData;
  conversion: ChartData;
};

type FilterOption = 'all' | 'organic' | 'direct' | 'social' | 'email' | 'referral';

// Utility functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const generateRandomData = (length: number, min: number, max: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

const calculateChange = (current: number, previous: number): number => {
  return ((current - previous) / previous) * 100;
};

export default function AnalyticsDashboard() {
  // State hooks
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('visitors');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // Initialize chart data
  const [chartData, setChartData] = useState<AllChartData>({
    visitors: {
      labels: Array.from({ length: 30 }, (_, i) => 
        formatDate(new Date(new Date().setDate(new Date().getDate() - 30 + i + 1)))),
      datasets: [
        {
          label: 'Visitors',
          data: generateRandomData(30, 500, 1500),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    realtime: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Active Users',
          data: generateRandomData(24, 10, 100),
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
        },
      ],
    },
    sources: {
      labels: ['Direct', 'Organic Search', 'Social', 'Referral', 'Email'],
      datasets: [
        {
          data: [25, 40, 15, 12, 8],
          backgroundColor: [
            'rgb(59, 130, 246)',  // blue
            'rgb(16, 185, 129)',  // green
            'rgb(239, 68, 68)',   // red
            'rgb(139, 92, 246)',  // purple
            'rgb(245, 158, 11)',  // amber
          ],
        },
      ],
    },
    pages: {
      labels: ['Home', 'Pricing', 'Features', 'Blog', 'Contact', 'Documentation', 'About'],
      datasets: [
        {
          label: 'Page Views',
          data: [1450, 950, 750, 620, 380, 520, 290],
          backgroundColor: 'rgb(59, 130, 246)',
        },
      ],
    },
    devices: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [
        {
          data: [58, 35, 7],
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
          ],
        },
      ],
    },
    conversion: {
      labels: Array.from({ length: 30 }, (_, i) => 
        formatDate(new Date(new Date().setDate(new Date().getDate() - 30 + i + 1)))),
      datasets: [
        {
          label: 'Conversion Rate (%)',
          data: generateRandomData(30, 1, 6).map(val => Number((val + Math.random()).toFixed(1))),
          backgroundColor: 'rgba(139, 92, 246,.5)',
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 2,
        },
      ],
    },
  });

  // Initialize metrics data with previous period data for comparison
  const [metrics, setMetrics] = useState<MetricsData>({
    totalVisitors: 15784,
    bounceRate: 39.7,
    avgSession: '3m 12s',
    conversionRate: 4.2,
    activeUsers: 127,
  });

  const [previousMetrics] = useState<MetricsData>({
    totalVisitors: 13945,
    bounceRate: 41.3,
    avgSession: '2m 58s',
    conversionRate: 3.8,
    activeUsers: 108,
  });

  // Effect to handle filter changes
  useEffect(() => {
    if (filterOption !== 'all') {
      applyFilter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOption]);

  // Function to apply filters
  const applyFilter = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Adjust data based on filter
      const multiplier = filterOption === 'organic' ? 0.8 : 
                         filterOption === 'direct' ? 0.6 :
                         filterOption === 'social' ? 0.4 : 0.3;
      
      setChartData(prevData => ({
        ...prevData,
        visitors: {
          ...prevData.visitors,
          datasets: [{
            ...prevData.visitors.datasets[0],
            data: prevData.visitors.datasets[0].data.map(val => 
              Math.floor(val * (multiplier + Math.random() * 0.4))
            )
          }]
        },
        sources: {
          ...prevData.sources,
          // Adjust source distribution based on filter
          datasets: [{
            ...prevData.sources.datasets[0],
            data: filterOption === 'organic' ? [15, 55, 10, 12, 8] :
                  filterOption === 'direct' ? [45, 25, 10, 12, 8] :
                  filterOption === 'social' ? [15, 25, 40, 12, 8] : [20, 35, 15, 20, 10]
          }]
        }
      }));
      
      // Update metrics based on filter
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        totalVisitors: Math.floor(prevMetrics.totalVisitors * (multiplier + 0.3)),
        bounceRate: Number((prevMetrics.bounceRate * (1 + (Math.random() * 0.2 - 0.1))).toFixed(1)),
        conversionRate: Number((prevMetrics.conversionRate * (1 + (Math.random() * 0.3 - 0.15))).toFixed(1))
      }));
      
      setIsLoading(false);
    }, 800);
  };

  // Refresh data function
  const refreshData = () => {
    setIsLoading(true);
    setShowAlert(false);
    
    // Simulate data refresh with API call
    setTimeout(() => {
      const newVisitorsData = generateRandomData(30, 500, 1500);
      const newConversionData = generateRandomData(30, 1, 6).map(val => Number((val + Math.random()).toFixed(1)));
      
      setChartData(prevData => ({
        ...prevData,
        visitors: {
          ...prevData.visitors,
          datasets: [{
            ...prevData.visitors.datasets[0],
            data: newVisitorsData,
          }]
        },
        realtime: {
          ...prevData.realtime,
          datasets: [{
            ...prevData.realtime.datasets[0],
            data: generateRandomData(24, 10, 100),
          }]
        },
        conversion: {
          ...prevData.conversion,
          datasets: [{
            ...prevData.conversion.datasets[0],
            data: newConversionData,
          }]
        }
      }));
      
      // Update metrics with small random changes
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        totalVisitors: Math.floor(prevMetrics.totalVisitors * (1 + (Math.random() * 0.06 - 0.03))),
        bounceRate: Number((prevMetrics.bounceRate * (1 + (Math.random() * 0.04 - 0.02))).toFixed(1)),
        conversionRate: Number((prevMetrics.conversionRate * (1 + (Math.random() * 0.05 - 0.025))).toFixed(1)),
        activeUsers: Math.floor(Math.random() * 50 + 100),
      }));
      
      setIsLoading(false);
      setShowAlert(true);
      
      // Hide the alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    }, 1000);
  };

  // Export data function
  const exportData = () => {
    // Create data to export based on active tab
    const dataToExport = {
      dateRange,
      filter: filterOption,
      metrics,
      chartData: chartData[activeTab as keyof AllChartData]
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(dataToExport, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${activeTab}-${formatDate(dateRange.start)}-to-${formatDate(dateRange.end)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
    
    setIsLoading(true);
    
    // Simulate API call for new date range
    setTimeout(() => {
      // Calculate number of days in range
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Update chart data with new date range
      setChartData(prevData => ({
        ...prevData,
        visitors: {
          labels: Array.from({ length: diffDays }, (_, i) => 
            formatDate(new Date(start.getTime() + i * 24 * 60 * 60 * 1000))),
          datasets: [{
            ...prevData.visitors.datasets[0],
            data: generateRandomData(diffDays, 500, 1500),
          }]
        },
        conversion: {
          labels: Array.from({ length: diffDays }, (_, i) => 
            formatDate(new Date(start.getTime() + i * 24 * 60 * 60 * 1000))),
          datasets: [{
            ...prevData.conversion.datasets[0],
            data: generateRandomData(diffDays, 1, 6).map(val => Number((val + Math.random()).toFixed(1))),
          }]
        }
      }));
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Monitor your website performance metrics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex gap-2">
              <DatePicker
                selected={dateRange.start}
                onChange={(date: Date | null) => {
                  if (date) {
                    handleDateRangeChange(date, dateRange.end);
                  }
                }}
                selectsStart
                startDate={dateRange.start}
                endDate={dateRange.end}
                maxDate={new Date()}
                customInput={
                  <Button variant="outline" className="pl-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(dateRange.start)}
                  </Button>
                }
              />
              <span className="flex items-center px-2">to</span>
              <DatePicker
                selected={dateRange.end}
                onChange={(date: Date | null) => {
                  if (date) {
                    handleDateRangeChange(dateRange.start, date);
                  }
                }}
                selectsEnd
                startDate={dateRange.start}
                endDate={dateRange.end}
                minDate={dateRange.start}
                maxDate={new Date()}
                customInput={
                  <Button variant="outline" className="pl-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(dateRange.end)}
                  </Button>
                }
              />
            </div>
            
            <Select 
              value={filterOption}
              onValueChange={(value: string) => setFilterOption(value as FilterOption)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Traffic</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {showAlert && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Data refreshed successfully as of {new Date().toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Real-time stats */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-700">Real-time Overview</CardTitle>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-sm text-blue-600">Active Users</span>
                <h3 className="text-2xl font-bold text-blue-700">{metrics.activeUsers}</h3>
              </div>
              <div>
                <span className="text-sm text-blue-600">Page Views (last hour)</span>
                <h3 className="text-2xl font-bold text-blue-700">{Math.floor(metrics.activeUsers * 2.7)}</h3>
              </div>
              <div>
                <span className="text-sm text-blue-600">Avg. Session (today)</span>
                <h3 className="text-2xl font-bold text-blue-700">{metrics.avgSession}</h3>
              </div>
              <div>
                <span className="text-sm text-blue-600">Top Page (current)</span>
                <h3 className="text-lg font-bold text-blue-700">Homepage</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={calculateChange(metrics.totalVisitors, previousMetrics.totalVisitors) > 0 
                        ? "text-green-600" 
                        : "text-red-600"
                      }
                    >
                      {calculateChange(metrics.totalVisitors, previousMetrics.totalVisitors) > 0 ? "+" : ""}
                      {calculateChange(metrics.totalVisitors, previousMetrics.totalVisitors).toFixed(1)}%
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compared to previous period</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                vs {previousMetrics.totalVisitors.toLocaleString()} previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={calculateChange(previousMetrics.bounceRate, metrics.bounceRate) > 0 
                        ? "text-green-600" 
                        : "text-red-600"
                      }
                    >
                      {calculateChange(previousMetrics.bounceRate, metrics.bounceRate) > 0 ? "+" : ""}
                      {calculateChange(previousMetrics.bounceRate, metrics.bounceRate).toFixed(1)}%
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Lower is better</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.bounceRate}%</div>
              <p className="text-xs text-muted-foreground">
                vs {previousMetrics.bounceRate}% previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Badge 
                variant="outline" 
                className="text-green-600"
              >
                +7.4%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgSession}</div>
              <p className="text-xs text-muted-foreground">
                vs {previousMetrics.avgSession} previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={calculateChange(metrics.conversionRate, previousMetrics.conversionRate) > 0 
                        ? "text-green-600" 
                        : "text-red-600"
                      }
                    >
                      {calculateChange(metrics.conversionRate, previousMetrics.conversionRate) > 0 ? "+" : ""}
                      {calculateChange(metrics.conversionRate, previousMetrics.conversionRate).toFixed(1)}%
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of visitors who complete a desired action</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                vs {previousMetrics.conversionRate}% previous period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs 
          defaultValue="visitors" 
          className="space-y-6"
          onValueChange={value => setActiveTab(value)}
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="visitors">Visitors</TabsTrigger>
              <TabsTrigger value="realtime">Real-time</TabsTrigger>
              <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
              <TabsTrigger value="pages">Top Pages</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <TabsContent value="visitors" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Visitors Over Time</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Daily visitor count for the selected period
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <p>This chart shows the total number of visitors to your site each day. 
                         A visitor is counted once per day regardless of how many times they visit.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="h-full">
                    {/* This would be your actual chart component */}
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Line Chart: Visitors over time would render here</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time User Activity (24 Hours)</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <div className="h-full">
                    {/* This would be your actual chart component */}
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Line Chart: Real-time activity would render here</p>
                    </div>
                  </div>
                )}
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
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="h-full">
                      {/* This would be your actual chart component */}
                      <div className="h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Bar Chart: Traffic sources would render here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Source Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="h-full">
                      {/* This would be your actual chart component */}
                      <div className="h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Pie Chart: Source distribution would render here</p>
                      </div>
                    </div>
                  )}
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
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="h-full">
                    {/* This would be your actual chart component */}
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Bar Chart: Top pages would render here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Page Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left">Page</th>
                        <th className="py-3 text-right">Views</th>
                        <th className="py-3 text-right">Unique Views</th>
                        <th className="py-3 text-right">Avg. Time</th>
                        <th className="py-3 text-right">Bounce Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.pages.labels.map((page, index) => (
                        <tr key={page} className="border-b">
                          <td className="py-3">{page}</td>
                          <td className="py-3 text-right">{chartData.pages.datasets[0].data[index]}</td>
                          <td className="py-3 text-right">{Math.floor(chartData.pages.datasets[0].data[index] * 0.8)}</td>
                          <td className="py-3 text-right">{Math.floor(Math.random() * (150 - 30) + 30)}s</td>
                          <td className="py-3 text-right">{(Math.random() * (50 - 25) + 25).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="h-full">
                    {/* This would be your actual chart component */}
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Pie Chart: Device distribution would render here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Desktop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">58%</div>
                  <div className="text-xs text-muted-foreground">
                    Browser Distribution:
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="text-xs">Chrome: 62%</div>
                    <div className="text-xs">Safari: 18%</div>
                    <div className="text-xs">Firefox: 12%</div>
                    <div className="text-xs">Edge: 8%</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Mobile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">35%</div>
                  <div className="text-xs text-muted-foreground">
                    OS Distribution:
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="text-xs">iOS: 56%</div>
                    <div className="text-xs">Android: 44%</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Tablet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7%</div>
                  <div className="text-xs text-muted-foreground">
                    Device Distribution:
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="text-xs">iPad: 72%</div>
                    <div className="text-xs">Android: 28%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <div className="h-full">
                    {/* This would be your actual chart component */}
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Line Chart: Conversion rate would render here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Page Visit</span>
                        <span className="font-medium">15,784</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Product View</span>
                        <span className="font-medium">7,592</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Add to Cart</span>
                        <span className="font-medium">2,428</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '15.4%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Checkout</span>
                        <span className="font-medium">915</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '5.8%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Purchase</span>
                        <span className="font-medium">663</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '4.2%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversion by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 text-left">Source</th>
                          <th className="py-3 text-right">Conv. Rate</th>
                          <th className="py-3 text-right">Transactions</th>
                          <th className="py-3 text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">Direct</td>
                          <td className="py-3 text-right">5.2%</td>
                          <td className="py-3 text-right">236</td>
                          <td className="py-3 text-right">$12,498</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Organic Search</td>
                          <td className="py-3 text-right">4.7%</td>
                          <td className="py-3 text-right">203</td>
                          <td className="py-3 text-right">$9,872</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Social</td>
                          <td className="py-3 text-right">2.3%</td>
                          <td className="py-3 text-right">85</td>
                          <td className="py-3 text-right">$3,125</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Email</td>
                          <td className="py-3 text-right">8.4%</td>
                          <td className="py-3 text-right">96</td>
                          <td className="py-3 text-right">$5,836</td>
                        </tr>
                        <tr>
                          <td className="py-3">Referral</td>
                          <td className="py-3 text-right">3.8%</td>
                          <td className="py-3 text-right">43</td>
                          <td className="py-3 text-right">$2,156</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Age Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>18-24</span>
                      <span>21%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '21%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>25-34</span>
                      <span>38%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '38%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>35-44</span>
                      <span>27%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '27%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>45-54</span>
                      <span>9%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '9%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>55+</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Gender Distribution</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Male</span>
                        <span>48%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Female</span>
                        <span>46%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '46%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Non-binary</span>
                        <span>3%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '3%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Not specified</span>
                        <span>3%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-600 rounded" style={{ width: '3%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Countries</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>United States</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '42%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>United Kingdom</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '15%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Germany</span>
                      <span>8%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '8%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Canada</span>
                      <span>7%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '7%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Australia</span>
                      <span>6%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '6%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Other</span>
                      <span>22%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded">
                      <div className="h-full bg-blue-600 rounded" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Cities</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">City</th>
                          <th className="py-2 text-right">Users</th>
                          <th className="py-2 text-right">% of Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">New York</td>
                          <td className="py-2 text-right">1,432</td>
                          <td className="py-2 text-right">9.1%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">London</td>
                          <td className="py-2 text-right">1,024</td>
                          <td className="py-2 text-right">6.5%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">San Francisco</td>
                          <td className="py-2 text-right">842</td>
                          <td className="py-2 text-right">5.3%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Berlin</td>
                          <td className="py-2 text-right">536</td>
                          <td className="py-2 text-right">3.4%</td>
                        </tr>
                        <tr>
                          <td className="py-2">Sydney</td>
                          <td className="py-2 text-right">498</td>
                          <td className="py-2 text-right">3.2%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}