"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { DataTable } from "@/src/components/data-table/data-table";
import { EmptyState } from "@/src/components/states/empty-state";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { MutedText, PageTitle } from "@/src/components/ui/typography";
import { ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { usersService } from "@/src/modules/users/services/users.service";
import { normalizeList } from "@/src/modules/users/utils/response-normalizer";

import type { DataTableColumn } from "@/src/components/data-table/data-table";
import type { UnknownRecord } from "@/src/modules/users/types";

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toDisplayValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value || "-";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value === null || value === undefined) {
    return "-";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "-";
  }
};

const getUserId = (item: UnknownRecord): string | null => {
  const id = item.id;

  if (typeof id === "string" || typeof id === "number") {
    return String(id);
  }

  return null;
};

export default function AdminUsersPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [rows, setRows] = useState<UnknownRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [actionLoadingById, setActionLoadingById] = useState<Record<string, boolean>>({});

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getUsers({
        q: search || undefined,
        page,
        limit: pageSize,
      });

      const normalized = normalizeList(response);
      setRows(normalized.filter((item): item is UnknownRecord => isRecord(item)));
    } catch (nextError) {
      setRows([]);
      setError(nextError instanceof Error ? nextError.message : t("users.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, t]);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  const withActionLoading = useCallback(async (id: string, action: () => Promise<void>) => {
    setActionLoadingById((prev) => ({ ...prev, [id]: true }));

    try {
      await action();
      await refreshUsers();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("users.errors.loadFailed"));
    } finally {
      setActionLoadingById((prev) => ({ ...prev, [id]: false }));
    }
  }, [refreshUsers, t]);

  const dynamicKeys = useMemo(() => {
    const firstRow = rows[0];

    if (!firstRow) {
      return [];
    }

    return Object.keys(firstRow).slice(0, 4);
  }, [rows]);

  const columns = useMemo<DataTableColumn<UnknownRecord>[]>(() => {
    const generatedColumns: DataTableColumn<UnknownRecord>[] = dynamicKeys.map((key) => ({
      id: key,
      header: key,
      cell: (item) => toDisplayValue(item[key]),
    }));

    if (!generatedColumns.length) {
      generatedColumns.push({
        id: "json-preview",
        header: t("users.preview"),
        cell: (item) => toDisplayValue(item),
      });
    }

    generatedColumns.push({
      id: "actions",
      header: t("users.actions.title"),
      cell: (item) => {
        const itemId = getUserId(item);

        if (!itemId) {
          return <MutedText>{t("users.emptyDescription")}</MutedText>;
        }

        const isMutating = Boolean(actionLoadingById[itemId]);

        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              className="h-8 px-3"
              disabled={isMutating}
              onClick={() => router.push(ROUTES.admin.userById(itemId))}
            >
              {t("users.actions.view")}
            </Button>
            <Button
              variant="primary"
              className="h-8 px-3"
              disabled={isMutating}
              onClick={() => void withActionLoading(itemId, async () => usersService.promoteUser(itemId))}
            >
              {isMutating ? t("users.loading") : t("users.actions.promote")}
            </Button>
            <Button
              variant="destructive"
              className="h-8 px-3"
              disabled={isMutating}
              onClick={() => void withActionLoading(itemId, async () => usersService.demoteUser(itemId))}
            >
              {isMutating ? t("users.loading") : t("users.actions.demote")}
            </Button>
          </div>
        );
      },
    });

    return generatedColumns;
  }, [actionLoadingById, dynamicKeys, router, t, withActionLoading]);

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <PageTitle>{t("users.title")}</PageTitle>
        <MutedText>{t("users.subtitle")}</MutedText>
      </section>

      {error ? <AlertBanner variant="error" title={t("users.errors.loadFailed")} description={error} /> : null}

      <Card>
        <CardContent className="space-y-4">
          <Input
            id="users-search"
            value={search}
            ariaLabel={t("users.search")}
            placeholder={t("users.search")}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          {!loading && !error && rows.length === 0 ? (
            <EmptyState title={t("users.emptyTitle")} description={t("users.emptyDescription")} />
          ) : null}

          {loading || (!error && rows.length > 0) ? (
            <DataTable<UnknownRecord>
              columns={columns}
              rows={rows}
              loading={loading}
              error={error}
              pagination={{ page, pageSize, totalItems: rows.length, totalPages: Math.max(1, Math.ceil(rows.length / pageSize)) }}
              onPaginationChange={(nextPagination) => setPage(nextPagination.page)}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
