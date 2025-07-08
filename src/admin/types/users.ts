// src/admin/types/users.ts

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  accountStatus: UserAccountStatus;
  isPremium: boolean;
  createdAt: string;
  lastLoginAt?: string;
  enrolledPathsCount: number;
  completedPathsCount: number;
  dailyStreak: number;
  isFlagged: boolean;
  flagReason?: string;
  isAdmin: boolean;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location?: string;
}

export type UserRole = 'user' | 'premium' | 'admin' | 'moderator';
export type UserAccountStatus = 'active' | 'suspended' | 'deactivated';

export interface UserStats {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  deactivatedUsers: number;
  flaggedUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  status?: UserAccountStatus | '';
  role?: UserRole | '';
  accountType?: 'free' | 'premium' | '';
  search?: string;
  isFlagged?: boolean;
  lastLoginAfter?: string;
  lastLoginBefore?: string;
}

export interface UserSummary {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  deactivatedUsers: number;
  premiumUsers: number;
  flaggedUsers: number;
}

export interface UserFormProps {
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  role: string;
  accountStatus: "active" | "suspended" | "deactivated";
  isPremium: boolean;
  isAdmin: boolean;
  isFlagged: boolean;
  flagReason: string;
}