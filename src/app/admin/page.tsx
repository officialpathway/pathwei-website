// src/app/admin/page.tsx
"use client";

import AdminLayout from "@/admin/components/layout/AdminLayout";
import DashboardOverview from "@/admin/components/dashboard/DashboardOverview";

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard Overview">
      <DashboardOverview />
    </AdminLayout>
  );
}
