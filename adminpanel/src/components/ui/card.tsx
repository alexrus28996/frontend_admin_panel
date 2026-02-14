import { cn } from "@/src/lib/cn";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <section className={cn("rounded-xl border border-zinc-200 bg-white p-6", className)}>{children}</section>;
