"use client";

import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { MutedText, PageTitle, Text } from "@/src/components/ui/typography";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

export default function SessionExpiredPage() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <PageTitle className="text-2xl">{t("auth.sessionExpired.title")}</PageTitle>
          <MutedText>{t("auth.sessionExpired.subtitle")}</MutedText>
        </CardHeader>
        <CardContent className="space-y-6">
          <Text>{t("auth.sessionExpired.description")}</Text>
          <Link href={APP_ROUTES.auth.login}>
            <Button className="w-full" ariaLabel={t("auth.sessionExpired.cta")}>{t("auth.sessionExpired.cta")}</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
