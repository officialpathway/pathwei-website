// src/app/admin/page.tsx
"use client";

import AdminLayout from "@/admin/components/AdminLayout";
import DashboardOverview from "@/admin/components/DashboardOverview";

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard Overview">
      <DashboardOverview />
    </AdminLayout>
  );
}
