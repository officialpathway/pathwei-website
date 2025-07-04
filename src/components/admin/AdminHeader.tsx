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
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.email}
            </span>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
