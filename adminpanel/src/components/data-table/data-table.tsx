"use client";

import { EmptyState } from "@/src/components/states/empty-state";
import { TableSkeleton } from "@/src/components/states/skeleton";
import { Button } from "@/src/components/ui/button";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

import type { ServerPaginationParams } from "@/src/api/types/common";

export interface DataTableColumn<TItem> {
  id: string;
  header: string;
  cell: (item: TItem) => React.ReactNode;
  className?: string;
}

interface DataTableProps<TItem> {
  columns: DataTableColumn<TItem>[];
  rows: TItem[];
  loading?: boolean;
  pagination: ServerPaginationParams & { totalItems: number; totalPages: number };
  onPaginationChange: (pagination: ServerPaginationParams) => void;
}

export const DataTable = <TItem,>({
  columns,
  rows,
  loading,
  pagination,
  onPaginationChange,
}: DataTableProps<TItem>) => {
  const { t } = useI18n();

  if (loading) {
    return <TableSkeleton />;
  }

  if (!rows.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border border-zinc-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="px-4 py-3 font-semibold text-zinc-700">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`row-${index}`} className="border-t border-zinc-200">
                {columns.map((column) => (
                  <td key={column.id} className="px-4 py-3 text-zinc-700">
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600">
          {t("table.page")} {pagination.page} {t("table.of")} {pagination.totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            disabled={pagination.page <= 1}
            onClick={() => onPaginationChange({ page: pagination.page - 1, pageSize: pagination.pageSize })}
          >
            {t("table.previous")}
          </Button>
          <Button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPaginationChange({ page: pagination.page + 1, pageSize: pagination.pageSize })}
          >
            {t("table.next")}
          </Button>
        </div>
      </div>
    </div>
  );
};
