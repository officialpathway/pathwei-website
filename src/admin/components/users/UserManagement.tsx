// src/admin/components/users/UserManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Users, Crown, UserCheck, UserX, Search } from "lucide-react";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";
import { AdminAPIClient } from "@/admin/services/AdminAPIClient";
import { User } from "@/admin/types";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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
      const [, usersData] = (await Promise.all([
        AdminAPIClient.getUserStats(),
        AdminAPIClient.getUsers(filters),
      ])) as [
        unknown,
        {
          users: User[];
          pagination: typeof pagination;
          summary: typeof summary;
        }
      ];

      setUsers(usersData.users);
      setPagination(usersData.pagination);
      setSummary(usersData.summary);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = (userId: number, updates: Partial<User>) => {
    AdminAPIClient.updateUser(userId, updates)
      .then(() => {
        fetchData(); // Refresh data
      })
      .catch((error) => {
        console.error("Failed to update user:", error);
        alert("Failed to update user");
      });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleCloseForm = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleFormSuccess = () => {
    fetchData();
    handleCloseForm();
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
      <UserTable
        users={users}
        pagination={pagination}
        onUserUpdate={handleUserUpdate}
        onPageChange={handlePageChange}
        onEditUser={handleEditUser}
      />

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
