import { cn } from "@/src/lib/cn";

export const Button = ({
  children,
  className,
  type = "button",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
};
