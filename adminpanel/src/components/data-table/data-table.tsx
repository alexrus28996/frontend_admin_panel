"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/src/components/states/empty-state";
import { TableSkeleton } from "@/src/components/states/skeleton";
import { Alert } from "@/src/components/ui/alert";
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
  error?: string | null;
  searchValue?: string;
  searchDebounceMs?: number;
  onSearchChange?: (value: string) => void;
  filterSlot?: React.ReactNode;
  toolbarSlot?: React.ReactNode;
  pagination: ServerPaginationParams & { totalItems: number; totalPages: number };
  onPaginationChange: (pagination: ServerPaginationParams) => void;
}

export const DataTable = <TItem,>({
  columns,
  rows,
  loading,
  error,
  searchValue = "",
  searchDebounceMs = 400,
  onSearchChange,
  filterSlot,
  toolbarSlot,
  pagination,
  onPaginationChange,
}: DataTableProps<TItem>) => {
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState(searchValue);

  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (!onSearchChange) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onSearchChange(searchInput);
    }, searchDebounceMs);

    return () => window.clearTimeout(timeout);
  }, [onSearchChange, searchDebounceMs, searchInput]);

  const paginationLabel = useMemo(
    () => `${t("table.page")} ${pagination.page} ${t("table.of")} ${pagination.totalPages}`,
    [pagination.page, pagination.totalPages, t],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-3 md:flex-row md:items-center md:justify-between">
        <label className="sr-only" htmlFor="table-search-input">
          {t("table.searchPlaceholder")}
        </label>
        <input
          id="table-search-input"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label={t("table.searchPlaceholder")}
          placeholder={t("table.searchPlaceholder")}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 md:max-w-sm"
        />
        {toolbarSlot ? <div className="flex items-center gap-2">{toolbarSlot}</div> : null}
      </div>

      {filterSlot ? (
        <section aria-label={t("table.filters")} className="rounded-md border border-zinc-200 bg-white p-3">
          {filterSlot}
        </section>
      ) : null}

      {error ? <Alert variant="error" title={t("errors.general")} description={error} /> : null}

      {loading ? (
        <TableSkeleton />
      ) : rows.length ? (
        <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="min-w-full text-left text-sm" aria-label={t("table.dataGrid")}>
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
      ) : (
        <EmptyState />
      )}

      <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-zinc-600">{paginationLabel}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-600">
            {t("table.rowsPerPage")}: {pagination.pageSize}
          </p>
          <Button
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            disabled={pagination.page <= 1}
            onClick={() => onPaginationChange({ page: pagination.page - 1, pageSize: pagination.pageSize })}
          >
            {t("table.previous")}
          </Button>
          <Button
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
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
