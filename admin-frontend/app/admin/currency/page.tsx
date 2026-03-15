'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { handleApiError } from '@/lib/utils';
import type { CurrencyRate } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function CurrencyPage() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CurrencyRate | null>(null);
  const [form, setForm] = useState({ baseCurrency: 'USD', currency: '', rate: 1, source: 'manual' });
  const [saving, setSaving] = useState(false);

  /* GET /admin/currency-rates */
  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ rates: CurrencyRate[] }>('/admin/currency-rates');
      setRates(data.rates || []);
    } catch (err) {
      handleApiError(err, t('currency.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const openCreate = () => {
    setEditing(null);
    setForm({ baseCurrency: 'USD', currency: '', rate: 1, source: 'manual' });
    setModalOpen(true);
  };

  const openEdit = (r: CurrencyRate) => {
    setEditing(r);
    setForm({ baseCurrency: r.baseCurrency, currency: r.currency, rate: r.rate, source: r.source || 'manual' });
    setModalOpen(true);
  };

  /* POST /admin/currency-rates (upsert) */
  const handleSave = async () => {
    if (!form.baseCurrency || !form.currency || !form.rate) {
      toast.error(t('currency.allFieldsRequired'));
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/currency-rates', {
        baseCurrency: form.baseCurrency.toUpperCase(),
        currency: form.currency.toUpperCase(),
        rate: Number(form.rate),
        source: form.source || 'manual',
      });
      toast.success(editing ? t('currency.updated') : t('currency.created'));
      setModalOpen(false);
      fetchRates();
    } catch (err) {
      handleApiError(err, t('currency.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  /* DELETE /admin/currency-rates/:currency */
  const handleDelete = async (r: CurrencyRate) => {
    if (!confirm(t('currency.deleteConfirm'))) return;
    try {
      const params = r.baseCurrency ? `?baseCurrency=${r.baseCurrency}` : '';
      await api.delete(`/admin/currency-rates/${r.currency}${params}`);
      toast.success(t('currency.deleted'));
      fetchRates();
    } catch (err) {
      handleApiError(err, t('currency.deleteFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('currency.title')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('currency.subtitle')}</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> {t('currency.addRate')}</Button>
      </div>

      <Card>
        {loading ? <Loading text={t('common.loading')} /> : rates.length === 0 ? (
          <EmptyState icon={DollarSign} title={t('currency.noRates')} description={t('currency.noRatesDesc')} action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> {t('common.add')}</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('currency.baseCurrency')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('currency.targetCurrency')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('currency.rate')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('currency.source')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rates.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{r.baseCurrency}</td>
                    <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{r.currency}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right font-mono">{r.rate.toFixed(4)}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{r.source || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(r)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('currency.editRate') : t('currency.newRate')}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('currency.baseCurrency')} value={form.baseCurrency} onChange={e => setForm({ ...form, baseCurrency: e.target.value })} placeholder="USD" maxLength={3} required />
            <Input label={t('currency.targetCurrency')} value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} placeholder="EUR" maxLength={3} required />
          </div>
          <Input label={t('currency.rate')} type="number" step="0.0001" value={form.rate} onChange={e => setForm({ ...form, rate: Number(e.target.value) })} required />
          <Select
            label={t('currency.source')}
            value={form.source}
            onChange={e => setForm({ ...form, source: e.target.value })}
            options={[
              { value: 'manual', label: t('currency.manual') },
              { value: 'api', label: t('currency.apiSource') },
            ]}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} loading={saving}>{t('common.save')}</Button>
        </div>
      </Modal>
    </div>
  );
}
