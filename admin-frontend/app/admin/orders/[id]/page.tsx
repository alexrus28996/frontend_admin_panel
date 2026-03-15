'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, getStatusClasses, handleApiError } from '@/lib/utils';
import type { Order } from '@/lib/types';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Loading from '@/components/ui/loading';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { ArrowLeft, Truck, MessageSquare } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [timelineMessage, setTimelineMessage] = useState('');
  const [shipmentModalOpen, setShipmentModalOpen] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({ carrier: '', tracking: '', service: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ order: Order }>(`/admin/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        handleApiError(err, t('orders.loadFailed'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const updateStatus = async () => {
    if (!newStatus) return;
    setSaving(true);
    try {
      const body: Record<string, string> = {};
      if (newStatus) body.status = newStatus;
      if (newPaymentStatus) body.paymentStatus = newPaymentStatus;
      const data = await api.patch<{ order: Order }>(`/admin/orders/${id}`, body);
      setOrder(data.order);
      setStatusModalOpen(false);
      toast.success(t('orders.statusUpdated'));
    } catch (err) {
      handleApiError(err, t('orders.statusUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const addTimeline = async () => {
    if (!timelineMessage) return;
    setSaving(true);
    try {
      await api.post(`/admin/orders/${id}/timeline`, { type: 'note', message: timelineMessage });
      setTimelineModalOpen(false);
      setTimelineMessage('');
      toast.success(t('orders.noteAdded'));
    } catch (err) {
      handleApiError(err, t('orders.noteAddFailed'));
    } finally {
      setSaving(false);
    }
  };

  const createShipment = async () => {
    setSaving(true);
    try {
      await api.post(`/admin/orders/${id}/shipments`, {
        carrier: shipmentForm.carrier,
        tracking: shipmentForm.tracking,
        service: shipmentForm.service || undefined,
        items: order?.items?.map((item) => ({
          product: item.product,
          variant: item.variant || null,
          name: item.name,
          quantity: item.quantity,
        })),
      });
      setShipmentModalOpen(false);
      toast.success(t('orders.shipmentCreated'));
    } catch (err) {
      handleApiError(err, t('orders.shipmentCreateFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text={t('common.loading')} />;
  if (!order) return <p className="text-center text-slate-500 py-12">{t('orders.notFound')}</p>;

  const userName = typeof order.user === 'object' ? order.user.name : order.user;
  const userEmail = typeof order.user === 'object' ? order.user.email : '';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('common.back')}
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t('orders.order')} #{order._id.slice(-6).toUpperCase()}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setNewStatus(order.status); setNewPaymentStatus(order.paymentStatus); setStatusModalOpen(true); }}>
            {t('orders.updateStatus')}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimelineModalOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-1" /> {t('orders.addNote')}
          </Button>
          <Button size="sm" onClick={() => setShipmentModalOpen(true)}>
            <Truck className="h-4 w-4 mr-1" /> {t('orders.createShipment')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card title={t('orders.orderSummary')} className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-500">{t('common.status')}</p>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${getStatusClasses(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('orders.payment')}</p>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${getStatusClasses(order.paymentStatus)}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('orders.paymentMethod')}</p>
              <p className="text-sm font-medium text-slate-900 mt-1">{order.paymentMethod?.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('common.date')}</p>
              <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">{t('orders.item')}</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase">{t('orders.qty')}</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase">{t('orders.price')}</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase">{t('common.total')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items?.map((item) => (
                  <tr key={item.product || item.name}>
                    <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 text-right">{formatCurrency(item.price, item.currency)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">{formatCurrency(item.price * item.quantity, item.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Totals & Customer */}
        <div className="space-y-8">
          <Card title={t('orders.totals')}>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">{t('orders.subtotal')}</span><span>{formatCurrency(order.subtotal, order.currency)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-slate-500">{t('orders.discount')}</span><span className="text-red-600">-{formatCurrency(order.discount, order.currency)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-slate-500">{t('orders.shipping')}</span><span>{formatCurrency(order.shipping, order.currency)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">{t('orders.tax')}</span><span>{formatCurrency(order.tax, order.currency)}</span></div>
              <div className="flex justify-between text-sm font-bold border-t pt-2"><span>{t('common.total')}</span><span>{formatCurrency(order.total, order.currency)}</span></div>
              {order.couponCode && <div className="text-sm text-slate-500 mt-2">{t('orders.coupon')}: <Badge>{order.couponCode}</Badge></div>}
            </div>
          </Card>

          <Card title={t('orders.customer')}>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              {userEmail && <p className="text-sm text-slate-500">{userEmail}</p>}
            </div>
          </Card>

          {order.shippingAddress && (
            <Card title={t('orders.shippingAddress')}>
              <div className="text-sm text-slate-600 space-y-0.5">
                {order.shippingAddress.fullName && <p className="font-medium">{order.shippingAddress.fullName}</p>}
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title={t('orders.updateOrderStatus')}>
        <div className="space-y-4">
          <Select
            label={t('orders.newStatus')}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={[
              { value: 'pending', label: t('orders.pending') },
              { value: 'paid', label: t('orders.paid') },
              { value: 'shipped', label: t('orders.shipped') },
              { value: 'delivered', label: t('orders.delivered') },
              { value: 'cancelled', label: t('orders.cancelled') },
            ]}
          />
          <Select
            label={t('orders.paymentStatus')}
            value={newPaymentStatus}
            onChange={(e) => setNewPaymentStatus(e.target.value)}
            options={[
              { value: '', label: t('orders.noChange') },
              { value: 'unpaid', label: t('orders.unpaid') },
              { value: 'paid', label: t('orders.paid') },
              { value: 'refunded', label: t('orders.refunded') },
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={updateStatus} loading={saving}>{t('common.update')}</Button>
          </div>
        </div>
      </Modal>

      {/* Timeline Modal */}
      <Modal isOpen={timelineModalOpen} onClose={() => setTimelineModalOpen(false)} title={t('orders.timelineNote')}>
        <div className="space-y-4">
          <Textarea label={t('orders.message')} value={timelineMessage} onChange={(e) => setTimelineMessage(e.target.value)} rows={3} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setTimelineModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={addTimeline} loading={saving}>{t('orders.addNote')}</Button>
          </div>
        </div>
      </Modal>

      {/* Shipment Modal */}
      <Modal isOpen={shipmentModalOpen} onClose={() => setShipmentModalOpen(false)} title={t('orders.createShipment')}>
        <div className="space-y-4">
          <Input label={t('orders.carrier')} value={shipmentForm.carrier} onChange={(e) => setShipmentForm({ ...shipmentForm, carrier: e.target.value })} placeholder={t('orders.carrierPlaceholder')} required />
          <Input label={t('orders.trackingNumber')} value={shipmentForm.tracking} onChange={(e) => setShipmentForm({ ...shipmentForm, tracking: e.target.value })} required />
          <Input label={t('orders.service')} value={shipmentForm.service} onChange={(e) => setShipmentForm({ ...shipmentForm, service: e.target.value })} placeholder={t('orders.servicePlaceholder')} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShipmentModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={createShipment} loading={saving}>{t('common.create')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
