// src/app/admin/guides/page.tsx
"use client";

import AdminLayout from "@/admin/components/layout/AdminLayout";
import {
  FileText,
  GitBranch,
  Heart,
  Bell,
  Mail,
  Book,
  Database,
  Lock,
  DollarSign,
  MessageSquare,
  Activity,
  TrendingUp,
  Repeat,
  Settings,
  Cpu,
  Logs,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Guide metadata with icons
const guideConfig = {
  "logging-architecture-system": {
    icon: Logs,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    title: "Entire Project Logging Architecture",
  },
  "admin-activity-logging": {
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    title: "Admin Activity Logging",
  },
  "ai-services": {
    icon: Cpu,
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    borderColor: "border-fuchsia-200",
    title: "AI Services",
  },
  analytics: {
    icon: Database,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    title: "Analytics",
  },
  authentication: {
    icon: Lock,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    title: "Authentication",
  },
  billing: {
    icon: DollarSign,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    title: "Billing",
  },
  email: {
    icon: Mail,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    title: "Email System",
  },
  feedback: {
    icon: MessageSquare,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    title: "Feedback",
  },
  gamification: {
    icon: GitBranch,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    title: "Gamification",
  },
  "learning-content": {
    icon: Book,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    title: "Learning Content",
  },
  notifications: {
    icon: Bell,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    title: "Notifications",
  },
  "progress-tracking": {
    icon: TrendingUp,
    color: "text-lime-600",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
    title: "Progress Tracking",
  },
  routines: {
    icon: Repeat,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    title: "Routines",
  },
  social: {
    icon: Heart,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    title: "Social Features",
  },
  system: {
    icon: Settings,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    title: "System",
  },
  "user-management": {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    title: "User Management",
  },
};

import { LucideIcon } from "lucide-react";

interface Guide {
  slug: string;
  title: string;
  description: string;
  lastUpdated?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use static data. In production, you'd fetch from an API
    // that reads the actual files from src/content/guides/
    const staticGuides = Object.entries(guideConfig).map(([slug, config]) => ({
      slug,
      description: getGuideDescription(slug),
      lastUpdated: "2025-01-15",
      ...config,
    }));

    setGuides(staticGuides);
    setLoading(false);
  }, []);

  function getGuideDescription(slug: string): string {
    const descriptions = {
      "admin-activity-logging":
        "Track and audit admin actions for transparency and security",
      "ai-services":
        "Integrations with AI models, smart recommendations, and automation",
      analytics:
        "User analytics, tracking, reporting, and business intelligence",
      authentication:
        "Login, registration, password recovery, and identity verification",
      billing: "Subscription plans, payment processing, and invoicing",
      email: "Email templates, delivery system, and bulk email management",
      feedback: "User feedback collection, ratings, and sentiment analysis",
      gamification:
        "Points system, achievements, streaks, and user engagement features",
      "learning-content":
        "Paths, milestones, content management, and learning progression",
      notifications:
        "Push notifications, email alerts, and notification delivery system",
      "progress-tracking":
        "Monitor user progress, completion rates, and goal tracking",
      routines:
        "Recurring tasks, habit formation, and daily activity scheduling",
      social:
        "User interactions, following, social feeds, and community features",
      system: "Platform configuration, environment settings, and system health",
      "user-management":
        "User profiles, preferences, device management, and admin operations",
    };

    return (
      descriptions[slug as keyof typeof descriptions] ||
      "Domain documentation for developers"
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Backend Development Guides">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Backend Development Guides">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Backend Development Guides
              </h1>
              <p className="text-gray-600">
                Domain architecture and development documentation
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Book className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  For Junior Developers
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  These guides explain the domain-driven architecture of our
                  backend. Each domain handles specific business logic and
                  responsibilities.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        {guides.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Guides Available
              </h3>
              <p className="text-gray-500 text-sm">
                Add your markdown files to{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                  src/content/guides/
                </code>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {guides.map((guide) => {
              const IconComponent = guide.icon;

              return (
                <Link
                  key={guide.slug}
                  href={`/admin/guides/${guide.slug}`}
                  className="block group"
                >
                  <div
                    className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 ${guide.borderColor}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${guide.bgColor} border ${guide.borderColor}`}
                      >
                        <IconComponent className={`h-6 w-6 ${guide.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {guide.description}
                        </p>
                        {guide.lastUpdated && (
                          <p className="text-xs text-gray-400 mt-2">
                            Updated: {guide.lastUpdated}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
