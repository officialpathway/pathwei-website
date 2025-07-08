// src/admin/hooks/index.ts

// Re-export all hooks for easy importing
export {
  useAdminData,
  usePaginatedData,
  useCrudOperations
} from './useAdminData';

export {
  useFilters,
  useDateRangeFilters,
  commonFilters,
  type FilterState
} from './useFilters';

export {
  usePagination,
  useInfiniteScroll,
  calculatePagination,
  PAGINATION_SIZES,
  type PaginationState
} from './usePagination';