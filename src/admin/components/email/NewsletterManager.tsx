// src/admin/components/email/NewsletterManager.tsx
"use client";

import { useState } from "react";
import { Mail, Send, Users, Download } from "lucide-react";
import { useAdminData, usePagination, useFilters } from "../../hooks";
import { EmailForm } from "./EmailForm";
import React from "react";

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

interface BulkEmail {
  id: string;
  subject: string;
  sentTo: number;
  status: string;
  sentAt: string;
  createdBy: string;
}

interface NewsletterStats {
  total: number;
  active: number;
  emailsSent: number;
}

interface RecipientCounts {
  all: number;
  premium: number;
  active: number;
  inactive: number;
}

// API Service for Newsletter
class NewsletterAPIService {
  private static async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`/api/admin/newsletter${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getSubscribers() {
    const response = await this.request("/subscribers");
    return {
      subscribers: response.subscribers || [],
      count: response.count || 0,
    };
  }

  static async getEmailHistory() {
    const response = await this.request("/history");
    return {
      emails: response.emails || [],
    };
  }

  static async deleteSubscriber(email: string) {
    return this.request("/subscribers", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    });
  }

  static async getRecipientCounts(): Promise<RecipientCounts> {
    // For newsletter, we'll use simplified counts
    const subscribersData = await this.getSubscribers();
    return {
      all: subscribersData.count,
      premium: 0,
      active: subscribersData.subscribers.filter(
        (s: NewsletterSubscriber) => s.isActive
      ).length,
      inactive: subscribersData.subscribers.filter(
        (s: NewsletterSubscriber) => !s.isActive
      ).length,
    };
  }
}

export default function NewsletterManager() {
  const [activeTab, setActiveTab] = useState<
    "subscribers" | "compose" | "history"
  >("subscribers");
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Data fetching
  const { data: subscribersData, loading: loadingSubscribers } = useAdminData({
    fetchFn: NewsletterAPIService.getSubscribers,
  });

  const {
    data: historyData,
    loading: loadingHistory,
    refetch: refetchHistory,
  } = useAdminData({
    fetchFn: NewsletterAPIService.getEmailHistory,
  });

  const { data: recipientCounts } = useAdminData({
    fetchFn: NewsletterAPIService.getRecipientCounts,
  });

  // Pagination for subscribers
  const subscribersPagination = usePagination({
    initialLimit: 20,
  });

  // Filters for subscribers
  const subscribersFilters = useFilters({
    initialFilters: {
      search: "",
      status: "",
    },
  });

  const subscribers = subscribersData?.subscribers || [];
  const emails = historyData?.emails || [];
  const stats: NewsletterStats = {
    total: subscribersData?.count || 0,
    active: subscribers.filter((s: NewsletterSubscriber) => s.isActive).length,
    emailsSent: emails.length,
  };

  const exportSubscribers = () => {
    const csvContent = [
      ["Email", "Subscribed At", "Status"],
      ...subscribers.map((sub: NewsletterSubscriber) => [
        sub.email,
        new Date(sub.subscribedAt).toLocaleDateString(),
        sub.isActive ? "Active" : "Inactive",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEmailFormSuccess = () => {
    setShowEmailForm(false);
    refetchHistory();
  };

  // Filter subscribers based on search and status
  const filteredSubscribers = subscribers.filter(
    (subscriber: NewsletterSubscriber) => {
      const matchesSearch =
        subscribersFilters.filters.search === "" ||
        subscriber.email
          .toLowerCase()
          .includes(subscribersFilters.filters.search.toLowerCase());

      const matchesStatus =
        subscribersFilters.filters.status === "" ||
        (subscribersFilters.filters.status === "active" &&
          subscriber.isActive) ||
        (subscribersFilters.filters.status === "inactive" &&
          !subscriber.isActive);

      return matchesSearch && matchesStatus;
    }
  );

  // Update pagination when filtered data changes
  React.useEffect(() => {
    subscribersPagination.updatePagination({
      totalItems: filteredSubscribers.length,
      totalPages: Math.ceil(
        filteredSubscribers.length / subscribersPagination.itemsPerPage
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSubscribers.length, subscribersPagination.itemsPerPage]);

  if (loadingSubscribers && loadingHistory) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Newsletter Management
          </h2>
          <div className="flex gap-2">
            <button
              onClick={exportSubscribers}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowEmailForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
              <span>Send Newsletter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">
                  Total Subscribers
                </p>
                <p className="text-2xl font-semibold text-blue-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">
                  Active Subscribers
                </p>
                <p className="text-2xl font-semibold text-green-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Send className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">
                  Newsletters Sent
                </p>
                <p className="text-2xl font-semibold text-purple-900">
                  {stats.emailsSent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: "subscribers", label: "Subscribers", icon: Users },
              { id: "history", label: "Newsletter History", icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-medium text-sm ${
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

        <div className="p-6">
          {activeTab === "subscribers" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    value={subscribersFilters.filters.search}
                    onChange={(e) =>
                      subscribersFilters.setFilter("search", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <select
                    title="Filter by status"
                    value={subscribersFilters.filters.status}
                    onChange={(e) =>
                      subscribersFilters.setFilter("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600 self-center">
                  Showing {filteredSubscribers.length} of {subscribers.length}{" "}
                  subscribers
                </div>
              </div>

              {/* Subscribers Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-900">
                        Email
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">
                        Subscribed
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">
                        Status
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
                    {emails.map((email: BulkEmail) => (
                      <tr key={email.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">
                          {email.subject}
                        </td>
                        <td className="py-3 px-4">{email.sentTo}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              email.status === "sent"
                                ? "bg-green-100 text-green-800"
                                : email.status === "sending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {email.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(email.sentAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{email.createdBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {emails.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No newsletters sent yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Email Form Modal */}
      {showEmailForm && recipientCounts && (
        <EmailForm
          type="newsletter"
          recipientCounts={recipientCounts}
          onClose={() => setShowEmailForm(false)}
          onSuccess={handleEmailFormSuccess}
        />
      )}
    </div>
  );
}
