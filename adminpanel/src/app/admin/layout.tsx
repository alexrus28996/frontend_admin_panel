"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/src/auth/providers/auth-provider";
import { AdminShell } from "@/src/components/layout/admin-shell";
import { Skeleton } from "@/src/components/states/skeleton";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(APP_ROUTES.auth.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="p-6" aria-label={t("common.loading")} data-pathname={pathname}>
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
