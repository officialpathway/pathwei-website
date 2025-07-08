// src/admin/utils/constants.ts

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://mypathwayapp.com',
  ADMIN_SECRET: process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
  TIMEOUT: 30000,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Status Options
export const USER_STATUSES = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'suspended', label: 'Suspended', color: 'yellow' },
  { value: 'deactivated', label: 'Deactivated', color: 'red' },
  { value: 'pending_verification', label: 'Pending Verification', color: 'blue' },
] as const;

export const USER_ROLES = [
  { value: 'user', label: 'User', color: 'gray' },
  { value: 'premium', label: 'Premium', color: 'gold' },
  { value: 'moderator', label: 'Moderator', color: 'blue' },
  { value: 'admin', label: 'Admin', color: 'purple' },
] as const;

export const FEEDBACK_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'resolved', label: 'Resolved', color: 'green' },
  { value: 'closed', label: 'Closed', color: 'gray' },
  { value: 'archived', label: 'Archived', color: 'red' },
] as const;

export const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report', icon: '🐛', color: 'red' },
  { value: 'feature', label: 'Feature Request', icon: '✨', color: 'blue' },
  { value: 'general', label: 'General', icon: '💬', color: 'gray' },
  { value: 'complaint', label: 'Complaint', icon: '😠', color: 'orange' },
  { value: 'suggestion', label: 'Suggestion', icon: '💡', color: 'green' },
  { value: 'praise', label: 'Praise', icon: '👏', color: 'purple' },
] as const;

export const FEEDBACK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
] as const;

export const ASSET_TYPES = [
  { value: 'software', label: 'Software', icon: '💻' },
  { value: 'hardware', label: 'Hardware', icon: '🖥️' },
  { value: 'service', label: 'Service', icon: '🔧' },
  { value: 'subscription', label: 'Subscription', icon: '📅' },
  { value: 'domain', label: 'Domain', icon: '🌐' },
  { value: 'ssl_certificate', label: 'SSL Certificate', icon: '🔒' },
  { value: 'hosting', label: 'Hosting', icon: '☁️' },
  { value: 'saas', label: 'SaaS', icon: '🚀' },
  { value: 'other', label: 'Other', icon: '📦' },
] as const;

export const ASSET_STATUSES = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'expired', label: 'Expired', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'orange' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
] as const;

export const BILL_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'overdue', label: 'Overdue', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
  { value: 'partial', label: 'Partial', color: 'orange' },
] as const;

export const RECURRING_PERIODS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'one-time', label: 'One-time' },
] as const;

export const EMAIL_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'scheduled', label: 'Scheduled', color: 'blue' },
  { value: 'sending', label: 'Sending', color: 'yellow' },
  { value: 'sent', label: 'Sent', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'orange' },
] as const;

export const RECIPIENT_TYPES = [
  { value: 'all', label: 'All Subscribers' },
  { value: 'active', label: 'Active Subscribers' },
  { value: 'premium', label: 'Premium Users' },
  { value: 'custom', label: 'Custom List' },
] as const;

// Pagination
export const PAGINATION_SIZES = [10, 20, 50, 100] as const;