"use client";

import { useMemo, useState } from "react";

import { DataTable, type DataTableColumn } from "@/src/components/data-table/data-table";
import { AdminShell } from "@/src/components/layout/admin-shell";
import { Card } from "@/src/components/ui/card";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { DEFAULT_SERVER_PAGINATION } from "@/src/types/pagination";

interface ArchitectureLayer {
  id: string;
  name: string;
}

const layers: ArchitectureLayer[] = [
  { id: "1", name: "config" },
  { id: "2", name: "auth" },
  { id: "3", name: "permissions" },
  { id: "4", name: "api" },
  { id: "5", name: "ui" },
  { id: "6", name: "i18n" },
];

export default function Home() {
  const { t } = useI18n();
  const [pagination, setPagination] = useState(DEFAULT_SERVER_PAGINATION);
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(
    () => layers.filter((layer) => layer.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const columns = useMemo<DataTableColumn<ArchitectureLayer>[]>(
    () => [
      {
        id: "id",
        header: t("table.id"),
        cell: (item) => item.id,
      },
      {
        id: "name",
        header: t("table.name"),
        cell: (item) => item.name,
      },
    ],
    [t],
  );

  return (
    <AdminShell>
      <Card>
        <h1 className="text-2xl font-semibold text-zinc-900">{t("app.foundationTitle")}</h1>
        <p className="mt-2 text-sm text-zinc-600">{t("app.foundationSubtitle")}</p>
      </Card>
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchValue={search}
          onSearchChange={setSearch}
          toolbarSlot={<span className="text-sm text-zinc-500">{t("table.toolbarHint")}</span>}
          filterSlot={<p className="text-sm text-zinc-600">{t("table.filtersHint")}</p>}
          pagination={{
            ...pagination,
            totalItems: filteredRows.length,
            totalPages: Math.max(1, Math.ceil(filteredRows.length / pagination.pageSize)),
          }}
          onPaginationChange={(next) =>
            setPagination((prev) => ({ ...prev, page: next.page, pageSize: next.pageSize }))
          }
        />
      </div>
    </AdminShell>
  );
}
