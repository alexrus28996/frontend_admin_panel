'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export default function Card({
  children,
  className = '',
  title,
  description,
  action,
  noPadding,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden',
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[15px] font-semibold text-slate-900 leading-6 tracking-tight">{title}</h3>
            )}
            {description && (
              <p className="text-[13px] text-slate-500 mt-0.5 leading-5">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'px-6 py-5'}>{children}</div>
    </div>
  );
}
