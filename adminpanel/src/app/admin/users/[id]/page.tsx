"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { CardTitle, MutedText, PageTitle, Text } from "@/src/components/ui/typography";
import { ROLES } from "@/src/constants/roles";
import { ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { usersService } from "@/src/modules/users/services/users.service";
import { RoleGuard } from "@/src/permissions/role-guard";

import type { UserDetailsResponse } from "@/src/modules/users/types";

const readSummaryEntries = (data: Record<string, unknown>): Array<{ key: string; value: string }> =>
  Object.entries(data)
    .slice(0, 8)
    .map(([key, value]) => ({
      key,
      value: typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : JSON.stringify(value),
    }));

export default function AdminUserDetailsPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [details, setDetails] = useState<UserDetailsResponse | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [newPermission, setNewPermission] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [mutating, setMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [nextDetails, nextPermissions] = await Promise.all([
        usersService.getUserById(userId),
        usersService.getUserPermissions(userId),
      ]);

      setDetails(nextDetails);
      setPermissions(nextPermissions.permissions);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("errors.general"));
    } finally {
      setLoading(false);
    }
  }, [t, userId]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const summary = useMemo(() => readSummaryEntries(details?.data ?? {}), [details]);

  const onAddPermission = async () => {
    if (!newPermission.trim()) {
      return;
    }

    try {
      setMutating(true);
      setError(null);
      const response = await usersService.addUserPermission(userId, newPermission.trim());
      setPermissions(response.permissions);
      setNewPermission("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("errors.general"));
    } finally {
      setMutating(false);
    }
  };

  const onRemovePermission = async (permission: string) => {
    try {
      setMutating(true);
      setError(null);
      const response = await usersService.removeUserPermission(userId, permission);
      setPermissions(response.permissions);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("errors.general"));
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Button variant="ghost" asChild className="w-fit px-0">
          <Link href={ROUTES.admin.users} aria-label={t("users.detail.backToUsers")}>
            ← {t("users.detail.backToUsers")}
          </Link>
        </Button>
        <div className="space-y-1">
          <PageTitle>{t("users.detail.title")}</PageTitle>
          <MutedText>{t("users.detail.subtitle")}</MutedText>
        </div>
      </section>

      {error ? <AlertBanner variant="error" title={t("users.error.title")} description={error} /> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader description={t("users.detail.subtitle")}>
            <CardTitle>{t("users.detail.profileCardTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Text>{t("users.actions.loading")}</Text>
            ) : summary.length ? (
              summary.map((entry) => (
                <div key={entry.key} className="space-y-1 rounded-md border border-border bg-surface-elevated px-3 py-2">
                  <MutedText>{entry.key}</MutedText>
                  <Text>{entry.value}</Text>
                </div>
              ))
            ) : (
              <Text>{t("users.empty.description")}</Text>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader description={t("users.permissions.inputLabel")}>
            <CardTitle>{t("users.detail.permissionsCardTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RoleGuard roles={[ROLES.superAdmin]} fallback={null}>
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <Input
                  id="permission-input"
                  value={newPermission}
                  ariaLabel={t("users.permissions.inputLabel")}
                  placeholder={t("users.permissions.inputPlaceholder")}
                  onChange={(event) => setNewPermission(event.target.value)}
                />
                <Button disabled={mutating || !newPermission.trim()} onClick={() => void onAddPermission()}>
                  {mutating ? t("users.actions.loading") : t("users.permissions.add")}
                </Button>
              </div>
            </RoleGuard>

            {loading ? (
              <Text>{t("users.actions.loading")}</Text>
            ) : permissions.length ? (
              <ul className="space-y-2">
                {permissions.map((permission) => (
                  <li key={permission} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <Text>{permission}</Text>
                    <RoleGuard roles={[ROLES.superAdmin]} fallback={null}>
                      <Button variant="destructive" disabled={mutating} onClick={() => void onRemovePermission(permission)}>
                        {mutating ? t("users.actions.loading") : t("users.permissions.remove")}
                      </Button>
                    </RoleGuard>
                  </li>
                ))}
              </ul>
            ) : (
              <Text>{t("users.permissions.empty")}</Text>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
