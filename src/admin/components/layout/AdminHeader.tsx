// src/components/admin/AdminHeader.tsx
"use client";

import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { Shield } from "lucide-react";

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const { user } = useSimpleAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 max-h-16 mb-4">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Admin</div>
                <div className="text-sm text-gray-500">
                  {user?.email || "admin@pathway.com"}
                </div>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
