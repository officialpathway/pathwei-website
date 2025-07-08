// src/admin/hooks/usePagination.ts
import React from 'react';
import { useState, useCallback, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  maxVisiblePages?: number;
}

interface UsePaginationReturn {
  pagination: PaginationState;
  currentPage: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  updatePagination: (newPagination: Partial<PaginationState>) => void;
  getVisiblePages: () => number[];
  getPageInfo: () => {
    startItem: number;
    endItem: number;
    totalItems: number;
  };
  canNavigate: {
    canGoNext: boolean;
    canGoPrev: boolean;
    canGoFirst: boolean;
    canGoLast: boolean;
  };
}

export function usePagination({
  initialPage = 1,
  initialLimit = 20,
  onPageChange,
  onLimitChange,
  maxVisiblePages = 5
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: initialLimit,
    hasNextPage: false,
    hasPrevPage: false
  });

  const setPage = useCallback((page: number) => {
    if (page < 1 || page > pagination.totalPages) return;

    const newPagination = {
      ...pagination,
      currentPage: page,
      hasNextPage: page < pagination.totalPages,
      hasPrevPage: page > 1
    };

    setPagination(newPagination);
    onPageChange?.(page);
  }, [pagination, onPageChange]);

  const setLimit = useCallback((limit: number) => {
    if (limit < 1) return;

    // Calculate new total pages based on new limit
    const newTotalPages = Math.ceil(pagination.totalItems / limit);

    // Adjust current page if it's out of bounds
    const newCurrentPage = Math.min(pagination.currentPage, newTotalPages || 1);

    const newPagination = {
      ...pagination,
      itemsPerPage: limit,
      totalPages: newTotalPages,
      currentPage: newCurrentPage,
      hasNextPage: newCurrentPage < newTotalPages,
      hasPrevPage: newCurrentPage > 1
    };

    setPagination(newPagination);
    onLimitChange?.(limit);

    // Call page change if page was adjusted
    if (newCurrentPage !== pagination.currentPage) {
      onPageChange?.(newCurrentPage);
    }
  }, [pagination, onLimitChange, onPageChange]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPage(pagination.currentPage + 1);
    }
  }, [pagination.hasNextPage, pagination.currentPage, setPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPage(pagination.currentPage - 1);
    }
  }, [pagination.hasPrevPage, pagination.currentPage, setPage]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToLastPage = useCallback(() => {
    setPage(pagination.totalPages);
  }, [pagination.totalPages, setPage]);

  const updatePagination = useCallback((newPagination: Partial<PaginationState>) => {
    setPagination(prev => {
      const updated = { ...prev, ...newPagination };

      // Recalculate navigation flags
      updated.hasNextPage = updated.currentPage < updated.totalPages;
      updated.hasPrevPage = updated.currentPage > 1;

      return updated;
    });
  }, []);

  const getVisiblePages = useCallback((): number[] => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pagination, maxVisiblePages]);

  const getPageInfo = useCallback(() => {
    const { currentPage, itemsPerPage, totalItems } = pagination;
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      startItem,
      endItem,
      totalItems
    };
  }, [pagination]);

  const canNavigate = useMemo(() => ({
    canGoNext: pagination.hasNextPage,
    canGoPrev: pagination.hasPrevPage,
    canGoFirst: pagination.currentPage > 1,
    canGoLast: pagination.currentPage < pagination.totalPages
  }), [pagination]);

  return {
    pagination,
    currentPage: pagination.currentPage,
    itemsPerPage: pagination.itemsPerPage,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    updatePagination,
    getVisiblePages,
    getPageInfo,
    canNavigate
  };
}

// Hook for infinite scroll pagination
interface UseInfiniteScrollOptions<T> {
  fetchMore: (page: number) => Promise<{ data: T[]; hasMore: boolean }>;
  threshold?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll<T>({
  fetchMore,
  threshold = 100,
  enabled = true
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ref = React.useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchMore(page);
      setData(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load more data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, []);

  // Handle scroll events
  React.useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    const handleScroll = () => {
      if (loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = element;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, threshold, loadMore, enabled]);

  return {
    data,
    loading,
    hasMore,
    loadMore,
    reset,
    ref
  };
}

// Common pagination sizes
export const PAGINATION_SIZES = [10, 20, 50, 100] as const;

// Helper function to calculate pagination info
export function calculatePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return {
    totalPages,
    startItem,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}