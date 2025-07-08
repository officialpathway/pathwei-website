// src/admin/utils/formatters.ts

/**
 * Format currency values
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export function formatNumber(
  num: number,
  precision: number = 1,
  locale: string = 'en-US'
): string {
  if (num < 1000) {
    return new Intl.NumberFormat(locale).format(num);
  }

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixNum = Math.floor(Math.log10(num) / 3);
  const shortValue = parseFloat((num / Math.pow(1000, suffixNum)).toFixed(precision));

  return `${new Intl.NumberFormat(locale).format(shortValue)}${suffixes[suffixNum]}`;
}

/**
 * Format percentage values
 */
export function formatPercentage(
  value: number,
  precision: number = 1,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value / 100);
}

/**
 * Format date strings
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { month: 'short', day: 'numeric', year: 'numeric' }
      : format === 'medium'
        ? { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : format === 'long'
          ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
          : { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number, precision: number = 1): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(precision))} ${sizes[i]}`;
}

/**
 * Format status with appropriate styling
 */
export function formatStatus(status: string): { label: string; color: string; bgColor: string } {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    active: { label: 'Active', color: 'text-green-800', bgColor: 'bg-green-100' },
    inactive: { label: 'Inactive', color: 'text-gray-800', bgColor: 'bg-gray-100' },
    pending: { label: 'Pending', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
    suspended: { label: 'Suspended', color: 'text-red-800', bgColor: 'bg-red-100' },
    expired: { label: 'Expired', color: 'text-red-800', bgColor: 'bg-red-100' },
    cancelled: { label: 'Cancelled', color: 'text-orange-800', bgColor: 'bg-orange-100' },
    resolved: { label: 'Resolved', color: 'text-green-800', bgColor: 'bg-green-100' },
    in_progress: { label: 'In Progress', color: 'text-blue-800', bgColor: 'bg-blue-100' },
    closed: { label: 'Closed', color: 'text-gray-800', bgColor: 'bg-gray-100' },
    paid: { label: 'Paid', color: 'text-green-800', bgColor: 'bg-green-100' },
    overdue: { label: 'Overdue', color: 'text-red-800', bgColor: 'bg-red-100' },
    sent: { label: 'Sent', color: 'text-green-800', bgColor: 'bg-green-100' },
    failed: { label: 'Failed', color: 'text-red-800', bgColor: 'bg-red-100' },
    sending: { label: 'Sending', color: 'text-blue-800', bgColor: 'bg-blue-100' },
    draft: { label: 'Draft', color: 'text-gray-800', bgColor: 'bg-gray-100' },
  };

  return statusMap[status] || { label: status, color: 'text-gray-800', bgColor: 'bg-gray-100' };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}