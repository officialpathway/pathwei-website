// src/admin/types/api.ts

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
  summary?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
  summary?: Record<string, unknown>;
}

// Newsletter & Email Types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export interface BulkEmail {
  id: string;
  subject: string;
  sentTo: number;
  status: string;
  sentAt: string;
  createdBy: string;
}

export interface BulkEmailStats {
  totalEmails: number;
  sentToday: number;
  sentThisWeek: number;
  sentThisMonth: number;
  failureRate: number;
}

export interface RecipientCounts {
  all: number;
  premium: number;
  active: number;
  inactive: number;
}

export interface BulkEmailHistory {
  id: number;
  subject: string;
  recipientCount: number;
  status: "pending" | "sending" | "sent" | "failed";
  successCount?: number;
  failedCount?: number;
  sentAt: string;
  createdBy: string;
  createdAt: string;
}

export interface EmailFormData {
  subject: string;
  htmlContent: string;
  textContent: string;
  recipients: "all" | "premium" | "active" | "custom";
  customEmails: string;
  tags: string;
}

// Category Management
export interface PathCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent_category_id?: number;
  is_active: boolean;
  display_order: number;
  is_testable: boolean;
  created_at: string;
  updated_at: string;
}