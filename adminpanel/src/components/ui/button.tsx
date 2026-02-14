import { cn } from "@/src/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

const styles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-surface hover:opacity-90",
  secondary: "bg-surface text-text-primary border border-border hover:bg-surface-muted",
  ghost: "bg-transparent text-text-primary hover:bg-surface-muted",
  destructive: "bg-destructive text-surface hover:opacity-90",
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
      "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
      styles[variant],
      className,
    )}
  >
    {children}
  </button>
);
