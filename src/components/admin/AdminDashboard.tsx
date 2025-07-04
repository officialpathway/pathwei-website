// components/admin/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import {
  BarChart3,
  Users,
  Settings,
  Mail,
  LogOut,
  Shield,
  DollarSign,
  Database,
  Calendar,
  Send,
  Eye,
  TrendingUp,
  Server,
  Menu,
  X,
} from "lucide-react";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  { id: "newsletter", label: "Newsletter", icon: <Mail className="w-5 h-5" /> },
  { id: "revenue", label: "Revenue", icon: <DollarSign className="w-5 h-5" /> },
  { id: "database", label: "Database", icon: <Database className="w-5 h-5" /> },
  {
    id: "assets",
    label: "Assets & Bills",
    icon: <Calendar className="w-5 h-5" />,
  },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

interface DashboardStats {
  subscribers: number;
  revenue: number;
  subscriptionRevenue: number;
  adRevenue: number;
  activeAssets: number;
  expiringSoon: number;
}

export default function AdminDashboard() {
  const { user, loading, logout } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    subscribers: 0,
    revenue: 0,
    subscriptionRevenue: 0,
    adRevenue: 0,
    activeAssets: 0,
    expiringSoon: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview stats={stats} loadingStats={loadingStats} />;
      case "newsletter":
        return <NewsletterManager />;
      case "revenue":
        return <RevenueManager />;
      case "database":
        return <DatabaseManager />;
      case "assets":
        return <AssetsManager />;
      case "settings":
        return <SettingsManager />;
      default:
        return <DashboardOverview stats={stats} loadingStats={loadingStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } fixed lg:relative z-10 h-full`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 ${
                sidebarOpen ? "opacity-100" : "opacity-0"
              } transition-opacity`}
            >
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 border-r-2 border-blue-600 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {item.icon}
              <span
                className={`ml-3 ${
                  sidebarOpen ? "opacity-100" : "opacity-0"
                } transition-opacity`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span
              className={`ml-3 ${
                sidebarOpen ? "opacity-100" : "opacity-0"
              } transition-opacity`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 ml-16">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {activeTab === "dashboard" ? "Dashboard Overview" : activeTab}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{renderDashboardContent()}</main>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({
  stats,
  loadingStats,
}: {
  stats: DashboardStats;
  loadingStats: boolean;
}) {
  if (loadingStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Newsletter Subscribers"
          value={stats.subscribers}
          icon={<Users className="w-8 h-8 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.revenue / 100).toFixed(2)}`}
          icon={<DollarSign className="w-8 h-8 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Subscription Revenue"
          value={`$${(stats.subscriptionRevenue / 100).toFixed(2)}`}
          icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Ad Revenue"
          value={`$${(stats.adRevenue / 100).toFixed(2)}`}
          icon={<BarChart3 className="w-8 h-8 text-orange-600" />}
          color="orange"
        />
        <StatCard
          title="Active Assets"
          value={stats.activeAssets}
          icon={<Server className="w-8 h-8 text-indigo-600" />}
          color="indigo"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon={<Calendar className="w-8 h-8 text-red-600" />}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            label="Send Newsletter"
            icon={<Send className="w-5 h-5" />}
            onClick={() => {}}
          />
          <QuickActionButton
            label="View Revenue"
            icon={<Eye className="w-5 h-5" />}
            onClick={() => {}}
          />
          <QuickActionButton
            label="Manage Assets"
            icon={<Settings className="w-5 h-5" />}
            onClick={() => {}}
          />
          <QuickActionButton
            label="Database"
            icon={<Database className="w-5 h-5" />}
            onClick={() => {}}
          />
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
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
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
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

// Placeholder components for other tabs
function NewsletterManager() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Newsletter Management</h2>
      <p className="text-gray-600">
        Newsletter management features will be implemented here.
      </p>
    </div>
  );
}

function RevenueManager() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
      <p className="text-gray-600">
        Revenue analytics and management features will be implemented here.
      </p>
    </div>
  );
}

function DatabaseManager() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Database Management</h2>
      <p className="text-gray-600">
        Database management features for mypathwayapp.com/api/v1/... will be
        implemented here.
      </p>
    </div>
  );
}

function AssetsManager() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Assets & Bills</h2>
      <p className="text-gray-600">
        Asset and bill management features will be implemented here.
      </p>
    </div>
  );
}

function SettingsManager() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <p className="text-gray-600">Admin settings will be implemented here.</p>
    </div>
  );
}
