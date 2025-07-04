// src/components/admin/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import {
  BarChart3,
  Users,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Folder,
  Mail,
  Calendar,
} from "lucide-react";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
};

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/admin",
  },
  {
    id: "users",
    label: "User Management",
    icon: <Users className="w-5 h-5" />,
    href: "/admin/users",
  },
  {
    id: "bulk-email",
    label: "Bulk Email",
    icon: <Mail className="w-5 h-5" />,
    href: "/admin/bulk-email",
  },
  {
    id: "categories",
    label: "Path Categories",
    icon: <Folder className="w-5 h-5" />,
    href: "/admin/categories",
  },
  {
    id: "assets",
    label: "Assets & Bills",
    icon: <Calendar className="w-5 h-5" />,
    href: "/admin/assets",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/admin/settings",
  },
];

export default function AdminSidebar() {
  const { logout } = useSimpleAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      } fixed lg:relative z-30 h-[100vh] overflow-y-auto
  ${sidebarOpen ? "lg:translate-x-0" : "lg:translate-x-0"}
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-3 ${
              sidebarOpen ? "opacity-100" : "opacity-0 hidden"
            } transition-opacity`}
          >
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-700"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
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
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
                isActive
                  ? "bg-blue-50 border-r-2 border-blue-600 text-blue-600"
                  : "text-gray-700"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span
                className={`ml-3 ${
                  sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                } transition-opacity whitespace-nowrap`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <div className="flex-shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <span
            className={`ml-3 ${
              sidebarOpen ? "opacity-100" : "opacity-0 hidden"
            } transition-opacity whitespace-nowrap`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
