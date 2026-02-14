"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageTitle, SectionTitle, Text } from "@/src/components/ui/typography";
import { ROLES } from "@/src/constants/roles";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { usersService } from "@/src/modules/users/services/users.service";
import { RoleGuard } from "@/src/permissions/role-guard";

import type { UserDetailsResponse } from "@/src/modules/users/types";

const readSummaryEntries = (data: Record<string, unknown>): Array<{ key: string; value: string }> =>
  Object.entries(data)
    .slice(0, 8)
    .map(([key, value]) => ({
      key,
      value: typeof value === "string" || typeof value === "number" || typeof value === "boolean"
        ? String(value)
        : JSON.stringify(value),
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
      const message = nextError instanceof Error ? nextError.message : t("errors.general");
      setError(message);
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
      const message = nextError instanceof Error ? nextError.message : t("errors.general");
      setError(message);
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
      const message = nextError instanceof Error ? nextError.message : t("errors.general");
      setError(message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle>{t("users.actions.view")}</PageTitle>

      {error ? <AlertBanner variant="error" title={t("users.error.title")} description={error} /> : null}

      <Card>
        <CardHeader>
          <SectionTitle>{t("users.detail.title")}</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <Text>{t("users.actions.loading")}</Text>
          ) : summary.length ? (
            summary.map((entry) => (
              <div key={entry.key} className="grid grid-cols-1 gap-1 md:grid-cols-[180px_1fr]">
                <Text className="font-semibold text-text-secondary">{entry.key}</Text>
                <Text>{entry.value}</Text>
              </div>
            ))
          ) : (
            <Text>{t("users.empty.description")}</Text>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>{t("users.permissions.title")}</SectionTitle>
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
                    <Button
                      variant="destructive"
                      disabled={mutating}
                      onClick={() => void onRemovePermission(permission)}
                    >
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
  );
}
