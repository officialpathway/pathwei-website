// src/admin/components/shared/StatusBadge.tsx
"use client";

import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Crown,
  User,
  RefreshCw,
} from "lucide-react";

type StatusType =
  | "active"
  | "inactive"
  | "suspended"
  | "deactivated"
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "sent"
  | "failed"
  | "sending"
  | "draft"
  | "premium"
  | "free"
  | "admin"
  | "user"
  | "moderator"
  | "paid"
  | "unpaid"
  | "overdue"
  | "cancelled"
  | "resolved"
  | "closed"
  | "flagged";

interface StatusBadgeProps {
  status: StatusType | string;
  variant?: "default" | "outline" | "solid";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  variant = "default",
  size = "md",
  showIcon = true,
  className = "",
}: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      {
        color: string;
        icon: React.ReactNode;
        label: string;
      }
    > = {
      // Account statuses
      active: {
        color: "green",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Active",
      },
      inactive: {
        color: "gray",
        icon: <XCircle className="w-3 h-3" />,
        label: "Inactive",
      },
      suspended: {
        color: "red",
        icon: <XCircle className="w-3 h-3" />,
        label: "Suspended",
      },
      deactivated: {
        color: "gray",
        icon: <XCircle className="w-3 h-3" />,
        label: "Deactivated",
      },

      // Process statuses
      pending: {
        color: "yellow",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      approved: {
        color: "green",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Approved",
      },
      rejected: {
        color: "red",
        icon: <XCircle className="w-3 h-3" />,
        label: "Rejected",
      },
      in_progress: {
        color: "blue",
        icon: <RefreshCw className="w-3 h-3" />,
        label: "In Progress",
      },

      // Email statuses
      sent: {
        color: "green",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Sent",
      },
      failed: {
        color: "red",
        icon: <XCircle className="w-3 h-3" />,
        label: "Failed",
      },
      sending: {
        color: "blue",
        icon: <RefreshCw className="w-3 h-3 animate-spin" />,
        label: "Sending",
      },
      draft: {
        color: "gray",
        icon: <Clock className="w-3 h-3" />,
        label: "Draft",
      },

      // User types
      premium: {
        color: "yellow",
        icon: <Crown className="w-3 h-3" />,
        label: "Premium",
      },
      free: {
        color: "gray",
        icon: <User className="w-3 h-3" />,
        label: "Free",
      },
      admin: {
        color: "purple",
        icon: <User className="w-3 h-3" />,
        label: "Admin",
      },
      user: {
        color: "blue",
        icon: <User className="w-3 h-3" />,
        label: "User",
      },
      moderator: {
        color: "indigo",
        icon: <User className="w-3 h-3" />,
        label: "Moderator",
      },

      // Payment statuses
      paid: {
        color: "green",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Paid",
      },
      unpaid: {
        color: "red",
        icon: <XCircle className="w-3 h-3" />,
        label: "Unpaid",
      },
      overdue: {
        color: "red",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Overdue",
      },
      cancelled: {
        color: "gray",
        icon: <XCircle className="w-3 h-3" />,
        label: "Cancelled",
      },

      // Feedback statuses
      resolved: {
        color: "green",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Resolved",
      },
      closed: {
        color: "gray",
        icon: <XCircle className="w-3 h-3" />,
        label: "Closed",
      },
      flagged: {
        color: "red",
        icon: <AlertTriangle className="w-3 h-3" />,
        label: "Flagged",
      },
    };

    return (
      configs[status.toLowerCase()] || {
        color: "gray",
        icon: <Clock className="w-3 h-3" />,
        label: status.charAt(0).toUpperCase() + status.slice(1),
      }
    );
  };

  const config = getStatusConfig(status);

  const colorClasses = {
    default: {
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      yellow: "bg-yellow-100 text-yellow-800",
      blue: "bg-blue-100 text-blue-800",
      gray: "bg-gray-100 text-gray-800",
      purple: "bg-purple-100 text-purple-800",
      indigo: "bg-indigo-100 text-indigo-800",
    },
    outline: {
      green: "border border-green-300 text-green-700 bg-transparent",
      red: "border border-red-300 text-red-700 bg-transparent",
      yellow: "border border-yellow-300 text-yellow-700 bg-transparent",
      blue: "border border-blue-300 text-blue-700 bg-transparent",
      gray: "border border-gray-300 text-gray-700 bg-transparent",
      purple: "border border-purple-300 text-purple-700 bg-transparent",
      indigo: "border border-indigo-300 text-indigo-700 bg-transparent",
    },
    solid: {
      green: "bg-green-600 text-white",
      red: "bg-red-600 text-white",
      yellow: "bg-yellow-600 text-white",
      blue: "bg-blue-600 text-white",
      gray: "bg-gray-600 text-white",
      purple: "bg-purple-600 text-white",
      indigo: "bg-indigo-600 text-white",
    },
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const baseClasses = "inline-flex items-center font-semibold rounded-full";
  const colorClass =
    colorClasses[variant][config.color as keyof typeof colorClasses.default];
  const sizeClass = sizeClasses[size];

  return (
    <span className={`${baseClasses} ${colorClass} ${sizeClass} ${className}`}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
}
