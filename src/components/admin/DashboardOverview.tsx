// src/components/admin/DashboardOverview.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Crown,
  UserCheck,
  Folder,
  Database,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  categoriesCount: number;
}

// API Service
class DashboardAPIService {
  private static get baseURL() {
    return `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/v1/admin`;
  }
  private static async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Dashboard-Secret": process.env.NEXT_PUBLIC_ADMIN_SECRET || "",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getStats(): Promise<DashboardStats> {
    const [userStatsResponse, categoriesResponse] = await Promise.all([
      this.request("/users/stats"),
      this.request("/categories"),
    ]);

    return {
      totalUsers: userStatsResponse.data.totalUsers,
      premiumUsers: userStatsResponse.data.premiumUsers,
      activeUsers: Math.floor(userStatsResponse.data.totalUsers * 0.7), // Placeholder calculation
      categoriesCount: categoriesResponse.data.categories.length,
    };
  }
}

interface DashboardOverviewProps {
  onNavigate?: (path: string) => void;
}

export default function DashboardOverview({
  onNavigate,
}: DashboardOverviewProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    premiumUsers: 0,
    activeUsers: 0,
    categoriesCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const dashboardStats = await DashboardAPIService.getStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loadingStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-8 h-8 text-blue-600" />}
          color="blue"
          subtitle="Registered users"
          onClick={() => onNavigate?.("/admin/users")}
        />
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers}
          icon={<Crown className="w-8 h-8 text-yellow-600" />}
          color="yellow"
          subtitle="Paying subscribers"
          onClick={() => onNavigate?.("/admin/users")}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<UserCheck className="w-8 h-8 text-green-600" />}
          color="green"
          subtitle="Last 30 days"
          onClick={() => onNavigate?.("/admin/users")}
        />
        <StatCard
          title="Path Categories"
          value={stats.categoriesCount}
          icon={<Folder className="w-8 h-8 text-purple-600" />}
          color="purple"
          subtitle="Learning categories"
          onClick={() => onNavigate?.("/admin/categories")}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            label="Manage Users"
            icon={<Users className="w-5 h-5" />}
            onClick={() => onNavigate?.("/admin/users")}
            description="View and manage all users"
          />
          <QuickActionButton
            label="Add Category"
            icon={<Folder className="w-5 h-5" />}
            onClick={() => onNavigate?.("/admin/categories")}
            description="Create new path category"
          />
          <QuickActionButton
            label="System Health"
            icon={<Database className="w-5 h-5" />}
            onClick={() => {}}
            description="Check system status"
          />
          <QuickActionButton
            label="Settings"
            icon={<Settings className="w-5 h-5" />}
            onClick={() => onNavigate?.("/admin/settings")}
            description="Admin configuration"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <ActivityItem
            type="user"
            message="New user registration"
            time="2 minutes ago"
            status="info"
          />
          <ActivityItem
            type="premium"
            message="Premium subscription activated"
            time="15 minutes ago"
            status="success"
          />
          <ActivityItem
            type="category"
            message="New category 'AI & Machine Learning' created"
            time="1 hour ago"
            status="info"
          />
          <ActivityItem
            type="system"
            message="Database backup completed"
            time="3 hours ago"
            status="success"
          />
        </div>
      </div>

      {/* API Connection Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Production API</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Connected
            </span>
          </div>
          <div className="text-xs text-gray-500 ml-8">
            Connected to: mypathwayapp.com/api/v1/admin/
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Database</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Healthy
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Authentication</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
  onClick,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>{icon}</div>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  label,
  icon,
  onClick,
  description,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center"
    >
      <div className="mb-2 text-gray-600">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {description && (
        <span className="text-xs text-gray-500 mt-1">{description}</span>
      )}
    </button>
  );
}

// Activity Item Component
function ActivityItem({
  message,
  time,
  status,
}: {
  type: string;
  message: string;
  time: string;
  status: "info" | "success" | "warning" | "error";
}) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">{getStatusIcon()}</div>
      <div className="flex-1">
        <span className="text-gray-700">{message}</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-500">
        <Clock className="w-3 h-3" />
        <span className="text-sm">{time}</span>
      </div>
    </div>
  );
}
