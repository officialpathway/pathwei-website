// src/components/admin/AdminHeader.tsx
"use client";
import { Menu, Shield } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  onMenuToggle?: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky max-h-16 top-0">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu + Title */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 relative z-50 touch-manipulation"
              title="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title - responsive */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Right side - Just logo for mobile, simplified */}
          <div className="flex items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
