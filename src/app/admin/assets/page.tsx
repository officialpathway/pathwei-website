// src/app/admin/assets/page.tsx
"use client";

import AdminLayout from "@/admin/components/AdminLayout";
import AssetsManager from "@/admin/components/AssetsManager";

export default function AssetsPage() {
  return (
    <AdminLayout title="Asset Management">
      <AssetsManager />
    </AdminLayout>
  );
}
