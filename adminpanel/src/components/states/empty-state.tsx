"use client";

import { Button } from "@/src/components/ui/button";
import { useI18n } from "@/src/i18n/providers/i18n-provider";

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <p className="text-base font-semibold text-text-primary">{title ?? t("common.noData")}</p>
      <p className="mt-2 text-sm text-text-secondary">{description ?? t("common.emptyDescription")}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4" variant="secondary" onClick={onAction} ariaLabel={actionLabel}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
