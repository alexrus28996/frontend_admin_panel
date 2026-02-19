'use client';

import { useEffect, useState } from 'react';
import { dashboardService, DashboardMetrics } from '@/api/services/dashboard.service';
import en from '@/messages/en.json';
import { Users, TrendingUp, Package, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';

const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) => (
  <div className="bg-card border border-border rounded-lg p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-2">{value.toLocaleString()}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || en.errors.loadingFailed);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{en.common.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
        <AlertCircle size={20} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{en.dashboard.title}</h1>
        <p className="text-muted-foreground mt-1">Welcome back to your admin dashboard</p>
      </div>

      {/* Metrics grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title={en.dashboard.totalUsers}
            value={metrics.usersTotal}
            icon={Users}
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard
            title={en.dashboard.activeUsers}
            value={metrics.usersActive}
            icon={Users}
            color="bg-green-100 text-green-600"
          />
          <MetricCard
            title={en.dashboard.totalProducts}
            value={metrics.productsCount}
            icon={Package}
            color="bg-purple-100 text-purple-600"
          />
          <MetricCard
            title={en.dashboard.totalOrders}
            value={metrics.ordersTotal}
            icon={ShoppingCart}
            color="bg-orange-100 text-orange-600"
          />
          <MetricCard
            title={en.dashboard.admins}
            value={metrics.adminsCount}
            icon={TrendingUp}
            color="bg-pink-100 text-pink-600"
          />
          <MetricCard
            title={en.dashboard.revenue + ' - ' + en.dashboard.last7Days}
            value={`$${metrics.revenueLast7Days.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={DollarSign}
            color="bg-emerald-100 text-emerald-600"
          />
        </div>
      )}

      {/* Orders by status */}
      {metrics && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{en.dashboard.ordersByStatus}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(metrics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="p-4 bg-background rounded-lg border border-border text-center">
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
                <p className="text-2xl font-bold mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
