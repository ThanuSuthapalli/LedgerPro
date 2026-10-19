'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  cell?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (accessor: string | ((item: T) => React.ReactNode), direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  onSort,
  sortColumn,
  sortDirection,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data found',
  className,
  rowClassName,
}: DataTableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    const currentAccessor = typeof column.accessor === 'string' ? column.accessor : column.accessor.toString();
    const newDirection =
      sortColumn === currentAccessor && sortDirection === 'asc' ? 'desc' : 'asc';

    onSort(column.accessor, newDirection);
  };

  const getValue = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor];
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const currentAccessor = typeof column.accessor === 'string' ? column.accessor : column.accessor.toString();
    if (sortColumn !== currentAccessor) {
      return <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />;
    }

    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary" />
    );
  };

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 hover:bg-muted/50">
            {columns.map((column, idx) => (
              <th
                key={idx}
                onClick={() => handleSort(column)}
                className={cn(
                  'px-6 py-4 text-left font-semibold text-foreground',
                  column.sortable && 'cursor-pointer hover:bg-muted',
                  column.className
                )}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-border hover:bg-muted/50 transition-colors',
                  onRowClick && 'cursor-pointer',
                  rowClassName
                )}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn('px-6 py-4 text-foreground', column.className)}
                  >
                    {column.cell
                      ? column.cell(getValue(item, column), item)
                      : getValue(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
