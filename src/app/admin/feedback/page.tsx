// src/app/admin/feedback/page.tsx
"use client";

import AdminLayout from "@/admin/components/layout/AdminLayout";
import FeedbackManagement from "@/admin/components/feedback/FeedbackManagement";

export default function AdminFeedbackPage() {
  return (
    <AdminLayout title="Feedback Management">
      <FeedbackManagement />
    </AdminLayout>
  );
}
