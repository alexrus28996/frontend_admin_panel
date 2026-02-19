'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersService, Order, Shipment } from '@/api/services/orders.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    paid: false,
  });

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const [orderData, shipmentsData] = await Promise.all([
          ordersService.getOrderById(orderId),
          ordersService.getOrderShipments(orderId),
        ]);
        setOrder(orderData);
        setShipments(shipmentsData);
        setFormData({
          status: orderData.status || '',
          paid: orderData.paid || false,
        });
      } catch (err: any) {
        setError(err.response?.data?.error?.message || en.errors.loadingFailed);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await ordersService.updateOrder(orderId, formData);
      setOrder(updated);
      alert(en.common.success);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Link href={ROUTES.ORDERS} className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={20} />
          {en.common.back}
        </Link>
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
          <AlertCircle size={20} />
          <p>{error || en.orders.notFound}</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      {/* Back button */}
      <Link href={ROUTES.ORDERS} className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={20} />
        {en.common.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{en.orders.id}: {order.id?.slice(0, 12)}</h1>
        <p className="text-muted-foreground mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">{en.common.edit}</h2>

          <div className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.orders.status}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Status</option>
                <option value="pending">{en.orders.statuses.pending}</option>
                <option value="processing">{en.orders.statuses.processing}</option>
                <option value="shipped">{en.orders.statuses.shipped}</option>
                <option value="delivered">{en.orders.statuses.delivered}</option>
                <option value="cancelled">{en.orders.statuses.cancelled}</option>
              </select>
            </div>

            {/* Paid */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.orders.paid}</label>
              <select
                value={formData.paid ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, paid: e.target.value === 'yes' })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? en.forms.submitting : en.common.save}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order info card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4">{en.orders.title}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">{en.orders.id}</p>
                <p className="text-sm font-mono">{order.id?.slice(0, 16)}...</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">{en.orders.userId}</p>
                <p className="text-sm font-mono">{order.userId?.slice(0, 16)}...</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">{en.orders.total}</p>
                <p className="text-lg font-bold">${Number(order.total || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">{en.orders.status}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize mt-1 ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {order.status || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipments card */}
          {shipments.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold mb-4">{en.orders.shipments}</h3>
              <div className="space-y-3">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="p-3 bg-background rounded-lg border border-border text-sm">
                    <p className="font-mono text-xs text-muted-foreground">{shipment.id?.slice(0, 12)}</p>
                    <p className="mt-1">{shipment.carrier} - {shipment.trackingNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
