import { cn } from "@/src/lib/cn";

const variants = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900",
} as const;

export const Alert = ({
  title,
  description,
  variant = "info",
}: {
  title: string;
  description?: string;
  variant?: keyof typeof variants;
}) => {
  return (
    <div className={cn("rounded-md border p-4", variants[variant])}>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description ? <p className="mt-1 text-sm">{description}</p> : null}
    </div>
  );
};
