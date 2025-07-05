// src/app/admin/users/page.tsx
"use client";

import AdminLayout from "@/admin/components/AdminLayout";
import UserManagement from "@/admin/components/UserManagement";

export default function AdminUsersPage() {
  return (
    <AdminLayout title="User Management">
      <UserManagement />
    </AdminLayout>
  );
}
