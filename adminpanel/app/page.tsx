"use client";

import { useMemo, useState } from "react";

import { Card } from "@/src/components/ui/card";
import { DataTable, type DataTableColumn } from "@/src/components/data-table/data-table";
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

  const columns = useMemo<DataTableColumn<ArchitectureLayer>[]>(
    () => [
      {
        id: "id",
        header: t("table.page"),
        cell: (item) => item.id,
      },
      {
        id: "name",
        header: t("home.title"),
        cell: (item) => item.name,
      },
    ],
    [t],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
      <Card>
        <h1 className="text-2xl font-semibold text-zinc-900">{t("home.title")}</h1>
        <p className="mt-2 text-sm text-zinc-600">{t("home.subtitle")}</p>
      </Card>
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={layers}
          pagination={{ ...pagination, totalItems: layers.length, totalPages: 1 }}
          onPaginationChange={setPagination}
        />
      </div>
    </main>
  );
}
