'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, handleApiError } from '@/lib/utils';
import type { SalesReport, TopProduct, TopCustomer } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { t } from '@/lib/i18n';

export default function ReportsPage() {
  const [salesData, setSalesData] = useState<{ _id: string; revenue: number; orders: number }[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupBy, setGroupBy] = useState('day');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ groupBy });
      if (startDate) params.set('from', startDate);
      if (endDate) params.set('to', endDate);
      const [sales, products, customers] = await Promise.all([
        api.get<SalesReport>(`/admin/reports/sales?${params}`),
        api.get<{ items: TopProduct[] }>('/admin/reports/top-products?limit=10'),
        api.get<{ items: TopCustomer[] }>('/admin/reports/top-customers?limit=10'),
      ]);
      setSalesData(sales.series || []);
      setTopProducts(products.items || []);
      setTopCustomers(customers.items || []);
    } catch (err) {
      handleApiError(err, t('reports.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, groupBy]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const totalRevenue = salesData.reduce((s, d) => s + (d.revenue || 0), 0);
  const totalOrders = salesData.reduce((s, d) => s + (d.orders || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('reports.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('reports.subtitle')}</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input label={t('reports.startDate')} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <Input label={t('reports.endDate')} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <Select label={t('reports.groupBy')} value={groupBy} onChange={e => setGroupBy(e.target.value)} options={[
            { value: 'day', label: t('reports.daily') },
            { value: 'week', label: t('reports.weekly') },
            { value: 'month', label: t('reports.monthly') },
          ]} />
          <div className="flex items-end">
            <Button onClick={fetchReports} className="w-full">{t('reports.generate')}</Button>
          </div>
        </div>
      </Card>

      {loading ? <Loading text={t('common.loading')} /> : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <p className="text-sm text-slate-500">{t('reports.totalRevenue')}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenue)}</p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">{t('reports.totalOrders')}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{totalOrders.toLocaleString()}</p>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card title={t('reports.revenueOverTime')}>
            {salesData.length ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-slate-500 text-center py-8">{t('reports.noSalesData')}</p>}
          </Card>

          {/* Orders Chart */}
          <Card title={t('reports.ordersOverTime')}>
            {salesData.length ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-slate-500 text-center py-8">{t('reports.noSalesData')}</p>}
          </Card>

          {/* Top Products & Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={t('reports.topProducts')}>
              <div className="divide-y">
                {topProducts.map((p) => (
                  <div key={p.productId || p.name} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.name || t('reports.unknownProduct')}</p>
                      <p className="text-xs text-slate-500">{t('reports.soldCount', { count: p.totalQuantity })}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(p.totalRevenue)}</p>
                  </div>
                ))}
                {topProducts.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">{t('common.noData')}</p>}
              </div>
            </Card>

            <Card title={t('reports.topCustomers')}>
              <div className="divide-y">
                {topCustomers.map((c) => (
                  <div key={c.userId || c.email} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.name || c.email || t('reports.unknownCustomer')}</p>
                      <p className="text-xs text-slate-500">{t('reports.ordersCount', { count: c.totalOrders })}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(c.totalRevenue)}</p>
                  </div>
                ))}
                {topCustomers.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">{t('common.noData')}</p>}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
