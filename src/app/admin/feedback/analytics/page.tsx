// src/app/admin/feedback/analytics/page.tsx
"use client";

import AdminLayout from "@/admin/components/AdminLayout";
import FeedbackAnalytics from "@/admin/components/FeedbackAnalytics";

export default function AdminFeedbackAnalyticsPage() {
  return (
    <AdminLayout title="Feedback Analytics">
      <FeedbackAnalytics />
    </AdminLayout>
  );
}
