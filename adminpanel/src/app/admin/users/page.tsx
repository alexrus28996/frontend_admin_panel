"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { DataTable } from "@/src/components/data-table/data-table";
import { EmptyState } from "@/src/components/states/empty-state";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Dialog } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { MutedText, PageTitle } from "@/src/components/ui/typography";
import { ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { usersService } from "@/src/modules/users/services/users.service";
import { createUserSchema } from "@/src/schemas/users/create-user.schema";

import type { DataTableColumn } from "@/src/components/data-table/data-table";
import type { UnknownRecord } from "@/src/modules/users/types";
import type { CreateUserSchemaInput } from "@/src/schemas/users/create-user.schema";

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
  const id = item._id ?? item.id;

  if (typeof id === "string" || typeof id === "number") {
    return String(id);
  }

  return null;
};

const getColumnKeys = (firstRow: UnknownRecord | undefined): string[] => {
  if (!firstRow) {
    return [];
  }

  const keys = Object.keys(firstRow);
  const preferred = ["_id", "id", "email", "name", "role", "isActive"];
  const selected: string[] = [];

  preferred.forEach((key) => {
    if (keys.includes(key) && !selected.includes(key)) {
      selected.push(key);
    }
  });

  keys.forEach((key) => {
    if (!selected.includes(key) && selected.length < 9) {
      selected.push(key);
    }
  });

  return selected.slice(0, 9);
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
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: createFormErrors, isSubmitting: createSubmitting },
  } = useForm<CreateUserSchemaInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await usersService.getUsers({
        q: search || undefined,
        page,
        limit: pageSize,
      });

      if (result.unknownSchema) {
        setError(t("users.errors.unknownSchema"));
        setRows([]);
      } else {
        setRows(result.rows.filter((item): item is UnknownRecord => isRecord(item)));
      }
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

  const onCreateUser = async (values: CreateUserSchemaInput) => {
    setCreateError(null);
    setCreateSuccess(null);

    try {
      await usersService.createUser(values);
      setCreateOpen(false);
      reset();
      setCreateSuccess(t("users.create.success"));
      await refreshUsers();
    } catch (nextError) {
      setCreateError(nextError instanceof Error ? nextError.message : t("users.create.error"));
    }
  };

  const dynamicKeys = useMemo(() => getColumnKeys(rows[0]), [rows]);

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
          return <MutedText>{t("users.actions.missingId")}</MutedText>;
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
      {createSuccess ? <AlertBanner variant="success" title={t("users.create.successTitle")} description={createSuccess} /> : null}

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
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
            <Button type="button" onClick={() => setCreateOpen(true)} ariaLabel={t("users.create.open")}>
              {t("users.create.open")}
            </Button>
          </div>

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

      <Dialog
        open={createOpen}
        title={t("users.create.title")}
        description={t("users.create.description")}
        closeLabel={t("users.create.close")}
        onClose={() => {
          setCreateOpen(false);
          setCreateError(null);
        }}
      >
        <form className="space-y-3" onSubmit={handleSubmit(onCreateUser)} noValidate>
          {createError ? (
            <AlertBanner variant="error" title={t("users.create.errorTitle")} description={createError} />
          ) : null}

          <Input
            id="create-name"
            ariaLabel={t("users.create.fields.name")}
            placeholder={t("users.create.fields.name")}
            error={createFormErrors.name?.message ? t(createFormErrors.name.message) : undefined}
            {...register("name")}
          />
          <Input
            id="create-email"
            type="email"
            ariaLabel={t("users.create.fields.email")}
            placeholder={t("users.create.fields.email")}
            error={createFormErrors.email?.message ? t(createFormErrors.email.message) : undefined}
            {...register("email")}
          />
          <Input
            id="create-password"
            type="password"
            ariaLabel={t("users.create.fields.password")}
            placeholder={t("users.create.fields.password")}
            error={createFormErrors.password?.message ? t(createFormErrors.password.message) : undefined}
            {...register("password")}
          />

          <Button type="submit" disabled={createSubmitting} ariaLabel={t("users.create.submit")}>
            {createSubmitting ? t("users.loading") : t("users.create.submit")}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
