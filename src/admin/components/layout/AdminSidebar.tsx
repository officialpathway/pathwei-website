// src/components/admin/AdminSidebar.tsx
"use client";

import { useState, useEffect } from "react";
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
  MessageSquare,
  PieChart,
  Book,
} from "lucide-react";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
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
    id: "categories",
    label: "Path Categories",
    icon: <Folder className="w-5 h-5" />,
    href: "/admin/categories",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/admin/feedback",
    badge: "New",
  },
  {
    id: "feedback-analytics",
    label: "Feedback Analytics",
    icon: <PieChart className="w-5 h-5" />,
    href: "/admin/feedback/analytics",
  },
  {
    id: "bulk-email",
    label: "Bulk Email",
    icon: <Mail className="w-5 h-5" />,
    href: "/admin/bulk-email",
  },
  {
    id: "assets",
    label: "Assets & Bills",
    icon: <Calendar className="w-5 h-5" />,
    href: "/admin/assets",
  },
  {
    id: "dev-guides",
    label: "Dev Guides",
    icon: <Book className="w-5 h-5" />,
    href: "/admin/guides",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/admin/settings",
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { logout } = useSimpleAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleDesktopSidebar = () => {
    setDesktopOpen(!desktopOpen);
  };

  const sidebarOpen = isMobile ? isOpen : desktopOpen;

  return (
    <>
      <div
        className={`bg-white shadow-lg transition-all duration-300 h-[100vh] overflow-y-auto flex flex-col
        ${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 ${
                isOpen ? "w-full translate-x-0" : "w-full -translate-x-full"
              }`
            : `lg:relative z-10 ${desktopOpen ? "w-64" : "w-16"}`
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
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

            {/* Close button for mobile */}
            {isMobile && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-700"
                title="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Toggle button for desktop */}
            {!isMobile && (
              <button
                onClick={toggleDesktopSidebar}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-700"
                title={desktopOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {desktopOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={isMobile ? onClose : undefined}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <div
                      className={`flex-shrink-0 ${
                        isActive
                          ? "text-blue-700"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`ml-3 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                      } transition-opacity whitespace-nowrap flex-1`}
                    >
                      {item.label}
                    </span>
                    {item.badge && sidebarOpen && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-left hover:bg-red-50 text-red-600 rounded-lg transition-colors text-sm font-medium"
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

        {/* Version info */}
        {sidebarOpen && (
          <div className="p-4 pt-0">
            <div className="text-xs text-gray-500 text-center">
              Admin Panel v1.0.0
            </div>
          </div>
        )}
      </div>
    </>
  );
}
