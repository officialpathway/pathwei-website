/* eslint-disable @typescript-eslint/no-explicit-any */
// src/admin/services/AdminAPIClient.ts

/**
 * Centralized Admin API Client
 * Consolidates all admin API functionality from UserManagement, FeedbackManagement and
 * BulkEmailManager
 */

// Configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://mypathwayapp.com',
  ADMIN_SECRET: process.env.NEXT_PUBLIC_ADMIN_SECRET || 'PathwegAdmin2025!',
  TIMEOUT: 30000,
} as const;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export class AdminAPIClient {
  private static baseURL = `${API_CONFIG.BASE_URL}/api/v1`;

  /**
   * Generic request method with error handling and standardized headers
   */
  private static async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = 'GET', body, headers = {}, timeout = API_CONFIG.TIMEOUT } = options;

    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Dashboard-Secret': API_CONFIG.ADMIN_SECRET,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.data || data; // Handle both wrapped and unwrapped responses
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Get user statistics
   */
  static async getUserStats() {
    return this.request('/admin/users/stats');
  }

  /**
   * Get users with filtering and pagination
   */
  static async getUsers(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    role?: string;
    accountType?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';

    return this.request(endpoint);
  }

  /**
   * Update user
   */
  static async updateUser(userId: number, updates: any) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: number) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Create user
   */
  static async createUser(userData: any) {
    return this.request('/admin/users', {
      method: 'POST',
      body: userData,
    });
  }

  // ==================== FEEDBACK MANAGEMENT ====================

  /**
   * Get all feedback with filtering
   */
  static async getAllFeedback(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    priority?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/feedback/admin?${queryString}` : '/feedback/admin';

    return this.request(endpoint);
  }

  /**
   * Get feedback by ID
   */
  static async getFeedbackById(feedbackId: string | number) {
    return this.request(`/feedback/admin/${feedbackId}`);
  }

  /**
   * Get feedback statistics
   */
  static async getFeedbackStats() {
    return this.request('/feedback/analytics/stats');
  }

  /**
   * Get feedback trends
   */
  static async getFeedbackTrends(
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) {
    const params = new URLSearchParams({
      startDate,
      endDate,
      groupBy,
    });

    return this.request(`/feedback/analytics/trends?${params}`);
  }

  /**
   * Update feedback status and response
   */
  static async updateFeedbackStatus(
    feedbackId: string | number,
    updates: {
      status?: string;
      adminResponse?: string;
      priority?: string;
    }
  ) {
    return this.request(`/feedback/admin/${feedbackId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  /**
   * Delete feedback
   */
  static async deleteFeedback(feedbackId: string | number) {
    return this.request(`/feedback/admin/${feedbackId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get feedback analytics
   */
  static async getFeedbackAnalytics(dateRange?: { start: string; end: string }) {
    const params = dateRange
      ? new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end
      })
      : '';

    const endpoint = params ? `/feedback/admin/analytics?${params}` : '/feedback/admin/analytics';
    return this.request(endpoint);
  }

  // ==================== BULK EMAIL MANAGEMENT ====================

  /**
   * Get bulk email statistics
   */
  static async getBulkEmailStats() {
    return this.request('/email/bulk-email/stats');
  }

  /**
   * Get recipient counts
   */
  static async getRecipientCounts() {
    return this.request('/email/bulk-email/recipients/counts');
  }

  /**
   * Send bulk email
   */
  static async sendBulkEmail(emailData: {
    subject: string;
    htmlContent: string;
    textContent?: string;
    recipients: string;
    customEmails?: string;
    tags?: string;
    scheduledAt?: string;
    fromName?: string;
    fromEmail?: string;
    replyTo?: string;
  }) {
    return this.request('/email/bulk-email/send', {
      method: 'POST',
      body: emailData,
    });
  }

  /**
   * Get bulk email history
   */
  static async getBulkEmailHistory(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `/email/bulk-email/history?${queryString}`
      : '/email/bulk-email/history';

    return this.request(endpoint);
  }

  /**
   * Cancel scheduled email
   */
  static async cancelBulkEmail(emailId: string | number) {
    return this.request(`/email/bulk-email/${emailId}/cancel`, {
      method: 'POST',
    });
  }

  // ==================== NEWSLETTER MANAGEMENT ====================

  /**
   * Get newsletter subscribers
   */
  static async getNewsletterSubscribers(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `/admin/newsletter/subscribers?${queryString}`
      : '/admin/newsletter/subscribers';

    return this.request(endpoint);
  }

  /**
   * Delete newsletter subscriber
   */
  static async deleteNewsletterSubscriber(email: string) {
    return this.request('/admin/newsletter/subscribers', {
      method: 'DELETE',
      body: { email },
    });
  }

  /**
   * Send newsletter
   */
  static async sendNewsletter(newsletterData: {
    subject: string;
    content: string;
    htmlContent?: string;
  }) {
    return this.request('/admin/newsletter/send', {
      method: 'POST',
      body: newsletterData,
    });
  }

  /**
   * Get newsletter history
   */
  static async getNewsletterHistory() {
    return this.request('/admin/newsletter/history');
  }

  // ==================== CATEGORY MANAGEMENT ====================

  /**
   * Get all categories
   */
  static async getCategories() {
    try {
      const response = await this.request('/admin/categories') as any;
      console.log(response);
      // Ensure we return an array, handle different response structures
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.categories)) {
        return response.categories;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('Unexpected categories response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error; // Let the component handle the error
    }
  }

  /**
   * Create category
   */
  static async createPathCategory(categoryData: {
    name: string;
    description: string;
    icon: string;
    color: string;
    parent_category_id?: number;
    is_active?: boolean;
    display_order?: number;
    is_testable?: boolean;
  }) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: categoryData,
    });
  }

  /**
   * Update category
   */
  static async updatePathCategory(categoryId: number, updates: any) {
    return this.request(`/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  /**
   * Delete category
   */
  static async deletePathCategory(categoryId: number) {
    return this.request(`/admin/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // ==================== DASHBOARD & STATS ====================

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  /**
   * Get system metrics
   */
  static async getSystemMetrics() {
    return this.request('/admin/system/metrics');
  }

  // ==================== ASSETS & BILLS ====================

  /**
   * Get assets
   */
  static async getAssets(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/assets?${queryString}` : '/admin/assets';

    return this.request(endpoint);
  }

  /**
   * Create asset
   */
  static async createAsset(assetData: any) {
    return this.request('/admin/assets', {
      method: 'POST',
      body: assetData,
    });
  }

  /**
   * Update asset
   */
  static async updateAsset(assetId: string, updates: any) {
    return this.request(`/admin/assets/${assetId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  /**
   * Delete asset
   */
  static async deleteAsset(assetId: string) {
    return this.request(`/admin/assets/${assetId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get bills
   */
  static async getBills(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    assetId?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/admin/bills?${queryString}` : '/admin/bills';

    return this.request(endpoint);
  }

  /**
   * Create bill
   */
  static async createBill(billData: any) {
    return this.request('/admin/bills', {
      method: 'POST',
      body: billData,
    });
  }

  /**
   * Update bill
   */
  static async updateBill(billId: string, updates: any) {
    return this.request(`/admin/bills/${billId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  /**
   * Delete bill
   */
  static async deleteBill(billId: string) {
    return this.request(`/admin/bills/${billId}`, {
      method: 'DELETE',
    });
  }

  // ==================== SETTINGS ====================

  /**
   * Get admin settings
   */
  static async getAdminSettings() {
    return this.request('/admin/settings');
  }

  /**
   * Update admin settings
   */
  static async updateAdminSettings(settings: any) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: settings,
    });
  }
}