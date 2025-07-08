// src/admin/components/email/BulkEmailManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Send,
  Users,
  Crown,
  UserCheck,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { EmailForm } from "./EmailForm";

interface BulkEmailStats {
  totalEmails: number;
  sentToday: number;
  sentThisWeek: number;
  sentThisMonth: number;
  failureRate: number;
}

interface RecipientCounts {
  all: number;
  premium: number;
  active: number;
  inactive: number;
}

interface BulkEmailHistory {
  id: number;
  subject: string;
  recipientCount: number;
  status: "pending" | "sending" | "sent" | "failed";
  successCount?: number;
  failedCount?: number;
  sentAt: string;
  createdBy: string;
  createdAt: string;
}

// API Service for Bulk Email
class BulkEmailAPIService {
  private static get baseURL() {
    return `${
      process.env.NEXT_PUBLIC_APP_URL || "https://mypathwayapp.com"
    }/api/v1/email/bulk-email`;
  }

  private static async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Dashboard-Secret": "PathwegAdmin2025!",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getStats(): Promise<BulkEmailStats> {
    try {
      const response = await this.request("/stats");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bulk email stats:", error);
      return {
        totalEmails: 0,
        sentToday: 0,
        sentThisWeek: 0,
        sentThisMonth: 0,
        failureRate: 0,
      };
    }
  }

  static async getRecipientCounts(): Promise<RecipientCounts> {
    try {
      const response = await this.request("/recipients/counts");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recipient counts:", error);
      return {
        all: 0,
        premium: 0,
        active: 0,
        inactive: 0,
      };
    }
  }

  static async getHistory(page: number = 1, limit: number = 20) {
    try {
      const response = await this.request(
        `/history?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch bulk email history:", error);
      return { emails: [] };
    }
  }
}

export function BulkEmailManager() {
  const [activeTab, setActiveTab] = useState<"compose" | "history" | "stats">(
    "compose"
  );
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Data state
  const [stats, setStats] = useState<BulkEmailStats>({
    totalEmails: 0,
    sentToday: 0,
    sentThisWeek: 0,
    sentThisMonth: 0,
    failureRate: 0,
  });
  const [recipientCounts, setRecipientCounts] = useState<RecipientCounts>({
    all: 0,
    premium: 0,
    active: 0,
    inactive: 0,
  });
  const [historyData, setHistoryData] = useState<{
    emails: BulkEmailHistory[];
  }>({
    emails: [],
  });

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Filters for email history
  const [historyFilters, setHistoryFilters] = useState({
    search: "",
    status: "",
    dateRange: "",
  });

  // Prevent infinite requests by using useCallback and proper dependencies
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const statsData = await BulkEmailAPIService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchRecipientCounts = useCallback(async () => {
    try {
      setLoadingCounts(true);
      const countsData = await BulkEmailAPIService.getRecipientCounts();
      setRecipientCounts(countsData);
    } catch (error) {
      console.error("Failed to fetch recipient counts:", error);
    } finally {
      setLoadingCounts(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const history = await BulkEmailAPIService.getHistory(1, 20);
      setHistoryData(history);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Initial data fetch - only run once on mount
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      await Promise.all([fetchStats(), fetchRecipientCounts(), fetchHistory()]);
    };

    if (isMounted) {
      initializeData();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  const handleFilterChange = (key: string, value: string) => {
    setHistoryFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "sending":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleEmailFormSuccess = () => {
    setShowEmailForm(false);
    fetchHistory();
    fetchStats();
  };

  const emails = historyData?.emails || [];

  // Filter emails based on search and status
  const filteredEmails = emails.filter((email: BulkEmailHistory) => {
    const matchesSearch =
      historyFilters.search === "" ||
      email.subject.toLowerCase().includes(historyFilters.search.toLowerCase());

    const matchesStatus =
      historyFilters.status === "" || email.status === historyFilters.status;

    return matchesSearch && matchesStatus;
  });

  if (loadingStats && loadingCounts && loadingHistory) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Bulk Email Management
          </h2>
          <button
            onClick={() => setShowEmailForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
            <span>Compose Email</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: "compose", label: "Quick Send", icon: Send },
              { id: "history", label: "Email History", icon: Mail },
              { id: "stats", label: "Statistics", icon: Eye },
            ].map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => setActiveTab(id as never)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "compose" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Email Composition
          </h3>

          {/* Recipient Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">All Users</p>
                  <p className="text-2xl font-semibold text-blue-800">
                    {recipientCounts.all}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Premium</p>
                  <p className="text-2xl font-semibold text-yellow-800">
                    {recipientCounts.premium}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Active</p>
                  <p className="text-2xl font-semibold text-green-800">
                    {recipientCounts.active}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Inactive</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {recipientCounts.inactive}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowEmailForm(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
            >
              <Send className="w-5 h-5" />
              <span>Compose New Email</span>
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Create and send emails to your user segments
            </p>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Email History
              </h3>

              {/* Filters */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={historyFilters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  title="Filter by status"
                  value={historyFilters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="sending">Sending</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Subject
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Recipients
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Success Rate
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Sent At
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">
                    Sent By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmails.map((email: BulkEmailHistory) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {email.subject}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {email.recipientCount}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(email.status)}
                        <span
                          className={`text-sm capitalize ${
                            email.status === "sent"
                              ? "text-green-600"
                              : email.status === "failed"
                              ? "text-red-600"
                              : email.status === "sending"
                              ? "text-blue-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {email.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {email.successCount !== undefined &&
                      email.failedCount !== undefined ? (
                        <span className="text-sm">
                          {email.successCount}/{email.recipientCount} (
                          {Math.round(
                            (email.successCount / email.recipientCount) * 100
                          )}
                          %)
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {email.sentAt
                        ? new Date(email.sentAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {email.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmails.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No emails found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Mail className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Emails Sent
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalEmails}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Sent Today
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.sentToday}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.sentThisMonth}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle
                  className={`w-8 h-8 ${
                    stats.failureRate > 5 ? "text-red-600" : "text-green-600"
                  }`}
                />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Failure Rate
                  </p>
                  <p
                    className={`text-2xl font-semibold ${
                      stats.failureRate > 5 ? "text-red-900" : "text-green-900"
                    }`}
                  >
                    {stats.failureRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.sentThisWeek}
                </p>
                <p className="text-sm text-gray-600">Emails This Week</p>
              </div>

              <div className="text-center">
                <p
                  className={`text-3xl font-bold ${
                    100 - stats.failureRate < 2
                      ? "text-green-600"
                      : 100 - stats.failureRate < 5
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {(100 - stats.failureRate).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalEmails > 0
                    ? Math.round(stats.totalEmails / 30)
                    : 0}
                </p>
                <p className="text-sm text-gray-600">Avg. Daily Emails</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Form Modal */}
      {showEmailForm && (
        <EmailForm
          type="bulk"
          recipientCounts={recipientCounts}
          onClose={() => setShowEmailForm(false)}
          onSuccess={handleEmailFormSuccess}
        />
      )}
    </div>
  );
}
