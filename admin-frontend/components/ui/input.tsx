'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-200',
            'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500',
            'placeholder:text-slate-400',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500 bg-red-50/30'
              : 'border-slate-200 bg-white hover:border-slate-300',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-[13px] text-red-600 flex items-center gap-1" role="alert">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7 5a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0V5Zm1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
