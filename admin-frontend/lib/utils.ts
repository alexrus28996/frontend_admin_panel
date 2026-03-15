// ============================================================
// Utility functions — no hardcoded locale or color values
// ============================================================

import { format, formatDistanceToNow } from 'date-fns';
import { APP_CONFIG } from './config';
import { ApiError } from './api';
import toast from 'react-hot-toast';

// --------------- API error handler ---------------
/**
 * Parse an API error and show user-friendly toast(s).
 * If the error is an ApiError with validation details, each field error
 * is shown as a separate toast so the user knows exactly what went wrong.
 */
export function handleApiError(err: unknown, fallbackMessage: string): void {
  if (err instanceof ApiError) {
    // Show field-level validation errors when available
    if (err.details && err.details.length > 0) {
      err.details.forEach((d) => {
        const field = d.path ? `${d.path}: ` : '';
        toast.error(`${field}${d.message}`);
      });
      return;
    }
    // Show the API error message (e.g. "BRAND_HAS_PRODUCTS", "CATEGORY_HAS_CHILDREN")
    toast.error(err.message || fallbackMessage);
    return;
  }
  // Network errors, unexpected exceptions, etc.
  if (err instanceof Error && err.message) {
    toast.error(err.message);
    return;
  }
  toast.error(fallbackMessage);
}

// --------------- Class name helper ---------------
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// --------------- Date formatters ---------------
export function formatDate(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  try {
    return format(new Date(isoString), 'MMM d, yyyy');
  } catch {
    return '—';
  }
}

export function formatDateTime(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  try {
    return format(new Date(isoString), 'MMM d, yyyy HH:mm');
  } catch {
    return '—';
  }
}

export function formatRelativeTime(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  try {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true });
  } catch {
    return '—';
  }
}

// --------------- Currency formatter ---------------
export function formatCurrency(
  amount: number | undefined | null,
  currency: string = APP_CONFIG.defaultCurrency,
): string {
  if (amount == null) return '—';
  try {
    return new Intl.NumberFormat(APP_CONFIG.defaultLocale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

// --------------- Debounce ---------------
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number = APP_CONFIG.searchDebounceMs,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// --------------- Idempotency key generator ---------------
export function generateIdempotencyKey(action: string, resourceId?: string): string {
  const unique = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return resourceId ? `${action}-${resourceId}-${unique}` : `${action}-${unique}`;
}

// --------------- Status badge styling ---------------
const STATUS_BADGE_MAP: Record<string, { bg: string; text: string }> = {
  // Order statuses
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  paid:      { bg: 'bg-blue-100',   text: 'text-blue-800' },
  shipped:   { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  delivered: { bg: 'bg-green-100',  text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100',    text: 'text-red-800' },
  refunded:  { bg: 'bg-gray-100',   text: 'text-gray-800' },
  // Payment statuses
  unpaid:    { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  // Transaction statuses
  succeeded: { bg: 'bg-green-100',  text: 'text-green-800' },
  failed:    { bg: 'bg-red-100',    text: 'text-red-800' },
  // Return statuses
  requested: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved:  { bg: 'bg-green-100',  text: 'text-green-800' },
  rejected:  { bg: 'bg-red-100',    text: 'text-red-800' },
  // Reservation statuses
  active:    { bg: 'bg-green-100',  text: 'text-green-800' },
  expired:   { bg: 'bg-orange-100', text: 'text-orange-800' },
  converted: { bg: 'bg-blue-100',   text: 'text-blue-800' },
  // Transfer statuses
  DRAFT:       { bg: 'bg-gray-100',   text: 'text-gray-800' },
  REQUESTED:   { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  IN_TRANSIT:  { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  RECEIVED:    { bg: 'bg-green-100',  text: 'text-green-800' },
  CANCELLED:   { bg: 'bg-red-100',    text: 'text-red-800' },
  // Shipment statuses
  returned:  { bg: 'bg-orange-100', text: 'text-orange-800' },
  // Generic
  hidden:    { bg: 'bg-gray-100',   text: 'text-gray-600' },
  visible:   { bg: 'bg-green-100',  text: 'text-green-800' },
};

export function getStatusClasses(status: string): string {
  const entry = STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP[status.toLowerCase()];
  if (entry) return `${entry.bg} ${entry.text}`;
  return 'bg-gray-100 text-gray-800';
}

// --------------- String helpers ---------------
export function truncate(str: string, maxLen: number): string {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --------------- Query string builder ---------------
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}
