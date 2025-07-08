// src/app/admin/bulk-email/page.tsx
"use client";

import AdminLayout from "@/admin/components/layout/AdminLayout";
import { BulkEmailManager } from "@/admin/components/email/BulkEmailManager";

export default function AdminBulkEmailPage() {
  return (
    <AdminLayout title="Bulk Email Management">
      <BulkEmailManager />
    </AdminLayout>
  );
}
