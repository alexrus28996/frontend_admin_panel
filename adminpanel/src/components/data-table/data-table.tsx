"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/src/components/states/empty-state";
import { TableSkeleton } from "@/src/components/states/skeleton";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu } from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
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
  rowActions?: (item: TItem) => { label: string; onSelect: () => void }[];
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
  rowActions,
}: DataTableProps<TItem>) => {
  const { t } = useI18n();
  const [searchInput, setSearchInput] = useState(searchValue);

  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (!onSearchChange) return;
    const timeout = window.setTimeout(() => onSearchChange(searchInput), searchDebounceMs);
    return () => window.clearTimeout(timeout);
  }, [onSearchChange, searchDebounceMs, searchInput]);

  const paginationLabel = useMemo(
    () => `${t("table.page")} ${pagination.page} ${t("table.of")} ${pagination.totalPages}`,
    [pagination.page, pagination.totalPages, t],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 md:flex-row md:items-center md:justify-between">
        <Input
          id="table-search-input"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          ariaLabel={t("table.searchPlaceholder")}
          placeholder={t("table.searchPlaceholder")}
          className="md:max-w-sm"
        />
        {toolbarSlot ? <div className="flex items-center gap-2" aria-label="Toolbar region">{toolbarSlot}</div> : null}
      </div>

      {filterSlot ? (
        <section aria-label={t("table.filters")} className="rounded-xl border border-border bg-surface p-3">
          {filterSlot}
        </section>
      ) : null}

      {error ? <AlertBanner variant="error" title={t("errors.general")} description={error} /> : null}

      {loading ? (
        <TableSkeleton />
      ) : rows.length ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-left text-sm" aria-label={t("table.dataGrid")}>
            <thead className="sticky top-0 bg-surface-muted">
              <tr>
                {columns.map((column) => (
                  <th key={column.id} className="px-4 py-3 font-semibold text-text-secondary">
                    {column.header}
                  </th>
                ))}
                {rowActions ? <th className="px-4 py-3 text-right font-semibold text-text-secondary">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`row-${index}`} className="border-t border-border transition-colors duration-200 hover:bg-surface-muted/50">
                  {columns.map((column) => (
                    <td key={column.id} className="px-4 py-3 text-text-primary">
                      {column.cell(row)}
                    </td>
                  ))}
                  {rowActions ? (
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu triggerLabel="⋯" items={rowActions(row)} />
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState />
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-text-secondary">{paginationLabel}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-text-secondary">
            {t("table.rowsPerPage")}: {pagination.pageSize}
          </p>
          <Button
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={() => onPaginationChange({ page: pagination.page - 1, pageSize: pagination.pageSize })}
          >
            {t("table.previous")}
          </Button>
          <Button
            variant="secondary"
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
