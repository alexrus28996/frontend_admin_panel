"use client";

import { useMemo, useState } from "react";

import { DataTable, type DataTableColumn } from "@/src/components/data-table/data-table";
import { AdminShell } from "@/src/components/layout/admin-shell";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Dialog } from "@/src/components/ui/dialog";
import { MutedText, PageTitle, Text } from "@/src/components/ui/typography";
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
  const [dialogOpen, setDialogOpen] = useState(false);

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
        <CardHeader>
          <PageTitle>{t("app.foundationTitle")}</PageTitle>
        </CardHeader>
        <CardContent>
          <Text>{t("app.foundationSubtitle")}</Text>
          <MutedText className="mt-2">Enterprise-ready UI system baseline.</MutedText>
          <Badge className="mt-3">System</Badge>
        </CardContent>
      </Card>
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchValue={search}
          onSearchChange={setSearch}
          toolbarSlot={<span className="text-sm text-text-secondary">{t("table.toolbarHint")}</span>}
          filterSlot={<p className="text-sm text-text-secondary">{t("table.filtersHint")}</p>}
          pagination={{
            ...pagination,
            totalItems: filteredRows.length,
            totalPages: Math.max(1, Math.ceil(filteredRows.length / pagination.pageSize)),
          }}
          rowActions={() => [{ label: "Inspect", onSelect: () => setDialogOpen(true) }]}
          onPaginationChange={(next) =>
            setPagination((prev) => ({ ...prev, page: next.page, pageSize: next.pageSize }))
          }
        />
      </div>
      <Dialog
        open={dialogOpen}
        title="Layer inspection"
        description="This modal validates accessible dialog behavior."
        onClose={() => setDialogOpen(false)}
      >
        <Text>Dialog component is integrated and keyboard-dismissible.</Text>
      </Dialog>
    </AdminShell>
  );
}
