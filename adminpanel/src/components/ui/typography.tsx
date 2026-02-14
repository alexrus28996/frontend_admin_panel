import { cn } from "@/src/lib/cn";

export const PageTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h1 className={cn("text-3xl font-semibold tracking-tight text-text-primary", className)}>{children}</h1>
);

export const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-xl font-semibold tracking-tight text-text-primary", className)}>{children}</h2>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("text-lg font-semibold text-text-primary", className)}>{children}</h3>
);

export const Text = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-sm leading-6 text-text-primary", className)}>{children}</p>
);

export const MutedText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-xs leading-5 text-text-secondary", className)}>{children}</p>
);
