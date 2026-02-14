"use client";

import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { MutedText, PageTitle, Text } from "@/src/components/ui/typography";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

export default function ForbiddenPage() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl shadow-md">
        <CardHeader>
          <PageTitle className="text-2xl">{t("errors.forbidden.title")}</PageTitle>
          <MutedText>{t("errors.forbidden.subtitle")}</MutedText>
        </CardHeader>
        <CardContent className="space-y-6">
          <Text>{t("errors.forbidden.description")}</Text>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={APP_ROUTES.admin.dashboard}>
              <Button className="w-full" ariaLabel={t("errors.forbidden.dashboardCta")}>{t("errors.forbidden.dashboardCta")}</Button>
            </Link>
            <Link href={APP_ROUTES.auth.logout}>
              <Button variant="secondary" className="w-full" ariaLabel={t("errors.forbidden.logoutCta")}>{t("errors.forbidden.logoutCta")}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
