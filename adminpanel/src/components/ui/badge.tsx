import { cn } from "@/src/lib/cn";

type BadgeVariant = "default" | "success" | "warning" | "destructive";

const styles: Record<BadgeVariant, string> = {
  default: "bg-surface-muted text-text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

export const Badge = ({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) => <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", styles[variant], className)}>{children}</span>;
