"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/src/auth/providers/auth-provider";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Skeleton } from "@/src/components/states/skeleton";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { MutedText, PageTitle } from "@/src/components/ui/typography";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

export default function LogoutPage() {
  const { t } = useI18n();
  const { logout } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        await logout();
      } catch {
        setError(true);
      }
    };

    void run();
  }, [logout]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <PageTitle className="text-2xl">{t("auth.logout.title")}</PageTitle>
          <MutedText>{t("auth.logout.description")}</MutedText>
        </CardHeader>
        <CardContent>
          {error ? (
            <AlertBanner variant="error" title={t("common.error")} description={t("auth.logout.failed")} />
          ) : (
            <div className="space-y-3" aria-label={t("common.loading")}>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
