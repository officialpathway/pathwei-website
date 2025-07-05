// src/app/admin/feedback/page.tsx
"use client";

import AdminLayout from "@/admin/components/AdminLayout";
import FeedbackManagement from "@/admin/components/FeedbackManagement";

export default function AdminFeedbackPage() {
  return (
    <AdminLayout title="Feedback Management">
      <FeedbackManagement />
    </AdminLayout>
  );
}
