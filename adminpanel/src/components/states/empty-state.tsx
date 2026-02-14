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
    <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-secondary">◌</div>
      <p className="text-lg font-semibold text-text-primary">{title ?? t("common.noData")}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">{description ?? t("common.emptyDescription")}</p>
      <p className="mt-2 text-xs text-text-secondary">{t("table.emptyHint")}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4" variant="secondary" onClick={onAction} ariaLabel={actionLabel}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
