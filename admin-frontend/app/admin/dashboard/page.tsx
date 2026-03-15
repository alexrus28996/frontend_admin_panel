'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, handleApiError } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { DashboardMetrics, SalesReport, TopProduct, TopCustomer } from '@/lib/types';
import StatCard from '@/components/ui/stat-card';
import Card from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import Badge from '@/components/ui/badge';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [sales, setSales] = useState<SalesReport | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [m, s, tp, tc] = await Promise.all([
          api.get<DashboardMetrics>('/admin/metrics'),
          api.get<SalesReport>('/admin/reports/sales?groupBy=day'),
          api.get<{ items: TopProduct[] }>('/admin/reports/top-products?limit=5'),
          api.get<{ items: TopCustomer[] }>('/admin/reports/top-customers?limit=5'),
        ]);
        setMetrics(m);
        setSales(s);
        setTopProducts(tp.items || []);
        setTopCustomers(tc.items || []);
      } catch (err) {
        handleApiError(err, t('common.error'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading text={t('common.loading')} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={t('dashboard.totalUsers')}
          value={metrics?.usersTotal?.toLocaleString() ?? '0'}
          icon={<Users className="h-5 w-5" />}
          change={t('dashboard.activeUsers') + `: ${metrics?.usersActive ?? 0}`}
          changeType="positive"
          helpText={t('dashboard.totalUsersHelp')}
        />
        <StatCard
          title={t('dashboard.totalProducts')}
          value={metrics?.productsCount?.toLocaleString() ?? '0'}
          icon={<Package className="h-5 w-5" />}
          helpText={t('dashboard.totalProductsHelp')}
        />
        <StatCard
          title={t('dashboard.totalOrders')}
          value={metrics?.ordersTotal?.toLocaleString() ?? '0'}
          icon={<ShoppingCart className="h-5 w-5" />}
          helpText={t('dashboard.totalOrdersHelp')}
        />
        <StatCard
          title={t('dashboard.revenueLast7Days')}
          value={formatCurrency(metrics?.revenueLast7Days ?? 0)}
          icon={<DollarSign className="h-5 w-5" />}
          changeType="positive"
          helpText={t('dashboard.revenueHelp')}
        />
      </div>

      {/* Orders by Status */}
      {metrics?.ordersByStatus && (
        <Card title={t('dashboard.ordersByStatus')} description={t('dashboard.ordersByStatusHelp')}>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metrics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <Badge
                  variant={
                    status === 'delivered' ? 'success' :
                    status === 'cancelled' ? 'danger' :
                    status === 'pending' ? 'warning' :
                    status === 'paid' ? 'info' : 'default'
                  }
                >
                  {status}: {count}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('dashboard.revenueOverTime')} description={t('dashboard.revenueChartHelp')}>
          {sales?.series && sales.series.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sales.series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-[13px] text-slate-500 py-8 text-center">{t('common.noData')}</p>
          )}
        </Card>

        <Card title={t('dashboard.ordersOverTime')} description={t('dashboard.ordersChartHelp')}>
          {sales?.series && sales.series.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sales.series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-[13px] text-slate-500 py-8 text-center">{t('common.noData')}</p>
          )}
        </Card>
      </div>

      {/* Top Products & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('dashboard.topProducts')} description={t('dashboard.topProductsHelp')}>
          {topProducts.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {topProducts.map((p, i) => (
                <div key={`product-${p.productId || i}`} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-xs font-semibold text-blue-600 flex-shrink-0">
                      {i + 1}
                    </span>
                    <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-[13px] font-medium text-slate-900 truncate">{p.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-[13px] text-slate-600">{t('reports.soldCount', { count: p.totalQuantity })}</span>
                    <span className="text-[13px] text-slate-400 ml-2">({formatCurrency(p.totalRevenue)})</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-slate-500 py-4 text-center">{t('common.noData')}</p>
          )}
        </Card>

        <Card title={t('dashboard.topCustomers')} description={t('dashboard.topCustomersHelp')}>
          {topCustomers.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {topCustomers.map((c, i) => (
                <div key={`customer-${c.userId || i}`} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-50 text-xs font-semibold text-amber-600 flex-shrink-0">
                      {i + 1}
                    </span>
                    <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500 truncate">{c.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-[13px] font-medium text-slate-900">{formatCurrency(c.totalRevenue)}</p>
                    <p className="text-xs text-slate-500">{c.totalOrders} {t('dashboard.orders').toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-slate-500 py-4 text-center">{t('common.noData')}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
