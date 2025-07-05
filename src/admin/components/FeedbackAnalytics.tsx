// src/components/admin/FeedbackAnalytics.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  AdminAPIService,
  FeedbackStats,
  FeedbackTrends,
} from "@/services/AdminAPIService";

interface DateRange {
  startDate: string;
  endDate: string;
  groupBy: "day" | "week" | "month";
}

export default function FeedbackAnalytics() {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [trends, setTrends] = useState<FeedbackTrends[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
    groupBy: "day",
  });

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsData, trendsData] = await Promise.all([
        AdminAPIService.getFeedbackStats(),
        AdminAPIService.getFeedbackTrends(
          dateRange.startDate,
          dateRange.endDate,
          dateRange.groupBy
        ),
      ]);

      setStats(statsData);
      setTrends(trendsData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: keyof DateRange, value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResolutionRate = () => {
    if (!stats) return 0;
    const total = stats.total;
    const resolved = stats.resolved + stats.closed;
    return total > 0 ? Math.round((resolved / total) * 100) : 0;
  };

  const calculateAvgResponseTime = () => {
    // This would ideally come from the backend
    // For now, return a placeholder
    return "2.3 hours";
  };

  const getTypePercentages = () => {
    if (!stats || !stats.byType) return [];
    const total = stats.total;
    return [
      {
        name: "Bug Reports",
        value: stats.byType.bug || 0,
        percentage:
          total > 0 ? Math.round(((stats.byType.bug || 0) / total) * 100) : 0,
        color: "bg-red-500",
      },
      {
        name: "Feature Requests",
        value: stats.byType.feature || 0,
        percentage:
          total > 0
            ? Math.round(((stats.byType.feature || 0) / total) * 100)
            : 0,
        color: "bg-blue-500",
      },
      {
        name: "General",
        value: stats.byType.general || 0,
        percentage:
          total > 0
            ? Math.round(((stats.byType.general || 0) / total) * 100)
            : 0,
        color: "bg-gray-500",
      },
      {
        name: "Complaints",
        value: stats.byType.complaint || 0,
        percentage:
          total > 0
            ? Math.round(((stats.byType.complaint || 0) / total) * 100)
            : 0,
        color: "bg-orange-500",
      },
    ];
  };

  const getPriorityPercentages = () => {
    if (!stats || !stats.byPriority) return [];
    const total = stats.total;
    return [
      {
        name: "Critical",
        value: stats.byPriority.critical || 0,
        percentage:
          total > 0
            ? Math.round(((stats.byPriority.critical || 0) / total) * 100)
            : 0,
        color: "bg-red-600",
      },
      {
        name: "High",
        value: stats.byPriority.high || 0,
        percentage:
          total > 0
            ? Math.round(((stats.byPriority.high || 0) / total) * 100)
            : 0,
        color: "bg-orange-500",
      },
      {
        name: "Medium",
        value: stats.byPriority.medium || 0,
        percentage:
          total > 0
            ? Math.round(((stats.byPriority.medium || 0) / total) * 100)
            : 0,
        color: "bg-yellow-500",
      },
      {
        name: "Low",
        value: stats.byPriority.low || 0,
        percentage:
          total > 0
            ? Math.round(((stats.byPriority.low || 0) / total) * 100)
            : 0,
        color: "bg-green-500",
      },
    ];
  };

  const formatTrendDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (dateRange.groupBy) {
      case "day":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "week":
        return `Week of ${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;
      case "month":
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      default:
        return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          Feedback Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Track feedback trends, resolution rates, and user satisfaction metrics
        </p>
      </div>

      {/* Date Range Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              Date Range:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              title="Select start date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                handleDateRangeChange("startDate", e.target.value)
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              title="Select end date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Group by:</label>
            <select
              title="Group feedback by"
              value={dateRange.groupBy}
              onChange={(e) =>
                handleDateRangeChange(
                  "groupBy",
                  e.target.value as "day" | "week" | "month"
                )
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Feedback
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Resolution Rate
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {calculateResolutionRate()}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Resolved + Closed</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Items
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
                <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {calculateAvgResponseTime()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Time to first response
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Feedback by Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Feedback by Type
          </h3>
          <div className="space-y-4">
            {getTypePercentages().map((type) => (
              <div key={type.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {type.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {type.value} ({type.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${type.color}`}
                    style={{ width: `${type.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback by Priority */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Feedback by Priority
          </h3>
          <div className="space-y-4">
            {getPriorityPercentages().map((priority) => (
              <div key={priority.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {priority.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {priority.value} ({priority.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${priority.color}`}
                    style={{ width: `${priority.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Feedback Trends
        </h3>
        {trends.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Simple bar chart representation */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Resolved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Pending</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trends.slice(-12).map((trend, index) => {
                    const maxValue = Math.max(...trends.map((t) => t.total));
                    const totalHeight =
                      maxValue > 0 ? (trend.total / maxValue) * 100 : 0;
                    const resolvedHeight =
                      trend.total > 0
                        ? (trend.resolved / trend.total) * totalHeight
                        : 0;
                    const pendingHeight =
                      trend.total > 0
                        ? (trend.pending / trend.total) * totalHeight
                        : 0;

                    return (
                      <div key={index} className="text-center">
                        <div className="h-32 flex items-end justify-center mb-2">
                          <div
                            className="w-12 bg-gray-200 rounded-t relative"
                            style={{
                              height: `${totalHeight}%`,
                              minHeight: "4px",
                            }}
                          >
                            <div
                              className="absolute bottom-0 w-full bg-green-500 rounded-t"
                              style={{ height: `${resolvedHeight}%` }}
                            ></div>
                            <div
                              className="absolute bottom-0 w-full bg-yellow-500 rounded-t"
                              style={{
                                height: `${pendingHeight}%`,
                                transform: `translateY(-${resolvedHeight}%)`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatTrendDate(trend.date)}
                        </div>
                        <div className="text-xs font-medium text-gray-900">
                          {trend.total}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No trend data available for the selected period</p>
          </div>
        )}
      </div>

      {/* Status Breakdown */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {stats.inProgress}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {stats.resolved}
              </p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              <p className="text-sm text-gray-600">Closed</p>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>
    </div>
  );
}
