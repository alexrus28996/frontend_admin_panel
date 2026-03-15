'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, formatCurrency, generateIdempotencyKey, handleApiError } from '@/lib/utils';
import type { ReturnRequest, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import Textarea from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { Check, X, RotateCcw } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

const statusBadge: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  requested: 'warning',
  approved: 'info',
  received: 'success',
  rejected: 'danger',
  refunded: 'success',
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [approveForm, setApproveForm] = useState({ amount: 0, locationId: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [saving, setSaving] = useState(false);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      const data = await api.get<PaginatedResponse<ReturnRequest>>(`/admin/returns?${params}`);
      setReturns(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('returns.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  const openApprove = (r: ReturnRequest) => {
    setSelectedReturn(r);
    setApproveForm({ amount: 0, locationId: '' });
    setApproveModalOpen(true);
  };

  const openReject = (r: ReturnRequest) => {
    setSelectedReturn(r);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedReturn) return;
    setSaving(true);
    try {
      await api.post(`/admin/returns/${selectedReturn._id}/approve`, {
        locationId: approveForm.locationId || undefined,
        items: selectedReturn.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
        })),
        amount: Number(approveForm.amount),
      }, {
        idempotencyKey: generateIdempotencyKey('approve-return', selectedReturn._id),
      });
      toast.success(t('returns.approved'));
      setApproveModalOpen(false);
      fetchReturns();
    } catch (err) {
      handleApiError(err, t('returns.approveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReturn) return;
    setSaving(true);
    try {
      await api.post(`/admin/returns/${selectedReturn._id}/reject`, {
        reason: rejectReason || undefined,
      });
      toast.success(t('returns.rejected'));
      setRejectModalOpen(false);
      fetchReturns();
    } catch (err) {
      handleApiError(err, t('returns.rejectFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('returns.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('returns.subtitle')}</p>
      </div>

      <Card>
        <div className="mb-4 max-w-xs">
          <Select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: t('returns.allStatuses') },
              { value: 'requested', label: t('returns.requested') },
              { value: 'approved', label: t('returns.approvedStatus') },
              { value: 'received', label: t('returns.received') },
              { value: 'rejected', label: t('returns.rejectedStatus') },
              { value: 'refunded', label: t('returns.refunded') },
            ]}
          />
        </div>

        {loading ? <Loading text={t('common.loading')} /> : returns.length === 0 ? (
          <EmptyState icon={RotateCcw} title={t('returns.noReturns')} description={t('returns.noReturnsDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.id')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('returns.order')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('returns.reason')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('returns.items')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.createdAt')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {returns.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-500">{r._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 font-mono">
                      {typeof r.order === 'object' ? (r.order.orderNumber || r.order._id.slice(-6).toUpperCase()) : (r.order?.slice(-6).toUpperCase() ?? '—')}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 max-w-xs truncate">{r.reason}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">{r.items.length}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={statusBadge[r.status] || 'default'}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {r.status === 'requested' && (
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openApprove(r)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openReject(r)}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > limit && <div className="mt-4"><Pagination page={page} pages={Math.ceil(total / limit)} onPageChange={setPage} total={total} /></div>}
      </Card>

      {/* Approve Modal */}
      <Modal isOpen={approveModalOpen} onClose={() => setApproveModalOpen(false)} title={t('returns.approveReturn')}>
        <div className="space-y-4">
          <Input label={t('returns.refundAmount')} type="number" step="0.01" value={approveForm.amount} onChange={e => setApproveForm({ ...approveForm, amount: Number(e.target.value) })} required />
          <Input label={t('returns.locationForRestock')} value={approveForm.locationId} onChange={e => setApproveForm({ ...approveForm, locationId: e.target.value })} placeholder={t('returns.leaveBlankRestock')} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setApproveModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleApprove} loading={saving}>{t('returns.approve')}</Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title={t('returns.rejectReturn')}>
        <div className="space-y-4">
          <Textarea label={t('returns.rejectionReason')} value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={handleReject} loading={saving}>{t('returns.reject')}</Button>
        </div>
      </Modal>
    </div>
  );
}
