"use client";

import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { MutedText, PageTitle, Text } from "@/src/components/ui/typography";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

export default function DashboardPage() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <PageTitle>{t("app.foundationTitle")}</PageTitle>
      </CardHeader>
      <CardContent>
        <Text>{t("app.foundationSubtitle")}</Text>
        <MutedText className="mt-2">{t("app.description")}</MutedText>
      </CardContent>
    </Card>
  );
}
