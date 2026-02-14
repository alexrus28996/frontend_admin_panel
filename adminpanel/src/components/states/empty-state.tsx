"use client";

import { useI18n } from "@/src/i18n/providers/i18n-provider";

export const EmptyState = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-md border border-dashed border-zinc-300 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-zinc-900">{title ?? t("common.noData")}</p>
      <p className="mt-2 text-sm text-zinc-600">{description ?? t("common.emptyDescription")}</p>
    </div>
  );
};
