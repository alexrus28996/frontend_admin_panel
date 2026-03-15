'use client';

import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={4}
          className={cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-200 resize-y',
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
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[13px] text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && <p className="mt-1.5 text-[13px] text-slate-400">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export default Textarea;
