import { cn } from "@/src/lib/cn";

export const Input = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  ariaLabel,
  error,
  className,
}: {
  id?: string;
  name?: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  ariaLabel: string;
  error?: string;
  className?: string;
}) => (
  <div className="w-full">
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      autoComplete={autoComplete}
      aria-label={ariaLabel}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full rounded-md border bg-surface px-3 text-sm text-text-primary transition-all duration-200 placeholder:text-text-secondary focus-visible:outline-none",
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
