"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DataTable } from "@/src/components/data-table/data-table";
import { EmptyState } from "@/src/components/states/empty-state";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { PageTitle } from "@/src/components/ui/typography";
import { ROLES } from "@/src/constants/roles";
import { ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { usersService } from "@/src/modules/users/services/users.service";
import { RoleGuard } from "@/src/permissions/role-guard";

import type { DataTableColumn } from "@/src/components/data-table/data-table";
import type { UserListItem } from "@/src/modules/users/types";

const readStringField = (data: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const candidate = data[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return "-";
};

export default function AdminUsersPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [rows, setRows] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [actionLoadingById, setActionLoadingById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadRows = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await usersService.getUsers({
          q: search || undefined,
          page,
          limit: pageSize,
        });

        setRows(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (nextError) {
        const message = nextError instanceof Error ? nextError.message : t("errors.general");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadRows();
  }, [page, pageSize, search, t]);

  const withActionLoading = useCallback(async (id: string, action: () => Promise<void>) => {
    try {
      setActionLoadingById((prev) => ({ ...prev, [id]: true }));
      await action();
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : t("errors.general");
      setError(message);
    } finally {
      setActionLoadingById((prev) => ({ ...prev, [id]: false }));
    }
  }, [t]);

  const onPromote = useCallback(async (id: string) => {
    await withActionLoading(id, async () => {
      await usersService.promoteUser(id);
      const response = await usersService.getUsers({ q: search || undefined, page, limit: pageSize });
      setRows(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    });
  }, [page, pageSize, search, withActionLoading]);

  const onDemote = useCallback(async (id: string) => {
    await withActionLoading(id, async () => {
      await usersService.demoteUser(id);
      const response = await usersService.getUsers({ q: search || undefined, page, limit: pageSize });
      setRows(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    });
  }, [page, pageSize, search, withActionLoading]);

  const columns = useMemo<DataTableColumn<UserListItem>[]>(
    () => [
      {
        id: "id",
        header: t("users.columns.id"),
        cell: (item) => item.id ?? t("users.columns.unknown"),
      },
      {
        id: "primary",
        header: t("users.columns.primary"),
        cell: (item) => readStringField(item.data, ["name", "fullName", "username", "email"]),
      },
      {
        id: "secondary",
        header: t("users.columns.secondary"),
        cell: (item) => readStringField(item.data, ["email", "username", "name"]),
      },
      {
        id: "actions",
        header: t("users.columns.actions"),
        cell: (item) => {
          if (!item.id) {
            return <span className="text-sm text-text-secondary">{t("users.actions.missingId")}</span>;
          }

          const itemLoading = actionLoadingById[item.id] ?? false;

          return (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                ariaLabel={t("users.actions.view")}
                onClick={() => router.push(ROUTES.admin.userById(item.id as string))}
              >
                {t("users.actions.view")}
              </Button>
              <RoleGuard roles={[ROLES.superAdmin]} fallback={null}>
                <Button
                  variant="primary"
                  disabled={itemLoading}
                  ariaLabel={t("users.actions.promote")}
                  onClick={() => void onPromote(item.id as string)}
                >
                  {itemLoading ? t("users.actions.loading") : t("users.actions.promote")}
                </Button>
              </RoleGuard>
              <RoleGuard roles={[ROLES.superAdmin]} fallback={null}>
                <Button
                  variant="destructive"
                  disabled={itemLoading}
                  ariaLabel={t("users.actions.demote")}
                  onClick={() => void onDemote(item.id as string)}
                >
                  {itemLoading ? t("users.actions.loading") : t("users.actions.demote")}
                </Button>
              </RoleGuard>
            </div>
          );
        },
      },
    ],
    [actionLoadingById, onDemote, onPromote, router, t],
  );

  return (
    <div className="space-y-6">
      <PageTitle>{t("users.title")}</PageTitle>

      {error ? <AlertBanner variant="error" title={t("users.error.title")} description={error} /> : null}

      {(!loading && rows.length === 0) ? (
        <EmptyState title={t("users.empty.title")} description={t("users.empty.description")} />
      ) : null}

      <DataTable<UserListItem>
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        pagination={{ page, pageSize, totalItems, totalPages }}
        onPaginationChange={(nextPagination) => setPage(nextPagination.page)}
      />
    </div>
  );
}
