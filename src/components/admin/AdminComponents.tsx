// src/components/admin/adminComponents.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Crown,
  UserCheck,
  UserX,
} from "lucide-react";

// Base API URL for production
const API_BASE_URL = "http://localhost:3000/api/v1/admin";

// Types
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  role: string;
  accountStatus: "active" | "suspended" | "deactivated";
  isPremium: boolean;
  createdAt: string;
  lastLoginAt?: string;
  enrolledPathsCount: number;
  completedPathsCount: number;
  dailyStreak: number;
  isFlagged: boolean;
  flagReason?: string;
  isAdmin: boolean;
}

interface PathCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent_category_id?: number;
  is_active: boolean;
  display_order: number;
  is_testable: boolean;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  totalUsers: number;
  premiumUsers: number;
}

// API Service
class AdminAPIService {
  private static async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Dashboard-Secret": "admin-secret-key",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User Management APIs
  static async getUserStats(): Promise<UserStats> {
    const response = await this.request("/users/stats");
    console.log("[GetUserStats]", response);
    return response.data;
  }

  static async getUsers(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    role?: string;
    accountType?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await this.request(`/users?${params}`);
    console.log("[GetUsers]", response);
    return response.data;
  }

  static async getUserById(userId: number): Promise<User> {
    const response = await this.request(`/users/${userId}`);
    console.log("[GetUserById]", response);
    return response.data.user;
  }

  static async updateUser(
    userId: number,
    updates: Partial<User>
  ): Promise<User> {
    const response = await this.request(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return response.data.user;
  }

  // Path Category APIs
  static async getPathCategories(): Promise<PathCategory[]> {
    const response = await this.request("/categories");
    return response.data.categories;
  }

  static async createPathCategory(categoryData: {
    name: string;
    description: string;
    icon: string;
    color: string;
    parent_category_id?: number;
    is_active?: boolean;
    display_order?: number;
    is_testable?: boolean;
  }): Promise<PathCategory> {
    const response = await this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response.data.category;
  }

  static async updatePathCategory(
    categoryId: number,
    updates: Partial<PathCategory>
  ): Promise<PathCategory> {
    const response = await this.request(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return response.data.category;
  }

  static async deletePathCategory(categoryId: number): Promise<void> {
    await this.request(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  }
}

// User Management Component
export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "",
    role: "",
    accountType: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    deactivatedUsers: 0,
    premiumUsers: 0,
    flaggedUsers: 0,
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        AdminAPIService.getUserStats(),
        AdminAPIService.getUsers(filters),
      ]);

      setUserStats(statsData);
      setUsers(usersData.users);
      setPagination(usersData.pagination);
      setSummary(usersData.summary);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (userId: number, updates: Partial<User>) => {
    try {
      await AdminAPIService.updateUser(userId, updates);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summary.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Premium Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summary.premiumUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summary.activeUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Flagged Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summary.flaggedUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search users..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              title="Filter by Status"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              title="Account Type"
              value={filters.accountType}
              onChange={(e) =>
                handleFilterChange("accountType", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              title="User Role"
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Per Page
            </label>
            <select
              title="items per page"
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Users Management
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">
                            {user.firstName?.[0]?.toUpperCase() ||
                              user.username?.[0]?.toUpperCase() ||
                              "U"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.accountStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : user.accountStatus === "suspended"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.accountStatus}
                    </span>
                    {user.isFlagged && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Flagged
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {user.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                      )}
                      <span className="text-sm text-gray-900">
                        {user.isPremium ? "Premium" : "Free"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>Enrolled: {user.enrolledPathsCount}</div>
                    <div>Completed: {user.completedPathsCount}</div>
                    <div>Streak: {user.dailyStreak} days</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <UserActionDropdown
                      user={user}
                      onUpdate={handleUserUpdate}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Action Dropdown Component
function UserActionDropdown({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (userId: number, updates: Partial<User>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: user.accountStatus === "active" ? "Suspend User" : "Activate User",
      action: () =>
        onUpdate(user.id, {
          accountStatus:
            user.accountStatus === "active" ? "suspended" : "active",
        }),
      color:
        user.accountStatus === "active" ? "text-red-600" : "text-green-600",
    },
    {
      label: user.isPremium ? "Remove Premium" : "Grant Premium",
      action: () => onUpdate(user.id, { isPremium: !user.isPremium }),
      color: user.isPremium ? "text-red-600" : "text-blue-600",
    },
    {
      label: user.isFlagged ? "Remove Flag" : "Flag User",
      action: () =>
        onUpdate(user.id, {
          isFlagged: !user.isFlagged,
          flagReason: user.isFlagged ? undefined : "Admin flagged",
        }),
      color: user.isFlagged ? "text-green-600" : "text-yellow-600",
    },
    {
      label: user.isAdmin ? "Remove Admin" : "Make Admin",
      action: () => onUpdate(user.id, { isAdmin: !user.isAdmin }),
      color: user.isAdmin ? "text-red-600" : "text-purple-600",
    },
  ];

  return (
    <div className="relative">
      <button
        title="User Actions"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
          <div className="py-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${action.color}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Path Category Management Component
export function PathCategoryManager() {
  const [categories, setCategories] = useState<PathCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PathCategory | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    parent_category_id: "",
    is_active: true,
    display_order: 1,
    is_testable: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await AdminAPIService.getPathCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        parent_category_id: formData.parent_category_id
          ? parseInt(formData.parent_category_id)
          : undefined,
      };

      if (editingCategory) {
        await AdminAPIService.updatePathCategory(editingCategory.id, data);
      } else {
        await AdminAPIService.createPathCategory(data);
      }

      fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await AdminAPIService.deletePathCategory(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      parent_category_id: "",
      is_active: true,
      display_order: 1,
      is_testable: true,
    });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const startEdit = (category: PathCategory) => {
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parent_category_id: category.parent_category_id?.toString() || "",
      is_active: category.is_active,
      display_order: category.display_order,
      is_testable: category.is_testable,
    });
    setEditingCategory(category);
    setShowAddForm(true);
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-300 h-64 rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Path Categories
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Icon (e.g., tech-icon)"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                title="Category Color"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Display Order"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value),
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                rows={3}
                required
              />
              <div className="flex items-center space-x-4 md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_testable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_testable: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Testable</span>
                </label>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingCategory ? "Update" : "Create"} Category
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Name
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Description
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Color
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900">
                  Order
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
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{category.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {category.description}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm">{category.color}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{category.display_order}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        title="Edit Category"
                        type="button"
                        onClick={() => startEdit(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete Category"
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
