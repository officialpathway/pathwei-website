// src/admin/components/users/UserForm.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { UserFormProps, UserFormData } from "@/admin/types";

export function UserForm({ user, onClose, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    role: user?.role || "user",
    accountStatus: user?.accountStatus || "active",
    isPremium: user?.isPremium || false,
    isAdmin: user?.isAdmin || false,
    isFlagged: user?.isFlagged || false,
    flagReason: user?.flagReason || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = user
        ? `${
            process.env.NEXT_PUBLIC_APP_URL || "https://mypathwayapp.com"
          }/api/v1/admin/users/${user.id}`
        : `${
            process.env.NEXT_PUBLIC_APP_URL || "https://mypathwayapp.com"
          }/api/v1/admin/users`;

      const method = user ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Dashboard-Secret":
            process.env.NEXT_PUBLIC_ADMIN_SECRET || "",
        },
        body: JSON.stringify({
          ...formData,
          flagReason: formData.isFlagged ? formData.flagReason : undefined,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save user");
      }
    } catch (error) {
      console.error("Failed to save user:", error);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {user ? "Edit User" : "Add New User"}
          </h3>
          <button
            title="Close form"
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>

          {/* Role and Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              title="Select user role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Status
            </label>
            <select
              title="Select account status"
              value={formData.accountStatus}
              onChange={(e) =>
                handleInputChange(
                  "accountStatus",
                  e.target.value as "active" | "suspended" | "deactivated"
                )
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>

          {/* User Permissions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Permissions</h4>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPremium"
                checked={formData.isPremium}
                onChange={(e) =>
                  handleInputChange("isPremium", e.target.checked)
                }
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPremium" className="text-sm text-gray-700">
                Premium Account
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={formData.isAdmin}
                onChange={(e) => handleInputChange("isAdmin", e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="text-sm text-gray-700">
                Admin Privileges
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFlagged"
                checked={formData.isFlagged}
                onChange={(e) =>
                  handleInputChange("isFlagged", e.target.checked)
                }
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isFlagged" className="text-sm text-gray-700">
                Flag User
              </label>
            </div>
          </div>

          {/* Flag Reason */}
          {formData.isFlagged && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flag Reason
              </label>
              <textarea
                value={formData.flagReason}
                onChange={(e) =>
                  handleInputChange("flagReason", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter reason for flagging this user..."
              />
            </div>
          )}

          {/* User Statistics (Read-only for existing users) */}
          {user && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                User Statistics
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Enrolled Paths:</span>
                  <span className="ml-2 font-medium">
                    {user.enrolledPathsCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Completed Paths:</span>
                  <span className="ml-2 font-medium">
                    {user.completedPathsCount}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Daily Streak:</span>
                  <span className="ml-2 font-medium">
                    {user.dailyStreak} days
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Joined:</span>
                  <span className="ml-2 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.lastLoginAt && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="ml-2 font-medium">
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving..." : user ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
