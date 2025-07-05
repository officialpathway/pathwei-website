// admin/utils/assetsUtils.tsx
import { Globe, Server, Smartphone, Monitor } from "lucide-react";

export const getAssetIcon = (type: string): React.ReactNode => {
  switch (type.toLowerCase()) {
    case "domain":
      return <Globe className="w-5 h-5" />;
    case "hosting":
      return <Server className="w-5 h-5" />;
    case "software":
      return <Monitor className="w-5 h-5" />;
    case "saas":
      return <Monitor className="w-5 h-5" />;
    case "mobile":
      return <Smartphone className="w-5 h-5" />;
    default:
      return <Monitor className="w-5 h-5" />;
  }
};

export const isExpiringSoon = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expiry <= thirtyDaysFromNow;
};

export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "expired":
    case "overdue":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
