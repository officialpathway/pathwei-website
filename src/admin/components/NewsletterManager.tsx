// admin/NewsletterManager.tsx
"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Users, Trash2, Download, Plus } from "lucide-react";

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

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [bulkEmails, setBulkEmails] = useState<BulkEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "subscribers" | "compose" | "history"
  >("subscribers");
  const [stats, setStats] = useState({ total: 0, active: 0 });

  // Compose email state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subscribersRes, historyRes] = await Promise.all([
        fetch("/api/admin/newsletter/subscribers"),
        fetch("/api/admin/newsletter/history"),
      ]);

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json();
        setSubscribers(subscribersData.subscribers || []);
        setStats({
          total: subscribersData.count || 0,
          active:
            subscribersData.subscribers?.filter(
              (s: NewsletterSubscriber) => s.isActive
            ).length || 0,
        });
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setBulkEmails(historyData.emails || []);
      }
    } catch (error) {
      console.error("Failed to fetch newsletter data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      alert("Please fill in both subject and content");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
        }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
        setEmailSubject("");
        setEmailContent("");
        fetchData(); // Refresh history
      } else {
        alert("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSubscriber = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    try {
      const response = await fetch("/api/admin/newsletter/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        alert("Failed to delete subscriber");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ["Email", "Subscribed At", "Status"],
      ...subscribers.map((sub) => [
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

  if (loading) {
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
          <button
            onClick={exportSubscribers}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
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
                  Emails Sent
                </p>
                <p className="text-2xl font-semibold text-purple-900">
                  {bulkEmails.length}
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
              { id: "compose", label: "Compose Email", icon: Plus },
              { id: "history", label: "Email History", icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() =>
                  setActiveTab(id as "subscribers" | "compose" | "history")
                }
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className="border-b border-gray-100"
                      >
                        <td className="py-3 px-4">{subscriber.email}</td>
                        <td className="py-3 px-4">
                          {new Date(
                            subscriber.subscribedAt
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              subscriber.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {subscriber.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            title="button"
                            type="button"
                            onClick={() =>
                              handleDeleteSubscriber(subscriber.email)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "compose" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email content..."
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  This email will be sent to {stats.active} active subscribers
                </p>
                <button
                  onClick={handleSendBulkEmail}
                  disabled={sending}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? "Sending..." : "Send Email"}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
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
                        Sent At
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">
                        Sent By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkEmails.map((email) => (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
