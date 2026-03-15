'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-20 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="mb-5 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 p-5 ring-1 ring-slate-200/50">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] text-slate-500 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
