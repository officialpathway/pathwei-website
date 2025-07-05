// src/app/admin/categories/page.tsx
"use client";

import AdminLayout from "@/admin/components/AdminLayout";
import CategoryManagement from "@/admin/components/CategoryManagement";

export default function AdminCategoriesPage() {
  return (
    <AdminLayout title="Path Categories">
      <CategoryManagement />
    </AdminLayout>
  );
}
