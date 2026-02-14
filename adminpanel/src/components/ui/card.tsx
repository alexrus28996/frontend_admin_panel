import { cn } from "@/src/lib/cn";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section
    className={cn(
      "relative overflow-hidden rounded-xl border border-border bg-surface shadow-[0_2px_8px_rgba(15,23,42,0.06)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/35 before:to-transparent",
      className,
    )}
  >
    {children}
  </section>
);

export const CardHeader = ({
  children,
  className,
  description,
  actions,
}: {
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) => (
  <header className={cn("flex items-start justify-between gap-4 border-b border-border px-6 py-6", className)}>
    <div className="space-y-1">
      {children}
      {description ? <p className="text-xs text-text-secondary">{description}</p> : null}
    </div>
    {actions ? <div className="shrink-0">{actions}</div> : null}
  </header>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-6 py-6", className)}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <footer className={cn("border-t border-border px-6 py-6", className)}>{children}</footer>
);
