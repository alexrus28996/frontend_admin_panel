'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ordersService, Order, OrdersListResponse } from '@/api/services/orders.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { Search, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [data, setData] = useState<OrdersListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ordersService.getOrders(page, limit, statusFilter || undefined);
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.loadingFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{en.orders.title}</h1>
          <p className="text-muted-foreground mt-1">{en.orders.pageTitle}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{en.common.filter} - All Statuses</option>
          <option value="pending">{en.orders.statuses.pending}</option>
          <option value="processing">{en.orders.statuses.processing}</option>
          <option value="shipped">{en.orders.statuses.shipped}</option>
          <option value="delivered">{en.orders.statuses.delivered}</option>
          <option value="cancelled">{en.orders.statuses.cancelled}</option>
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg mb-6">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      )}

      {/* Empty state */}
      {!loading && data && data.items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{en.orders.noOrders}</p>
        </div>
      )}

      {/* Table */}
      {!loading && data && data.items.length > 0 && (
        <>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.orders.id}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.orders.userId}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.orders.status}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.orders.total}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.orders.paid}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((order) => (
                  <tr key={order.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{order.id?.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.userId?.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      ${Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {order.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={ROUTES.ORDER_DETAIL(order.id)}
                        className="text-primary hover:underline"
                      >
                        {en.orders.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.pages} • Total: {data.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage(Math.min(data.pages, page + 1))}
                  disabled={page === data.pages}
                  className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
