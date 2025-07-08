// src/admin/types/assets.ts

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  provider?: string;
  cost: number;
  currency: string;
  purchaseDate: string;
  expiryDate?: string;
  status: AssetStatus;
  autoRenew: boolean;
  recurringPeriod?: RecurringPeriod;
  notes?: string;
  bills: Bill[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Bill {
  id: string;
  assetId?: string;
  asset?: Asset;
  description: string;
  amount: number;
  currency: string;
  category: string;
  vendor: string;
  dueDate: string;
  paidDate?: string;
  periodStart?: string;
  periodEnd?: string;
  status: BillStatus;
  recurring: boolean;
  recurringPeriod?: RecurringPeriod;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AssetType =
  | 'software'
  | 'hardware'
  | 'service'
  | 'subscription'
  | 'domain'
  | 'ssl_certificate'
  | 'hosting'
  | 'saas'
  | 'other';

export type AssetStatus = 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
export type BillStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'partial';
export type RecurringPeriod = 'monthly' | 'yearly' | 'quarterly' | 'weekly' | 'one-time';

export interface AssetFormData {
  name: string;
  type: AssetType;
  provider: string;
  cost: string;
  currency: string;
  purchaseDate: string;
  expiryDate: string;
  recurringPeriod: RecurringPeriod;
  autoRenew: boolean;
  status: AssetStatus;
  notes: string;
}

export interface BillFormData {
  assetId: string;
  description: string;
  amount: string;
  currency: string;
  category: string;
  vendor: string;
  dueDate: string;
  paidDate: string;
  status: BillStatus;
  recurring: boolean;
  recurringPeriod: RecurringPeriod;
  paymentMethod: string;
  reference: string;
  notes: string;
}