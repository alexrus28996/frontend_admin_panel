import { cn } from "@/src/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

const styles: Record<ButtonVariant, string> = {
  primary:
    "border border-primary bg-primary text-surface shadow-sm hover:scale-[1.01] hover:brightness-95 active:scale-[0.99]",
  secondary:
    "border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-muted hover:scale-[1.01] active:scale-[0.99]",
  ghost: "border border-transparent bg-transparent text-text-primary hover:bg-surface-muted",
  destructive:
    "border border-destructive bg-destructive text-surface shadow-sm hover:brightness-95 hover:scale-[1.01] active:scale-[0.99]",
};

export const Button = ({
  children,
  className,
  type = "button",
  disabled,
  onClick,
  variant = "primary",
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  variant?: ButtonVariant;
  ariaLabel?: string;
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    aria-label={ariaLabel}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
      styles[variant],
      className,
    )}
  >
    {children}
  </button>
);
