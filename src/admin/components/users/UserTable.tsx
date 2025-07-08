// src/admin/components/users/UserTable.tsx
"use client";

import { useState } from "react";
import { Crown, Settings, Edit } from "lucide-react";
import { DataTable, StatusBadge, type Column } from "../shared";
import { User } from "@/admin/types";

interface UserTableProps {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onUserUpdate: (userId: number, updates: Partial<User>) => void;
  onPageChange: (page: number) => void;
  onEditUser: (user: User) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function UserTable({
  users,
  pagination,
  onUserUpdate,
  onPageChange,
  onEditUser,
  searchValue = "",
  onSearchChange,
}: UserTableProps) {
  const columns: Column<User>[] = [
    {
      key: "user",
      header: "User",
      render: (user) => (
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
            <div className="text-sm font-medium text-gray-900">
              {user.firstName || user.username}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => (
        <div className="space-y-1">
          <StatusBadge status={user.accountStatus} />
          {user.isFlagged && <StatusBadge status="flagged" size="sm" />}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (user) => (
        <div className="flex items-center">
          {user.isPremium && <Crown className="w-4 h-4 text-yellow-500 mr-1" />}
          <span className="text-sm text-gray-900">
            {user.isPremium ? "Premium" : "Free"}
          </span>
        </div>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      render: (user) => (
        <div className="text-sm text-gray-900">
          <div>Enrolled: {user.enrolledPathsCount}</div>
          <div>Completed: {user.completedPathsCount}</div>
          <div>Streak: {user.dailyStreak} days</div>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (user) => (
        <span className="text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const renderActions = (user: User) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onEditUser(user)}
        className="text-blue-600 hover:text-blue-800"
        title="Edit User"
      >
        <Edit className="w-4 h-4" />
      </button>
      <UserActionDropdown user={user} onUpdate={onUserUpdate} />
    </div>
  );

  return (
    <DataTable
      data={users}
      columns={columns}
      actions={renderActions}
      pagination={pagination}
      onPageChange={onPageChange}
      searchable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search users..."
      emptyMessage="No users found"
      className="overflow-hidden"
    />
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
