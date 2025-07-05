// admin/types/AssetsTypes.ts

export interface Asset {
  id: string;
  name: string;
  type: string;
  provider?: string;
  cost: number;
  currency: string;
  purchaseDate: string;
  expiryDate?: string;
  status: string;
  autoRenew: boolean;
  recurringPeriod?: string; // "monthly", "yearly", "quarterly", "one-time"
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
  status: string;
  recurring: boolean;
  recurringPeriod?: string;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetFormData {
  name: string;
  type: string;
  provider: string;
  cost: string;
  currency: string;
  purchaseDate: string;
  expiryDate: string;
  recurringPeriod: string;
  autoRenew: boolean;
  status: string;
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
  status: string;
  recurring: boolean;
  recurringPeriod: string;
  paymentMethod: string;
  reference: string;
  notes: string;
}