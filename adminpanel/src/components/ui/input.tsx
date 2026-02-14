import { cn } from "@/src/lib/cn";

export const Input = ({
  id,
  value,
  onChange,
  placeholder,
  ariaLabel,
  error,
  className,
}: {
  id?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  ariaLabel: string;
  error?: string;
  className?: string;
}) => (
  <div className="w-full">
    <input
      id={id}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full rounded-md border bg-surface px-3 text-sm text-text-primary transition-all duration-200 placeholder:text-text-secondary",
        error ? "border-destructive" : "border-border focus-visible:border-focus-ring",
        className,
      )}
    />
    {error ? (
      <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
        {error}
      </p>
    ) : null}
  </div>
);
