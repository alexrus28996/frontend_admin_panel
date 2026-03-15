'use client';

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-200 appearance-none',
            'bg-white bg-no-repeat bg-[length:16px_16px] bg-[right_0.75rem_center]',
            'bg-[url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%2364748b%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")]',
            'pr-10',
            'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
              : 'border-slate-200 hover:border-slate-300',
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
export default Select;
