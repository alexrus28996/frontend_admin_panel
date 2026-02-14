"use client";

import { useMemo } from "react";

import { useAuth } from "@/src/auth/providers/auth-provider";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { hasAnyRole } from "@/src/permissions/permission-service";
import { Alert } from "@/src/components/ui/alert";

import type { AppRole } from "@/src/permissions/types";

export const RoleGuard = ({
  roles,
  children,
  fallback,
}: {
  roles: AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { user } = useAuth();
  const { t } = useI18n();

  const canAccess = useMemo(() => {
    if (!user) {
      return false;
    }

    return hasAnyRole(user.roles, roles);
  }, [roles, user]);

  if (canAccess) {
    return <>{children}</>;
  }

  return (
    fallback ?? (
      <Alert variant="warning" title={t("common.unauthorized")} description={t("common.emptyDescription")} />
    )
  );
};
