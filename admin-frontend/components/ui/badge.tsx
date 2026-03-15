'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantClasses: Record<string, string> = {
  default: 'bg-slate-50 text-slate-600 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
};

export default function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ring-1 ring-inset leading-5 whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
