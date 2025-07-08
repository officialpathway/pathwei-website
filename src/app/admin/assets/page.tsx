// src/app/admin/assets/page.tsx
"use client";

import AdminLayout from "@/admin/components/layout/AdminLayout";
import AssetsManager from "@/admin/components/assets/AssetsManager";

export default function AssetsPage() {
  return (
    <AdminLayout title="Asset Management">
      <AssetsManager />
    </AdminLayout>
  );
}
