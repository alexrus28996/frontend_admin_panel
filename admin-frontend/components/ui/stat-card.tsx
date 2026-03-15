'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
  helpText?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  changeType,
  className,
  helpText,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-200',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-slate-300/80',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-slate-500 truncate">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 tracking-tight tabular-nums">{value}</p>
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/50 p-2.5 text-blue-600 transition-colors group-hover:from-blue-100 group-hover:to-blue-100">
            {icon}
          </div>
        )}
      </div>

      {(change || helpText) && (
        <div className="mt-3 flex items-center gap-2">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[13px] font-semibold',
                changeType === 'positive' && 'text-emerald-600',
                changeType === 'negative' && 'text-red-600',
                (!changeType || changeType === 'neutral') && 'text-slate-500',
              )}
            >
              {changeType === 'positive' && <TrendingUp className="h-3.5 w-3.5" />}
              {changeType === 'negative' && <TrendingDown className="h-3.5 w-3.5" />}
              {change}
            </span>
          )}
          {helpText && <span className="text-[12px] text-slate-400">{helpText}</span>}
        </div>
      )}
    </div>
  );
}
