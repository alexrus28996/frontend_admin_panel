'use client';

import { cn } from '@/lib/utils';

interface LoadingProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function Loading({ text, className, size = 'md' }: LoadingProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-20', className)}
      role="status"
      aria-label={text || 'Loading'}
    >
      <div className="relative">
        <div className={cn('animate-spin rounded-full border-2 border-slate-200 border-t-blue-600', sizeClasses[size])} />
      </div>
      {text && <p className="mt-4 text-[13px] font-medium text-slate-500">{text}</p>}
    </div>
  );
}
