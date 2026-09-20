/**
 * ADS INTELLIGENCE Components - DataTable
 * Dense data table matching Google Ads Console density
 */
import React, { useMemo } from 'react';
import { colors, radius, table, typography } from '../../styles/tokens';

// Extract only string keys from T (exclude symbol keys which are not valid React keys)
export type StringKeyOf<T> = Extract<keyof T, string>;

export interface Column<T> {
  key: StringKeyOf<T>;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  sortColumn?: StringKeyOf<T>;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: StringKeyOf<T>) => void;
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  rowHeight?: 'dense' | 'normal';
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = 'Nenhum dado disponível',
  stickyHeader = true,
  rowHeight = 'normal',
  className = '',
}: DataTableProps<T>) {
  const handleSelectAll = () => {
    if (onSelectionChange) {
      const allKeys = new Set(data.map(keyExtractor));
      if (selectedKeys.size === data.length) {
        onSelectionChange(new Set());
      } else {
        onSelectionChange(allKeys);
      }
    }
  };

  const isRowSelected = (row: T) => selectedKeys.has(keyExtractor(row));

  const handleRowSelect = (row: T, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onSelectionChange) {
      const newKeys = new Set(selectedKeys);
      const key = keyExtractor(row);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      onSelectionChange(newKeys);
    }
  };

  if (loading) {
    return (
      <div className="relative" style={{ minHeight: '200px' }} role="status" aria-label="Carregando">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto border border-gray-200 rounded-xl ${className}`}>
      <table className="w-full border-collapse" style={{ fontSize: typography.fontSize.metricTable[0] }}>
        <thead>
          <tr
            className={stickyHeader ? 'sticky top-0 z-10' : ''}
            style={{
              height: table.headerHeight,
              backgroundColor: table.stickyHeaderBg,
              borderBottom: `1px solid ${table.borderColor}`,
            }}
          >
            {selectable && (
              <th
                className="px-3 text-left"
                style={{ width: '40px', minWidth: '40px' }}
              >
                <input
                  type="checkbox"
                  checked={selectedKeys.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label="Selecionar todas"
                />
              </th>
            )}
            {columns.map((column, idx) => (
              <th
                key={column.key}
                className="px-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                  textAlign: column.align || 'left',
                  position: column.sticky ? 'sticky' : undefined,
                  left: column.sticky ? '0' : undefined,
                  zIndex: column.sticky ? 20 : undefined,
                  backgroundColor: column.sticky ? table.stickyHeaderBg : undefined,
                }}
                onClick={column.sortable ? () => onSort?.(column.key) : undefined}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortColumn === column.key && (
                    <span className="material-symbols-outlined text-sm">
                      {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowKey = keyExtractor(row);
            const isSelected = isRowSelected(row);
            return (
              <tr
                key={rowKey}
                className={`transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                style={{
                  height: rowHeight === 'dense' ? table.rowHeightDense : table.rowHeight,
                  borderBottom: rowIndex < data.length - 1 ? `1px solid ${table.borderColor}` : 'none',
                  cursor: onRowClick ? 'pointer' : 'default',
                }}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      onClick={(e) => handleRowSelect(row, e)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-3"
                    style={{
                      textAlign: column.align || 'left',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {column.render ? column.render(row, rowIndex) : (row[column.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  itemsPerPageOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [1];

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-gray-100 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <span>Itens por página:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {itemsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-600">
          {startItem}–{endItem} de {totalItems.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {pages.map((page, idx) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Próxima página"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
};