// src/admin/hooks/useAdminData.ts
import { useState, useEffect, useCallback } from 'react';

interface UseAdminDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: unknown[];
  initialData?: T | null;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

interface UseAdminDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAdminData<T>({
  fetchFn,
  dependencies = [],
  initialData = null,
  onError,
  onSuccess
}: UseAdminDataOptions<T>): UseAdminDataReturn<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      onError?.(error);
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError, onSuccess]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Specialized hook for paginated data
interface UsePaginatedDataOptions<T> {
  fetchFn: (page: number, limit: number, filters?: unknown) => Promise<{
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }>;
  initialPage?: number;
  initialLimit?: number;
  filters?: unknown;
  onError?: (error: Error) => void;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function usePaginatedData<T>({
  fetchFn,
  initialPage = 1,
  initialLimit = 20,
  filters = {},
  onError
}: UsePaginatedDataOptions<T>): UsePaginatedDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: initialLimit
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn(page, limit, filters);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      onError?.(error);
      console.error('Paginated data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, limit, filters, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchData,
    setPage: handleSetPage,
    setLimit: handleSetLimit
  };
}

// Hook for managing CRUD operations
interface UseCrudOperationsOptions<T> {
  createFn?: (data: Partial<T>) => Promise<T>;
  updateFn?: (id: string | number, data: Partial<T>) => Promise<T>;
  deleteFn?: (id: string | number) => Promise<void>;
  onSuccess?: (operation: 'create' | 'update' | 'delete', data?: T) => void;
  onError?: (operation: 'create' | 'update' | 'delete', error: Error) => void;
}

interface UseCrudOperationsReturn<T> {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: string | number, data: Partial<T>) => Promise<T | null>;
  delete: (id: string | number) => Promise<boolean>;
}

export function useCrudOperations<T>({
  createFn,
  updateFn,
  deleteFn,
  onSuccess,
  onError
}: UseCrudOperationsOptions<T>): UseCrudOperationsReturn<T> {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const create = useCallback(async (data: Partial<T>): Promise<T | null> => {
    if (!createFn) return null;

    try {
      setCreating(true);
      const result = await createFn(data);
      onSuccess?.('create', result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Create operation failed');
      onError?.('create', error);
      console.error('Create error:', error);
      return null;
    } finally {
      setCreating(false);
    }
  }, [createFn, onSuccess, onError]);

  const update = useCallback(async (id: string | number, data: Partial<T>): Promise<T | null> => {
    if (!updateFn) return null;

    try {
      setUpdating(true);
      const result = await updateFn(id, data);
      onSuccess?.('update', result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Update operation failed');
      onError?.('update', error);
      console.error('Update error:', error);
      return null;
    } finally {
      setUpdating(false);
    }
  }, [updateFn, onSuccess, onError]);

  const deleteItem = useCallback(async (id: string | number): Promise<boolean> => {
    if (!deleteFn) return false;

    try {
      setDeleting(true);
      await deleteFn(id);
      onSuccess?.('delete');
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Delete operation failed');
      onError?.('delete', error);
      console.error('Delete error:', error);
      return false;
    } finally {
      setDeleting(false);
    }
  }, [deleteFn, onSuccess, onError]);

  return {
    creating,
    updating,
    deleting,
    create,
    update,
    delete: deleteItem
  };
}