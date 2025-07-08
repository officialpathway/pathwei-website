// src/app/admin/users/page.tsx
"use client";

import AdminLayout from "@/admin/components/layout/AdminLayout";
import UserManagement from "@/admin/components/users/UserManagement";

export default function AdminUsersPage() {
  return (
    <AdminLayout title="User Management">
      <UserManagement />
    </AdminLayout>
  );
}
