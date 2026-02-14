import { cn } from "@/src/lib/cn";

const styles = {
  info: "border-primary/30 bg-primary/10 text-primary",
  warning: "border-warning/30 bg-warning/10 text-warning",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
} as const;

export const AlertBanner = ({
  title,
  description,
  variant = "info",
}: {
  title: string;
  description?: string;
  variant?: keyof typeof styles;
}) => (
  <div className={cn("rounded-md border px-4 py-3", styles[variant])} role="status" aria-live="polite">
    <h3 className="text-sm font-semibold">{title}</h3>
    {description ? <p className="mt-1 text-sm">{description}</p> : null}
  </div>
);
