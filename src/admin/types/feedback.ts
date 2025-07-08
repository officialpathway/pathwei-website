// src/admin/types/feedback.ts
import { User } from './users';

export interface AdminUser {
  id: string | number;
  username: string;
}

export interface Feedback {
  id: string | number;
  userId?: string;
  user?: User; // Add nested user object
  type: FeedbackType;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  subject: string;
  message: string;
  adminResponse?: string;
  adminResponseAt?: string;
  adminRespondedBy?: string;
  adminUser?: AdminUser; // Add nested admin user object
  createdAt: string;
  updatedAt: string;
  userAgent?: string;
  ipAddress?: string;
  pageUrl?: string;
  rating?: number;
  // Keep legacy fields for backward compatibility if needed
  userEmail?: string;
  userName?: string;
}

export type FeedbackType = 'bug' | 'feature' | 'general' | 'complaint' | 'suggestion' | 'praise';
export type FeedbackStatus = 'pending' | 'in_progress' | 'resolved' | 'closed' | 'archived';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export interface FeedbackStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  averageResponseTime: number;
  averageRating: number;
  byType: Record<FeedbackType, number>;
  byPriority: Record<FeedbackPriority, number>;
}

export interface FeedbackTrends {
  date: string;
  count: number;
  resolved: number;
  avgRating: number;
}

export interface FeedbackFilters {
  page?: number;
  limit?: number;
  status?: FeedbackStatus | '';
  type?: FeedbackType | '';
  priority?: FeedbackPriority | '';
  search?: string;
  startDate?: string;
  endDate?: string;
}