/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/AdminAPIService.ts
"use client";

/**
 * Centralized API service for all admin operations
 * Handles authentication, error handling, and response formatting
 */

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  role: string;
  accountStatus: "active" | "suspended" | "deactivated";
  isPremium: boolean;
  createdAt: string;
  lastLoginAt?: string;
  enrolledPathsCount: number;
  completedPathsCount: number;
  dailyStreak: number;
  isFlagged: boolean;
  flagReason?: string;
  isAdmin: boolean;
}

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

export interface Feedback {
  id: number;
  userId: number;
  type: 'bug' | 'feature' | 'general' | 'complaint';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  adminResponse?: string;
  adminUserId?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName: string;
  };
}

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
}

export interface FeedbackTrends {
  date: string;
  total: number;
  resolved: number;
  pending: number;
}

export interface UserStats {
  totalUsers: number;
  premiumUsers: number;
}

export interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  categoriesCount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ApiFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  priority?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  role?: string;
  accountType?: string;
}

/**
 * Centralized Admin API Service
 * Provides methods for all admin operations with consistent error handling
 */
export class AdminAPIService {
  private static readonly baseURL = `${process.env.NEXT_PUBLIC_APP_URL || "https://mypathwayapp.com"
    }/api/v1`;

  private static readonly adminSecret =
    process.env.NEXT_PUBLIC_ADMIN_SECRET || "PathwegAdmin2025!";

  /**
   * Make authenticated API request
   */
  private static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Dashboard-Secret": this.adminSecret,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`[API Request] ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API Error] ${response.status}: ${errorText}`);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[API Response] Success:`, data);

      return data;
    } catch (error) {
      console.error(`[API Error] Request failed:`, error);
      throw error;
    }
  }

  // ===== USER MANAGEMENT =====
  static async getUserStats(): Promise<UserStats> {
    const response = await this.request<UserStats>("/admin/users/stats");
    return response.data!;
  }

  static async getUsers(filters: ApiFilters = {}): Promise<{
    users: User[];
    pagination: ApiResponse['pagination'];
    summary: any;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request(endpoint);
    return response.data!;
  }

  static async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    const response = await this.request<User>(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return response.data!;
  }

  static async deleteUser(userId: number): Promise<void> {
    await this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  // ===== CATEGORY MANAGEMENT =====
  static async getPathCategories(): Promise<PathCategory[]> {
    const response = await this.request("/admin/categories");
    return response.data!.categories;
  }

  static async createPathCategory(categoryData: {
    name: string;
    description: string;
    icon: string;
    color: string;
    parent_category_id?: number;
    is_active?: boolean;
    display_order?: number;
    is_testable?: boolean;
  }): Promise<PathCategory> {
    const response = await this.request<PathCategory>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response.data!.category;
  }

  static async updatePathCategory(
    categoryId: number,
    updates: Partial<PathCategory>
  ): Promise<PathCategory> {
    const response = await this.request<PathCategory>(`/admin/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return response.data!.category;
  }

  static async deletePathCategory(categoryId: number): Promise<void> {
    await this.request(`/admin/categories/${categoryId}`, {
      method: "DELETE",
    });
  }

  // ===== FEEDBACK MANAGEMENT =====
  static async getAllFeedback(filters: ApiFilters = {}): Promise<{
    feedback: Feedback[];
    pagination: ApiResponse['pagination'];
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/feedback/admin${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request(endpoint);
    return response.data!;
  }

  static async getFeedbackById(feedbackId: number): Promise<Feedback> {
    const response = await this.request<Feedback>(`/feedback/admin/${feedbackId}`);
    return response.data!;
  }

  static async updateFeedbackStatus(
    feedbackId: number,
    statusData: {
      status: string;
      adminResponse?: string;
    }
  ): Promise<Feedback> {
    const response = await this.request<Feedback>(`/feedback/admin/${feedbackId}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    });
    return response.data!;
  }

  // ===== FEEDBACK ANALYTICS =====
  static async getFeedbackStats(): Promise<FeedbackStats> {
    const response = await this.request<FeedbackStats>("/feedback/analytics/stats");
    return response.data!;
  }

  static async getFeedbackTrends(
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<FeedbackTrends[]> {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      groupBy,
    });

    const response = await this.request<FeedbackTrends[]>(
      `/feedback/analytics/trends?${queryParams}`
    );
    return response.data!;
  }

  // ===== DASHBOARD STATS =====
  static async getDashboardStats(): Promise<DashboardStats> {
    const [userStatsResponse, categoriesResponse] = await Promise.all([
      this.request("/admin/users/stats"),
      this.request("/admin/categories"),
    ]);

    return {
      totalUsers: userStatsResponse.data!.totalUsers,
      premiumUsers: userStatsResponse.data!.premiumUsers,
      activeUsers: Math.floor(userStatsResponse.data!.totalUsers * 0.7), // Placeholder calculation
      categoriesCount: categoriesResponse.data!.categories.length,
    };
  }
}