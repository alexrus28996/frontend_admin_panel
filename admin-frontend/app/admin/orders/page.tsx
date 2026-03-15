'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, getStatusClasses, handleApiError } from '@/lib/utils';
import type { Order, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { Search, Eye } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: APP_CONFIG.defaultPageSize.toString() });
      if (status) params.set('status', status);
      if (paymentStatus) params.set('paymentStatus', paymentStatus);
      const data = await api.get<PaginatedResponse<Order>>(`/admin/orders?${params}`);
      setOrders(data.items || []);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      handleApiError(err, t('orders.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, status, paymentStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const getUserName = (user: Order['user']) => {
    if (typeof user === 'object' && user !== null) return user.name;
    return String(user);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('orders.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('orders.subtitle')}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: t('orders.allStatuses') },
            { value: 'pending', label: t('orders.pending') },
            { value: 'paid', label: t('orders.paid') },
            { value: 'shipped', label: t('orders.shipped') },
            { value: 'delivered', label: t('orders.delivered') },
            { value: 'cancelled', label: t('orders.cancelled') },
            { value: 'refunded', label: t('orders.refunded') },
          ]}
        />
        <Select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: t('orders.allPayments') },
            { value: 'unpaid', label: t('orders.unpaid') },
            { value: 'paid', label: t('orders.paid') },
            { value: 'refunded', label: t('orders.refunded') },
          ]}
        />
      </div>

      {loading ? <Loading text={t('common.loading')} /> : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('orders.order')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('orders.customer')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('orders.payment')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.total')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('orders.items')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.date')}</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{getUserName(order.user)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {formatCurrency(order.total, order.currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{order.items?.length || 0}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
