// src/app/admin/assets/page.tsx
"use client";

import { useSimpleAuth } from "@/hooks/use-simple-auth";
import AdminHeader from "@/components/admin/AdminHeader";
import AssetsManager from "@/components/admin/AssetsManager";

export default function AssetsPage() {
  const { user, loading } = useSimpleAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assets dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <AdminHeader title="Assets & Bills Management" />
      <main className="p-6">
        <AssetsManager />
      </main>
    </>
  );
}
