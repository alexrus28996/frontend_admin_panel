import { cn } from "@/src/lib/cn";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <section className={cn("rounded-xl border border-border bg-surface shadow-sm", className)}>{children}</section>
);

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <header className={cn("border-b border-border px-6 py-4", className)}>{children}</header>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-6 py-4", className)}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <footer className={cn("border-t border-border px-6 py-4", className)}>{children}</footer>
);
