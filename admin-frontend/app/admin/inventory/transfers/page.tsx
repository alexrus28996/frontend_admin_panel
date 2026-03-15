'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';
import { formatDate, handleApiError } from '@/lib/utils';
import type { TransferOrder, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Plus, ArrowRight, Send, Truck, CheckCircle } from 'lucide-react';

const statusBadge: Record<string, 'default' | 'info' | 'warning' | 'success'> = {
  DRAFT: 'default',
  REQUESTED: 'info',
  IN_TRANSIT: 'warning',
  RECEIVED: 'success',
};

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    fromLocationId: '',
    toLocationId: '',
    productId: '',
    qty: 1,
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      const data = await api.get<PaginatedResponse<TransferOrder>>(`/admin/inventory/transfers?${params}`);
      setTransfers(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('inventoryTransfers.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchTransfers(); }, [fetchTransfers]);

  const handleCreate = async () => {
    if (!createForm.fromLocationId || !createForm.toLocationId || !createForm.productId) {
      toast.error(t('inventoryTransfers.fillRequired'));
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/inventory/transfers', {
        fromLocationId: createForm.fromLocationId,
        toLocationId: createForm.toLocationId,
        lines: [{ productId: createForm.productId, variantId: null, qty: createForm.qty }],
        metadata: createForm.notes ? { reason: createForm.notes } : undefined,
      });
      toast.success(t('inventoryTransfers.created'));
      setCreateModalOpen(false);
      setCreateForm({ fromLocationId: '', toLocationId: '', productId: '', qty: 1, notes: '' });
      fetchTransfers();
    } catch (err) {
      handleApiError(err, t('inventoryTransfers.createFailed'));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (transferId: string, status: string) => {
    try {
      await api.patch(`/admin/inventory/transfers/${transferId}/status`, { status });
      toast.success(t('inventoryTransfers.statusUpdated'));
      fetchTransfers();
    } catch (err) {
      handleApiError(err, t('inventoryTransfers.updateFailed'));
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'DRAFT': return { label: t('inventoryTransfers.request'), status: 'REQUESTED', icon: Send };
      case 'REQUESTED': return { label: t('inventoryTransfers.ship'), status: 'IN_TRANSIT', icon: Truck };
      case 'IN_TRANSIT': return { label: t('inventoryTransfers.receive'), status: 'RECEIVED', icon: CheckCircle };
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('inventoryTransfers.title')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('inventory.transfersSubtitle')}</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4 mr-1" /> {t('inventoryTransfers.newTransfer')}</Button>
      </div>

      <Card>
        <div className="mb-4">
          <Select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: t('inventoryTransfers.allStatuses') },
              { value: 'DRAFT', label: t('inventoryTransfers.draft') },
              { value: 'REQUESTED', label: t('inventoryTransfers.requested') },
              { value: 'IN_TRANSIT', label: t('inventoryTransfers.inTransit') },
              { value: 'RECEIVED', label: t('inventoryTransfers.received') },
            ]}
          />
        </div>

        {loading ? <Loading text={t('common.loading')} /> : transfers.length === 0 ? (
          <EmptyState title={t('inventoryTransfers.noTransfers')} description={t('inventoryTransfers.noTransfersDesc')} action={<Button onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4 mr-1" /> {t('inventoryTransfers.newTransfer')}</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.id')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventoryTransfers.fromTo')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventoryTransfers.items')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.createdAt')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transfers.map(transfer => {
                  const next = getNextAction(transfer.status);
                  const fromName = typeof transfer.fromLocationId === 'object' ? transfer.fromLocationId.name : transfer.fromLocationId;
                  const toName = typeof transfer.toLocationId === 'object' ? transfer.toLocationId.name : transfer.toLocationId;
                  return (
                    <tr key={transfer._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{transfer._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        <span className="flex items-center gap-1">
                          {fromName} <ArrowRight className="h-3 w-3 text-slate-400" /> {toName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 text-right">{transfer.lines?.length || 0}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={statusBadge[transfer.status] || 'default'}>{transfer.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDate(transfer.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        {next && (
                          <Button variant="outline" size="sm" onClick={() => updateStatus(transfer._id, next.status)}>
                            <next.icon className="h-3 w-3 mr-1" /> {next.label}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {total > limit && <div className="mt-4"><Pagination page={page} pages={Math.ceil(total / limit)} onPageChange={setPage} total={total} /></div>}
      </Card>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title={t('inventoryTransfers.createTransfer')}>
        <div className="space-y-4">
          <Input label={t('inventoryTransfers.fromLocation')} value={createForm.fromLocationId} onChange={e => setCreateForm({ ...createForm, fromLocationId: e.target.value })} required />
          <Input label={t('inventoryTransfers.toLocation')} value={createForm.toLocationId} onChange={e => setCreateForm({ ...createForm, toLocationId: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('inventoryTransfers.productId')} value={createForm.productId} onChange={e => setCreateForm({ ...createForm, productId: e.target.value })} required />
            <Input label={t('inventoryTransfers.qty')} type="number" min={1} value={createForm.qty} onChange={e => setCreateForm({ ...createForm, qty: Number(e.target.value) })} required />
          </div>
          <Input label={t('inventoryTransfers.notes')} value={createForm.notes} onChange={e => setCreateForm({ ...createForm, notes: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleCreate} loading={saving}>{t('common.create')}</Button>
        </div>
      </Modal>
    </div>
  );
}
