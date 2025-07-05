// src/app/admin/bulk-email/page.tsx
"use client";

import AdminLayout from "@/admin/components/AdminLayout";
import { BulkEmailManager } from "@/admin/components/BulkEmailManager";

export default function AdminBulkEmailPage() {
  return (
    <AdminLayout title="Bulk Email Management">
      <BulkEmailManager />
    </AdminLayout>
  );
}
