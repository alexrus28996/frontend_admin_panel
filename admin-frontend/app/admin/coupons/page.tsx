'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';
import { formatCurrency, formatDate, handleApiError } from '@/lib/utils';
import type { Coupon, PaginatedResponse } from '@/lib/types';
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
import { Plus, Edit, Trash2 } from 'lucide-react';

const initial = {
  code: '',
  description: '',
  type: 'percent' as 'percent' | 'fixed',
  value: 0,
  minSubtotal: 0,
  globalLimit: 0,
  perUserLimit: 0,
  expiresAt: '',
  isActive: true,
  includeCategories: '',
  includeProducts: '',
  excludeCategories: '',
  excludeProducts: '',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedResponse<Coupon>>(`/admin/coupons?page=${page}&limit=${limit}`);
      setCoupons(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('coupons.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const openCreate = () => {
    setEditing(null);
    setForm(initial);
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      description: c.description || '',
      type: c.type,
      value: c.value,
      minSubtotal: c.minSubtotal || 0,
      globalLimit: c.globalLimit || 0,
      perUserLimit: c.perUserLimit || 0,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      isActive: c.isActive,
      includeCategories: (c.includeCategories || []).join(', '),
      includeProducts: (c.includeProducts || []).join(', '),
      excludeCategories: (c.excludeCategories || []).join(', '),
      excludeProducts: (c.excludeProducts || []).join(', '),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.value) {
      toast.error(t('coupons.codeAndValueRequired'));
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        code: form.code,
        description: form.description || undefined,
        type: form.type,
        value: Number(form.value),
        minSubtotal: Number(form.minSubtotal) || undefined,
        globalLimit: Number(form.globalLimit) || undefined,
        perUserLimit: Number(form.perUserLimit) || undefined,
        expiresAt: form.expiresAt || undefined,
        isActive: form.isActive,
      };
      if (form.includeCategories) {
        payload.includeCategories = form.includeCategories.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (form.includeProducts) {
        payload.includeProducts = form.includeProducts.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (form.excludeCategories) {
        payload.excludeCategories = form.excludeCategories.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (form.excludeProducts) {
        payload.excludeProducts = form.excludeProducts.split(',').map(s => s.trim()).filter(Boolean);
      }

      if (editing) {
        await api.put(`/admin/coupons/${editing._id}`, payload);
        toast.success(t('coupons.updated'));
      } else {
        await api.post('/admin/coupons', payload);
        toast.success(t('coupons.created'));
      }
      setModalOpen(false);
      fetchCoupons();
    } catch (err) {
      handleApiError(err, t('coupons.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('coupons.deleteConfirm'))) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success(t('coupons.deleted'));
      fetchCoupons();
    } catch (err) {
      handleApiError(err, t('coupons.deleteFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('coupons.title')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('coupons.subtitle')}</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> {t('coupons.newCoupon')}</Button>
      </div>

      <Card>
        {loading ? <Loading text={t('common.loading')} /> : coupons.length === 0 ? (
          <EmptyState title={t('coupons.noCoupons')} description={t('coupons.noCouponsDesc')} action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> {t('common.create')}</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('coupons.code')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('coupons.type')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('coupons.value')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('coupons.minSubtotal')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('coupons.usage')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('coupons.expires')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coupons.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{c.code}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 capitalize">{c.type}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">
                      {c.type === 'percent' ? `${c.value}%` : formatCurrency(c.value)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 text-right">
                      {c.minSubtotal ? formatCurrency(c.minSubtotal) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-500">
                      {c.usageCount || 0}{c.globalLimit ? ` / ${c.globalLimit}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {c.expiresAt ? formatDate(c.expiresAt) : t('coupons.noExpiry')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={c.isActive ? 'success' : 'default'}>{c.isActive ? t('common.active') : t('common.inactive')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(c._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > limit && <div className="mt-4"><Pagination page={page} pages={Math.ceil(total / limit)} onPageChange={setPage} total={total} /></div>}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('coupons.editCoupon') : t('coupons.newCoupon')} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('coupons.code')} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
          <Select label={t('coupons.type')} value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} options={[{ value: 'percent', label: t('coupons.percent') }, { value: 'fixed', label: t('coupons.fixed') }]} />
          <div className="col-span-2">
            <Input label={t('coupons.description')} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <Input label={t('coupons.value')} type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} required />
          <Input label={t('coupons.minSubtotal')} type="number" value={form.minSubtotal} onChange={e => setForm({ ...form, minSubtotal: Number(e.target.value) })} />
          <Input label={t('coupons.globalLimit')} type="number" value={form.globalLimit} onChange={e => setForm({ ...form, globalLimit: Number(e.target.value) })} />
          <Input label={t('coupons.perUserLimit')} type="number" value={form.perUserLimit} onChange={e => setForm({ ...form, perUserLimit: Number(e.target.value) })} />
          <Input label={t('coupons.expiresAt')} type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} />
          <div />
          <div className="col-span-2">
            <Input label={t('coupons.includeCategoriesHelp')} value={form.includeCategories} onChange={e => setForm({ ...form, includeCategories: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Input label={t('coupons.includeProductsHelp')} value={form.includeProducts} onChange={e => setForm({ ...form, includeProducts: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Input label={t('coupons.excludeCategoriesHelp')} value={form.excludeCategories} onChange={e => setForm({ ...form, excludeCategories: e.target.value })} placeholder={t('coupons.excludeCategoriesPlaceholder')} />
          </div>
          <div className="col-span-2">
            <Input label={t('coupons.excludeProductsHelp')} value={form.excludeProducts} onChange={e => setForm({ ...form, excludeProducts: e.target.value })} placeholder={t('coupons.excludeProductsPlaceholder')} />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded border-slate-300" />
            <label htmlFor="isActive" className="text-sm text-slate-700">{t('common.active')}</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} loading={saving}>{editing ? t('common.update') : t('common.create')}</Button>
        </div>
      </Modal>
    </div>
  );
}
