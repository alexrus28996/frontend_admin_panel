import { cn } from "@/src/lib/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-zinc-200", className)} />
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={`row-${index}`} className="h-10 w-full" />
    ))}
  </div>
);
