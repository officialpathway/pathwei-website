// admin/types/feedback.ts

export interface FeedbackUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
}

export interface Feedback {
  id: number;
  userId: number;
  type: FeedbackType;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  subject: string;
  description: string;
  adminResponse?: string;
  adminUserId?: number;
  createdAt: string;
  updatedAt: string;
  user?: FeedbackUser;
  admin?: FeedbackUser;
}

export type FeedbackType = 'bug' | 'feature' | 'general' | 'complaint';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

export interface FeedbackStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byType: {
    bug: number;
    feature: number;
    general: number;
    complaint: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  avgResolutionTime?: number; // in hours
  resolutionRate?: number; // percentage
}

export interface FeedbackTrend {
  date: string;
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
  closed: number;
}

export interface FeedbackFilters {
  page?: number;
  limit?: number;
  status?: FeedbackStatus | '';
  type?: FeedbackType | '';
  priority?: FeedbackPriority | '';
  userId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface FeedbackStatusUpdate {
  status: FeedbackStatus;
  adminResponse?: string;
}

export interface CreateFeedbackRequest {
  type: FeedbackType;
  priority: FeedbackPriority;
  subject: string;
  description: string;
}

export interface FeedbackAnalytics {
  stats: FeedbackStats;
  trends: FeedbackTrend[];
  topIssues: {
    subject: string;
    count: number;
    type: FeedbackType;
  }[];
  userSatisfaction?: {
    avgRating: number;
    totalResponses: number;
  };
}