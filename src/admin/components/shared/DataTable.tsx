// src/admin/components/shared/DataTable.tsx
"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { TableSkeleton } from "./LoadingSpinner";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, value: unknown) => ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  actions?: (item: T) => ReactNode;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  getRowId?: (item: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  searchable = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  pagination,
  onPageChange,
  emptyMessage = "No data found",
  emptyIcon,
  className = "",
  actions,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRowId = (item: any) => item.id,
}: DataTableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? data : []);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (!onSelectionChange) return;
    const itemId = getRowId(item);
    const newSelection = checked
      ? [...selectedItems, item]
      : selectedItems.filter((selected) => getRowId(selected) !== itemId);
    onSelectionChange(newSelection);
  };

  const isSelected = (item: T) => {
    const itemId = getRowId(item);
    return selectedItems.some((selected) => getRowId(selected) === itemId);
  };

  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header with search */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    title="Select all items"
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.className || ""
                  }`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                >
                  <div className="p-8">
                    <TableSkeleton rows={5} cols={columns.length} />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={getRowId(item)} className="hover:bg-gray-50">
                  {selectable && (
                    <td className="px-4 py-4">
                      <input
                        title="Select item"
                        type="checkbox"
                        checked={isSelected(item)}
                        onChange={(e) =>
                          handleSelectItem(item, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => {
                    const value =
                      typeof column.key === "string" && column.key.includes(".")
                        ? column.key
                            .split(".")
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .reduce((obj, key) => obj?.[key], item as any)
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (item as any)[column.key];

                    return (
                      <td
                        key={colIndex}
                        className={`px-4 py-4 whitespace-nowrap ${
                          column.className || ""
                        }`}
                      >
                        {column.render ? column.render(item, value) : value}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick filters component for common use cases
interface QuickFiltersProps {
  filters: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
  }>;
  className?: string;
}

export function QuickFilters({ filters, className = "" }: QuickFiltersProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {filters.map((filter) => (
        <div key={filter.key} className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {filter.label}
          </label>
          <select
            title="Select filter"
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
