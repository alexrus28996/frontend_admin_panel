"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { CardTitle, MutedText, PageTitle, Text } from "@/src/components/ui/typography";
import { ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { usersService } from "@/src/modules/users/services/users.service";
import { normalizeObject, normalizePermissions } from "@/src/modules/users/utils/response-normalizer";

import type { UnknownRecord } from "@/src/modules/users/types";

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



export default function AdminUserDetailsPage() {
  const { t } = useI18n();
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [userInfo, setUserInfo] = useState<UnknownRecord | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionInput, setPermissionInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setLoading(true);

    try {
      const response = await usersService.getUserById(userId);
      setUserInfo(normalizeObject(response));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("users.errors.loadFailed"));
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, [t, userId]);

  const loadPermissions = useCallback(async () => {
    setPermissionsLoading(true);

    try {
      const response = await usersService.getUserPermissions(userId);
      setPermissions(normalizePermissions(response));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("users.errors.loadFailed"));
      setPermissions([]);
    } finally {
      setPermissionsLoading(false);
    }
  }, [t, userId]);

  useEffect(() => {
    setError(null);
    void Promise.all([loadUser(), loadPermissions()]);
  }, [loadPermissions, loadUser]);

  const userEntries = useMemo(() => Object.entries(userInfo ?? {}), [userInfo]);

  const onAddPermission = async () => {
    const value = permissionInput.trim();
    if (!value) {
      return;
    }

    setMutating(true);

    try {
      await usersService.addUserPermission(userId, [value]);
      setPermissionInput("");
      await loadPermissions();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("users.errors.loadFailed"));
    } finally {
      setMutating(false);
    }
  };

  const onRemovePermission = async (permission: string) => {
    setMutating(true);

    try {
      await usersService.removeUserPermission(userId, [permission]);
      await loadPermissions();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("users.errors.loadFailed"));
    } finally {
      setMutating(false);
    }
  };

  const onReplacePermissions = async () => {
    setMutating(true);

    try {
      await usersService.replacePermissions(userId, permissions);
      await loadPermissions();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("users.errors.loadFailed"));
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <Link href={ROUTES.admin.users} className="inline-flex text-sm text-text-secondary hover:text-text-primary">
          ← {t("users.back")}
        </Link>
        <div className="space-y-1">
          <PageTitle>{t("users.title")}</PageTitle>
          <MutedText>{t("users.subtitle")}</MutedText>
        </div>
      </section>

      {error ? <AlertBanner variant="error" title={t("users.errors.loadFailed")} description={error} /> : null}

      <Card>
        <CardHeader>
          <CardTitle>{t("users.infoTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Text>{t("users.loading")}</Text>
          ) : userEntries.length ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {userEntries.map(([key, value]) => (
                <div key={key} className="rounded-lg border border-border bg-surface-elevated p-3">
                  <MutedText>{key}</MutedText>
                  <Text>{toDisplayValue(value)}</Text>
                </div>
              ))}
            </div>
          ) : (
            <Text>{t("users.emptyDescription")}</Text>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("users.permissions.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              id="add-permission"
              value={permissionInput}
              ariaLabel={t("users.permissions.add")}
              placeholder={t("users.permissions.add")}
              onChange={(event) => setPermissionInput(event.target.value)}
            />
            <Button disabled={mutating || !permissionInput.trim()} onClick={() => void onAddPermission()}>
              {mutating ? t("users.loading") : t("users.permissions.add")}
            </Button>
            <Button
              variant="secondary"
              disabled={mutating}
              onClick={() => void onReplacePermissions()}
            >
              {t("users.permissions.replace")}
            </Button>
          </div>

          <MutedText>{t("users.permissions.replaceHint")}</MutedText>

          {permissionsLoading ? (
            <Text>{t("users.loading")}</Text>
          ) : permissions.length ? (
            <ul className="flex flex-wrap gap-2">
              {permissions.map((permission) => (
                <li key={permission} className="inline-flex items-center gap-2">
                  <Badge>{permission}</Badge>
                  <Button className="h-8 px-3" variant="destructive" disabled={mutating} onClick={() => void onRemovePermission(permission)}>
                    {t("users.permissions.remove")}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <Text>{t("users.emptyDescription")}</Text>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
