// src/admin/hooks/useFilters.ts
import { useState, useCallback, useMemo } from 'react';

export interface FilterState {
  [key: string]: string | number | boolean | Date | null | undefined;
}

interface UseFiltersOptions<T extends FilterState> {
  initialFilters: T;
  onFiltersChange?: (filters: T) => void;
  resetPageOnChange?: boolean;
}

interface UseFiltersReturn<T extends FilterState> {
  filters: T;
  setFilter: (key: keyof T, value: T[keyof T]) => void;
  setFilters: (filters: Partial<T>) => void;
  resetFilters: () => void;
  clearFilter: (key: keyof T) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  getSearchParams: () => URLSearchParams;
  setFromSearchParams: (searchParams: URLSearchParams) => void;
}

export function useFilters<T extends FilterState>({
  initialFilters,
  onFiltersChange,
  resetPageOnChange = true
}: UseFiltersOptions<T>): UseFiltersReturn<T> {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  const setFilter = useCallback((key: keyof T, value: T[keyof T]) => {
    const newFilters = {
      ...filters,
      [key]: value,
      ...(resetPageOnChange && key !== 'page' ? { page: 1 } : {})
    };

    setFiltersState(newFilters);
    onFiltersChange?.(newFilters);
  }, [filters, onFiltersChange, resetPageOnChange]);

  const setFilters = useCallback((newFilters: Partial<T>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      ...(resetPageOnChange ? { page: 1 } : {})
    };

    setFiltersState(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange, resetPageOnChange]);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    onFiltersChange?.(initialFilters);
  }, [initialFilters, onFiltersChange]);

  const clearFilter = useCallback((key: keyof T) => {
    const newFilters = { ...filters };

    // Reset to initial value or undefined/empty string
    if (typeof initialFilters[key] === 'string') {
      newFilters[key] = '' as T[keyof T];
    } else if (typeof initialFilters[key] === 'number') {
      newFilters[key] = undefined as T[keyof T];
    } else if (typeof initialFilters[key] === 'boolean') {
      newFilters[key] = false as T[keyof T];
    } else {
      newFilters[key] = initialFilters[key];
    }

    if (resetPageOnChange && key !== 'page' && 'page' in newFilters) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newFilters as any)['page'] = 1;
    }

    setFiltersState(newFilters);
    onFiltersChange?.(newFilters);
  }, [filters, initialFilters, onFiltersChange, resetPageOnChange]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      const initialValue = initialFilters[key as keyof T];

      // Skip pagination fields
      if (key === 'page' || key === 'limit') return false;

      // Check if value is different from initial
      if (typeof value === 'string') {
        return value !== '' && value !== initialValue;
      } else if (typeof value === 'number') {
        return value !== undefined && value !== initialValue;
      } else if (typeof value === 'boolean') {
        return value !== initialValue;
      } else {
        return value !== initialValue;
      }
    });
  }, [filters, initialFilters]);

  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];

      // Skip pagination fields
      if (key === 'page' || key === 'limit') return false;

      if (typeof value === 'string') {
        return value !== '' && value !== undefined;
      } else if (typeof value === 'number') {
        return value !== undefined && value !== 0;
      } else if (typeof value === 'boolean') {
        return value === true;
      } else {
        return value !== null && value !== undefined;
      }
    }).length;
  }, [filters]);

  const getSearchParams = useCallback(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });

    return params;
  }, [filters]);

  const setFromSearchParams = useCallback((searchParams: URLSearchParams) => {
    const newFilters = { ...initialFilters };

    searchParams.forEach((value, key) => {
      if (key in initialFilters) {
        const initialType = typeof initialFilters[key as keyof T];

        if (initialType === 'number') {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            newFilters[key as keyof T] = numValue as T[keyof T];
          }
        } else if (initialType === 'boolean') {
          newFilters[key as keyof T] = (value === 'true') as T[keyof T];
        } else {
          newFilters[key as keyof T] = value as T[keyof T];
        }
      }
    });

    setFiltersState(newFilters);
    onFiltersChange?.(newFilters);
  }, [initialFilters, onFiltersChange]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    activeFilterCount,
    getSearchParams,
    setFromSearchParams
  };
}

// Common filter presets for admin components
export const commonFilters = {
  user: {
    page: 1,
    limit: 20,
    search: '',
    status: '',
    role: '',
    accountType: '',
    startDate: '',
    endDate: ''
  },

  feedback: {
    page: 1,
    limit: 20,
    search: '',
    status: '',
    type: '',
    priority: '',
    startDate: '',
    endDate: ''
  },

  assets: {
    page: 1,
    limit: 20,
    search: '',
    type: '',
    status: '',
    provider: '',
    expiringWithin: ''
  },

  categories: {
    page: 1,
    limit: 20,
    search: '',
    isActive: undefined as boolean | undefined,
    isTestable: undefined as boolean | undefined
  }
} as const;

// Hook for date range filters
interface UseDateRangeFiltersOptions {
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

interface UseDateRangeFiltersReturn {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setDateRange: (start: string, end: string) => void;
  resetDateRange: () => void;
  getPresetRange: (preset: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth') => void;
}

export function useDateRangeFilters({
  onDateRangeChange
}: UseDateRangeFiltersOptions = {}): UseDateRangeFiltersReturn {
  const [startDate, setStartDateState] = useState('');
  const [endDate, setEndDateState] = useState('');

  const setStartDate = useCallback((date: string) => {
    setStartDateState(date);
    onDateRangeChange?.(date, endDate);
  }, [endDate, onDateRangeChange]);

  const setEndDate = useCallback((date: string) => {
    setEndDateState(date);
    onDateRangeChange?.(startDate, date);
  }, [startDate, onDateRangeChange]);

  const setDateRange = useCallback((start: string, end: string) => {
    setStartDateState(start);
    setEndDateState(end);
    onDateRangeChange?.(start, end);
  }, [onDateRangeChange]);

  const resetDateRange = useCallback(() => {
    setStartDateState('');
    setEndDateState('');
    onDateRangeChange?.('', '');
  }, [onDateRangeChange]);

  const getPresetRange = useCallback((preset: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    let start: Date;
    let end: Date = new Date();

    switch (preset) {
      case 'today':
        start = new Date();
        break;
      case 'yesterday':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        end = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'last7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        start = new Date();
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    setDateRange(startStr, endStr);
  }, [setDateRange]);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setDateRange,
    resetDateRange,
    getPresetRange
  };
}