// src/app/admin/settings/page.tsx
"use client";

import { useSimpleAuth } from "@/hooks/use-simple-auth";
import AdminHeader from "@/admin/components/AdminHeader";
import AdminSettings from "@/admin/components/AdminSettings";

export default function AdminSettingsPage() {
  const { user, loading } = useSimpleAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <AdminHeader title="Admin Settings" />
      <main className="p-6">
        <AdminSettings />
      </main>
    </>
  );
}
