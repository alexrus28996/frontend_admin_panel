import { cn } from "@/src/lib/cn";

import type { ComponentPropsWithoutRef } from "react";

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "aria-label"> & {
  ariaLabel: string;
  error?: string;
};

export const Input = ({ id, ariaLabel, error, className, ...props }: InputProps) => (
  <div className="w-full">
    <input
      id={id}
      aria-label={ariaLabel}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "h-10 w-full rounded-md border bg-surface px-3 text-sm text-text-primary shadow-xs transition-all duration-200 placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        error ? "border-destructive" : "border-border hover:border-focus-ring/45 focus-visible:border-focus-ring",
        className,
      )}
      {...props}
    />
    {error ? (
      <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
        {error}
      </p>
    ) : null}
  </div>
);
