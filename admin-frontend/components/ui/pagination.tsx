'use client';

import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
}

export default function Pagination({
  page: currentPage,
  pages: totalPages,
  onPageChange,
  total: totalItems,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) pages.push('ellipsis');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('ellipsis');

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pages = getVisiblePages();

  const itemStart = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const itemEnd = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      {/* Item count */}
      {totalItems != null && (
        <p className="text-[13px] text-slate-500 order-2 sm:order-1">
          {t('pagination.showing', {
            from: String(itemStart ?? 1),
            to: String(itemEnd ?? 1),
            total: String(totalItems),
          })}
        </p>
      )}

      {/* Navigation */}
      <nav
        className="flex items-center gap-1 order-1 sm:order-2"
        aria-label="Pagination"
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'inline-flex items-center justify-center rounded-xl px-2.5 py-2 text-sm transition-all',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
            currentPage === 1
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center w-9 h-9 text-sm text-slate-400"
            >
              &#8230;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                page === currentPage
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'inline-flex items-center justify-center rounded-xl px-2.5 py-2 text-sm transition-all',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
            currentPage === totalPages
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
