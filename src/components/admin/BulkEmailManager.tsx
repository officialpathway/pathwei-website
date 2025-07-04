// Bulk Email Manager Component for Admin Dashboard

"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Users,
  Crown,
  UserCheck,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

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
  recipientCount: number; // was recipient_count
  status: "pending" | "sending" | "sent" | "failed";
  successCount?: number; // was success_count
  failedCount?: number; // was failed_count
  sentAt: string; // was sent_at
  createdBy: string; // was created_by
  createdAt: string; // was created_at
}

interface EmailFormData {
  subject: string;
  htmlContent: string;
  textContent: string;
  recipients: "all" | "premium" | "active" | "custom";
  customEmails: string;
  tags: string;
}

// API Service for Bulk Email
class BulkEmailAPIService {
  private static get baseURL() {
    return `${
      process.env.APP_URL || "https://mypathwayapp.com"
    }/api/v1/email/bulk-email`;
  }

  private static async request(endpoint: string, options?: RequestInit) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Dashboard-Secret": "PathwegAdmin2025!",
        ...options?.headers,
      },
      ...options,
    };

    console.log("Making request to:", url);
    console.log("Request options:", requestOptions);

    const response = await fetch(url, requestOptions);

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  static async getStats(): Promise<BulkEmailStats> {
    const response = await this.request("/stats");
    return response.data;
  }

  static async getRecipientCounts(): Promise<RecipientCounts> {
    const response = await this.request("/recipients/counts");
    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async sendBulkEmail(emailData: any) {
    const response = await this.request("/send", {
      method: "POST",
      body: JSON.stringify(emailData),
    });
    return response.data;
  }

  static async getHistory(page: number = 1, limit: number = 20) {
    const response = await this.request(`/history?page=${page}&limit=${limit}`);
    return response.data;
  }
}

export function BulkEmailManager() {
  const [activeTab, setActiveTab] = useState<"compose" | "history" | "stats">(
    "compose"
  );
  const [loading, setLoading] = useState(false);
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
  const [history, setHistory] = useState<BulkEmailHistory[]>([]);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState<EmailFormData>({
    subject: "",
    htmlContent: "",
    textContent: "",
    recipients: "active",
    customEmails: "",
    tags: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, countsData, historyData] = await Promise.all([
        BulkEmailAPIService.getStats(),
        BulkEmailAPIService.getRecipientCounts(),
        BulkEmailAPIService.getHistory(),
      ]);

      setStats(statsData);
      setRecipientCounts(countsData);
      setHistory(historyData.emails);
    } catch (error) {
      console.error("Failed to fetch bulk email data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (
      !formData.subject.trim() ||
      (!formData.htmlContent.trim() && !formData.textContent.trim())
    ) {
      alert("Please fill in subject and at least one content field");
      return;
    }

    if (formData.recipients === "custom" && !formData.customEmails.trim()) {
      alert("Please enter custom email addresses");
      return;
    }

    const confirmMessage = `Are you sure you want to send this email to ${getRecipientCount()} recipients?`;
    if (!confirm(confirmMessage)) return;

    setSending(true);
    try {
      const emailData = {
        subject: formData.subject,
        htmlContent: formData.htmlContent || undefined,
        textContent: formData.textContent || undefined,
        recipients: formData.recipients,
        customEmails:
          formData.recipients === "custom"
            ? formData.customEmails
                .split(",")
                .map((email) => email.trim())
                .filter(Boolean)
            : undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined,
      };

      await BulkEmailAPIService.sendBulkEmail(emailData);
      alert("Bulk email sent successfully!");

      // Reset form
      setFormData({
        subject: "",
        htmlContent: "",
        textContent: "",
        recipients: "active",
        customEmails: "",
        tags: "",
      });

      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Failed to send bulk email:", error);
      alert("Failed to send bulk email");
    } finally {
      setSending(false);
    }
  };

  const getRecipientCount = () => {
    switch (formData.recipients) {
      case "all":
        return recipientCounts.all;
      case "premium":
        return recipientCounts.premium;
      case "active":
        return recipientCounts.active;
      case "custom":
        return formData.customEmails.split(",").filter((email) => email.trim())
          .length;
      default:
        return 0;
    }
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

  if (loading) {
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Bulk Email Management
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: "compose", label: "Compose Email", icon: Send },
              { id: "history", label: "Email History", icon: Mail },
              { id: "stats", label: "Statistics", icon: Eye },
            ].map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() =>
                  setActiveTab(id as "compose" | "history" | "stats")
                }
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
        <div className="space-y-6">
          {/* Recipient Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Recipients
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.recipients === "all"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setFormData({ ...formData, recipients: "all" })}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">All Users</p>
                    <p className="text-sm text-gray-600">
                      {recipientCounts.all} users
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.recipients === "premium"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData({ ...formData, recipients: "premium" })
                }
              >
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Premium Users</p>
                    <p className="text-sm text-gray-600">
                      {recipientCounts.premium} users
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.recipients === "active"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData({ ...formData, recipients: "active" })
                }
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Active Users</p>
                    <p className="text-sm text-gray-600">
                      {recipientCounts.active} users
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.recipients === "custom"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData({ ...formData, recipients: "custom" })
                }
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Custom List</p>
                    <p className="text-sm text-gray-600">Enter emails</p>
                  </div>
                </div>
              </div>
            </div>

            {formData.recipients === "custom" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Email Addresses (comma-separated)
                </label>
                <textarea
                  value={formData.customEmails}
                  onChange={(e) =>
                    setFormData({ ...formData, customEmails: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="user1@example.com, user2@example.com, ..."
                />
              </div>
            )}
          </div>

          {/* Email Composition */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Compose Email
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email subject..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTML Content
                </label>
                <textarea
                  value={formData.htmlContent}
                  onChange={(e) =>
                    setFormData({ ...formData, htmlContent: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  placeholder="Enter HTML email content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plain Text Content (fallback)
                </label>
                <textarea
                  value={formData.textContent}
                  onChange={(e) =>
                    setFormData({ ...formData, textContent: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Enter plain text email content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="newsletter, announcement, marketing..."
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Will be sent to <strong>{getRecipientCount()}</strong>{" "}
                recipients
              </div>
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? "Sending..." : "Send Email"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Email History
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-900">
                      Subject
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">
                      Recipients
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">
                      Success Rate
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">
                      Sent At
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">
                      Sent By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((email) => (
                    <tr key={email.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">{email.subject}</td>
                      <td className="py-3 px-4">{email.recipientCount}</td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {email.sentAt
                          ? new Date(email.sentAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {email.createdBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

          {/* Recipient Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Segments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
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

              <div className="bg-yellow-50 rounded-lg p-4">
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

              <div className="bg-green-50 rounded-lg p-4">
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

              <div className="bg-gray-50 rounded-lg p-4">
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
          </div>

          {/* Performance Metrics */}
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
                    stats.failureRate < 2
                      ? "text-green-600"
                      : stats.failureRate < 5
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
    </div>
  );
}
