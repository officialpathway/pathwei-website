// src/app/admin/feedback/analytics/page.tsx
"use client";

import AdminLayout from "@/admin/components/layout/AdminLayout";
import FeedbackAnalytics from "@/admin/components/feedback/FeedbackAnalytics";

export default function AdminFeedbackAnalyticsPage() {
  return (
    <AdminLayout title="Feedback Analytics">
      <FeedbackAnalytics />
    </AdminLayout>
  );
}
