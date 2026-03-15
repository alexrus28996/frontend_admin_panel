'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ' +
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
      'select-none cursor-pointer active:scale-[0.97]';

    const variants: Record<string, string> = {
      primary:
        'bg-gradient-to-b from-blue-500 to-blue-600 text-white ' +
        'hover:from-blue-600 hover:to-blue-700 ' +
        'focus-visible:ring-blue-500 ' +
        'shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.12)]',
      secondary:
        'bg-slate-100 text-slate-700 ' +
        'hover:bg-slate-200 ' +
        'focus-visible:ring-slate-400',
      danger:
        'bg-gradient-to-b from-red-500 to-red-600 text-white ' +
        'hover:from-red-600 hover:to-red-700 ' +
        'focus-visible:ring-red-500 ' +
        'shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.12)]',
      success:
        'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white ' +
        'hover:from-emerald-600 hover:to-emerald-700 ' +
        'focus-visible:ring-emerald-500 ' +
        'shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.12)]',
      ghost:
        'text-slate-500 hover:text-slate-700 hover:bg-slate-100 ' +
        'focus-visible:ring-slate-400',
      outline:
        'border border-slate-200 text-slate-700 bg-white ' +
        'hover:bg-slate-50 hover:border-slate-300 ' +
        'focus-visible:ring-blue-500 ' +
        'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
    };

    const sizes: Record<string, string> = {
      xs: 'px-2.5 py-1 text-xs gap-1 rounded-lg',
      sm: 'px-3 py-1.5 text-[13px] gap-1.5 rounded-lg',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-2.5 text-[15px] gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
