// src/components/admin/FeedbackManagement.tsx
"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  RefreshCw,
} from "lucide-react";
import {
  AdminAPIService,
  Feedback,
  FeedbackStats,
  FeedbackTrends,
  ApiFilters,
} from "@/services/AdminAPIService";

interface FeedbackFilters extends ApiFilters {
  status?: "pending" | "in_progress" | "resolved" | "closed" | "";
  type?: "bug" | "feature" | "general" | "complaint" | "";
  priority?: "low" | "medium" | "high" | "critical" | "";
}

export default function FeedbackManagement() {
  // State Management
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [, setTrends] = useState<FeedbackTrends[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [updating, setUpdating] = useState(false);

  // Filters and Pagination
  const [filters, setFilters] = useState<FeedbackFilters>({
    page: 1,
    limit: 20,
    status: "",
    type: "",
    priority: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchFeedbackData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchStats();
    fetchTrends();
  }, []);

  // Data Fetching Functions
  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const response = await AdminAPIService.getAllFeedback(filters);
      setFeedback(response.feedback);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await AdminAPIService.getFeedbackStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch feedback stats:", error);
    }
  };

  const fetchTrends = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30); // Last 30 days

      const trendsData = await AdminAPIService.getFeedbackTrends(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      setTrends(trendsData);
    } catch (error) {
      console.error("Failed to fetch feedback trends:", error);
    }
  };

  // Event Handlers
  const handleFilterChange = (key: keyof FeedbackFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewDetails = async (feedbackItem: Feedback) => {
    try {
      const fullFeedback = await AdminAPIService.getFeedbackById(
        feedbackItem.id
      );
      setSelectedFeedback(fullFeedback);
      setAdminResponse(fullFeedback.adminResponse || "");
      setShowDetails(true);
    } catch (error) {
      console.error("Failed to fetch feedback details:", error);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedFeedback) return;

    try {
      setUpdating(true);
      await AdminAPIService.updateFeedbackStatus(selectedFeedback.id, {
        status,
        adminResponse: adminResponse.trim() || undefined,
      });

      // Refresh feedback list
      await fetchFeedbackData();
      await fetchStats();

      // Update selected feedback
      setSelectedFeedback((prev) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prev ? { ...prev, status: status as any } : null
      );
    } catch (error) {
      console.error("Failed to update feedback status:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Utility Functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "in_progress":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "text-red-600 bg-red-50";
      case "feature":
        return "text-blue-600 bg-blue-50";
      case "complaint":
        return "text-orange-600 bg-orange-50";
      case "general":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          Feedback Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage user feedback, track issues, and respond to user inquiries
        </p>
      </div>

      {/* Stats Overview */}
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
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              title="Filter by status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              title="Filter by type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="general">General</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              title="Filter by priority"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.priority || ""}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Feedback Items
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading feedback...</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No feedback found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedback.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.user?.firstName || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.user?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                            item.type
                          )}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className="ml-2 text-sm text-gray-900 capitalize">
                            {item.status.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Feedback Details Modal */}
      {showDetails && selectedFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Feedback Details
                </h3>
                <button
                  title="Close details"
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Feedback Information */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ID
                    </label>
                    <p className="text-sm text-gray-900">
                      #{selectedFeedback.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="flex items-center mt-1">
                      {getStatusIcon(selectedFeedback.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {selectedFeedback.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getTypeColor(
                        selectedFeedback.type
                      )}`}
                    >
                      {selectedFeedback.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getPriorityColor(
                        selectedFeedback.priority
                      )}`}
                    >
                      {selectedFeedback.priority}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFeedback.user?.firstName || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedFeedback.user?.email || "No email available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedFeedback.subject}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedFeedback.description}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedFeedback.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Updated At
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedFeedback.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Existing Admin Response */}
                {selectedFeedback.adminResponse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Previous Admin Response
                    </label>
                    <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedFeedback.adminResponse}
                      </p>
                    </div>
                  </div>
                )}

                {/* Admin Response Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Admin Response
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your response to the user..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                  />
                </div>

                {/* Status Update Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Update Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusUpdate("pending")}
                      disabled={
                        updating || selectedFeedback.status === "pending"
                      }
                      className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Set Pending
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("in_progress")}
                      disabled={
                        updating || selectedFeedback.status === "in_progress"
                      }
                      className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Set In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("resolved")}
                      disabled={
                        updating || selectedFeedback.status === "resolved"
                      }
                      className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("closed")}
                      disabled={
                        updating || selectedFeedback.status === "closed"
                      }
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Close
                    </button>
                  </div>
                  {updating && (
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating status...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
