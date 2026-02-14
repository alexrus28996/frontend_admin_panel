import { cn } from "@/src/lib/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-surface-muted", className)} aria-hidden="true" />
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={`row-${index}`} className="h-9 w-full" />
    ))}
  </div>
);
