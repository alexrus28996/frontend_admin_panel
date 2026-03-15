'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, handleApiError } from '@/lib/utils';
import type { ShippingZone, ShippingMethod } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Globe } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function ShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [zoneForm, setZoneForm] = useState({ name: '', countries: '', states: '', postalCodePatterns: '', isActive: true, priority: 0 });
  const [methodForm, setMethodForm] = useState({ zones: '' as string, name: '', code: '', description: '', rateType: 'flat' as string, flatRate: 0, minSubtotal: 0, freeAbove: 0, estimatedMinDays: 0, estimatedMaxDays: 0, currency: 'USD', sortOrder: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      /* GET /shipping/zones and GET /shipping/methods (NOT /admin/ prefix) */
      const [zData, mData] = await Promise.all([
        api.get<{ zones: ShippingZone[] }>('/shipping/zones'),
        api.get<{ items: ShippingMethod[] }>('/shipping/methods'),
      ]);
      setZones(zData.zones || []);
      setMethods(mData.items || (mData as unknown as ShippingMethod[]) || []);
    } catch (err) {
      handleApiError(err, t('shipping.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Zone CRUD
  const openCreateZone = () => {
    setEditingZone(null);
    setZoneForm({ name: '', countries: '', states: '', postalCodePatterns: '', isActive: true, priority: 0 });
    setZoneModalOpen(true);
  };

  const openEditZone = (z: ShippingZone) => {
    setEditingZone(z);
    setZoneForm({
      name: z.name,
      countries: (z.countries || []).join(', '),
      states: (z.states || []).join(', '),
      postalCodePatterns: (z.postalCodePatterns || []).join(', '),
      isActive: z.isActive,
      priority: z.priority || 0,
    });
    setZoneModalOpen(true);
  };

  const saveZone = async () => {
    if (!zoneForm.name) { toast.error(t('shipping.nameRequired')); return; }
    setSaving(true);
    try {
      const payload = {
        name: zoneForm.name,
        countries: zoneForm.countries.split(',').map(s => s.trim()).filter(Boolean),
        states: zoneForm.states ? zoneForm.states.split(',').map(s => s.trim()).filter(Boolean) : [],
        postalCodePatterns: zoneForm.postalCodePatterns ? zoneForm.postalCodePatterns.split(',').map(s => s.trim()).filter(Boolean) : [],
        isActive: zoneForm.isActive,
        priority: Number(zoneForm.priority) || 0,
      };
      if (editingZone) {
        /* PATCH /shipping/zones/:id */
        await api.patch(`/shipping/zones/${editingZone._id}`, payload);
        toast.success(t('shipping.zoneUpdated'));
      } else {
        /* POST /shipping/zones */
        await api.post('/shipping/zones', payload);
        toast.success(t('shipping.zoneCreated'));
      }
      setZoneModalOpen(false);
      fetchData();
    } catch (err) {
      handleApiError(err, t('shipping.zoneSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deleteZone = async (id: string) => {
    if (!confirm(t('shipping.deleteZoneConfirm'))) return;
    try {
      await api.delete(`/shipping/zones/${id}`);
      toast.success(t('shipping.zoneDeleted'));
      fetchData();
    } catch (err) {
      handleApiError(err, t('shipping.zoneDeleteFailed'));
    }
  };

  // Method CRUD
  const openCreateMethod = () => {
    setEditingMethod(null);
    setMethodForm({ zones: zones[0]?._id || '', name: '', code: '', description: '', rateType: 'flat', flatRate: 0, minSubtotal: 0, freeAbove: 0, estimatedMinDays: 0, estimatedMaxDays: 0, currency: 'USD', sortOrder: 0, isActive: true });
    setMethodModalOpen(true);
  };

  const openEditMethod = (m: ShippingMethod) => {
    setEditingMethod(m);
    setMethodForm({
      zones: m.zones?.[0] || '',
      name: m.name,
      code: m.code || '',
      description: m.description || '',
      rateType: m.rateType,
      flatRate: m.flatRate || 0,
      minSubtotal: m.minSubtotal || 0,
      freeAbove: m.freeAbove || 0,
      estimatedMinDays: m.estimatedMinDays || 0,
      estimatedMaxDays: m.estimatedMaxDays || 0,
      currency: m.currency || 'USD',
      sortOrder: m.sortOrder || 0,
      isActive: m.isActive,
    });
    setMethodModalOpen(true);
  };

  const saveMethod = async () => {
    if (!methodForm.name || !methodForm.zones) { toast.error(t('shipping.nameAndZoneRequired')); return; }
    setSaving(true);
    try {
      const payload = {
        zones: [methodForm.zones],
        name: methodForm.name,
        code: methodForm.code || methodForm.name.toUpperCase().replace(/\s+/g, '_'),
        description: methodForm.description || undefined,
        rateType: methodForm.rateType,
        flatRate: Number(methodForm.flatRate) || 0,
        minSubtotal: Number(methodForm.minSubtotal) || 0,
        freeAbove: Number(methodForm.freeAbove) || undefined,
        estimatedMinDays: Number(methodForm.estimatedMinDays) || undefined,
        estimatedMaxDays: Number(methodForm.estimatedMaxDays) || undefined,
        currency: methodForm.currency || 'USD',
        sortOrder: Number(methodForm.sortOrder) || 0,
        isActive: methodForm.isActive,
      };
      if (editingMethod) {
        /* PATCH /shipping/methods/:id */
        await api.patch(`/shipping/methods/${editingMethod._id}`, payload);
        toast.success(t('shipping.methodUpdated'));
      } else {
        /* POST /shipping/methods */
        await api.post('/shipping/methods', payload);
        toast.success(t('shipping.methodCreated'));
      }
      setMethodModalOpen(false);
      fetchData();
    } catch (err) {
      handleApiError(err, t('shipping.methodSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deleteMethod = async (id: string) => {
    if (!confirm(t('shipping.deleteMethodConfirm'))) return;
    try {
      await api.delete(`/shipping/methods/${id}`);
      toast.success(t('shipping.methodDeleted'));
      fetchData();
    } catch (err) {
      handleApiError(err, t('shipping.methodDeleteFailed'));
    }
  };

  if (loading) return <Loading text={t('common.loading')} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('shipping.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('shipping.subtitle')}</p>
      </div>

      {/* Zones */}
      <Card title={t('shipping.zones')} action={<Button size="sm" onClick={openCreateZone}><Plus className="h-4 w-4 mr-1" /> {t('shipping.addZone')}</Button>}>
        {zones.length === 0 ? (
          <EmptyState icon={Globe} title={t('shipping.noZones')} description={t('shipping.noZonesDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.countries')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.states')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.priority')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {zones.map(z => (
                  <tr key={z._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{z.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{(z.countries || []).join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{(z.states || []).join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 text-center">{z.priority ?? 0}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={z.isActive ? 'success' : 'default'}>{z.isActive ? t('common.active') : t('common.inactive')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditZone(z)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteZone(z._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Methods */}
      <Card title={t('shipping.methods')} action={<Button size="sm" onClick={openCreateMethod}><Plus className="h-4 w-4 mr-1" /> {t('shipping.addMethod')}</Button>}>
        {methods.length === 0 ? (
          <EmptyState title={t('shipping.noMethods')} description={t('shipping.noMethodsDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.zone')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.rateType')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.flatRate')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.estimatedDays')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {methods.map(m => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{m.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {zones.find(z => m.zones?.includes(z._id))?.name || m.zones?.[0] || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 capitalize">{m.rateType.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">{formatCurrency(m.flatRate || 0)}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{m.estimatedMinDays && m.estimatedMaxDays ? `${m.estimatedMinDays}-${m.estimatedMaxDays}` : '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={m.isActive ? 'success' : 'default'}>{m.isActive ? t('common.active') : t('common.inactive')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditMethod(m)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteMethod(m._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Zone Modal */}
      <Modal isOpen={zoneModalOpen} onClose={() => setZoneModalOpen(false)} title={editingZone ? t('shipping.editZone') : t('shipping.newZone')}>
        <div className="space-y-4">
          <Input label={t('common.name')} value={zoneForm.name} onChange={e => setZoneForm({ ...zoneForm, name: e.target.value })} required />
          <Input label={t('shipping.countriesHelp')} value={zoneForm.countries} onChange={e => setZoneForm({ ...zoneForm, countries: e.target.value })} placeholder="US, CA, GB, DE" />
          <Input label={t('shipping.statesHelp')} value={zoneForm.states} onChange={e => setZoneForm({ ...zoneForm, states: e.target.value })} placeholder="NY, CA, TX" />
          <Input label={t('shipping.postalPatterns')} value={zoneForm.postalCodePatterns} onChange={e => setZoneForm({ ...zoneForm, postalCodePatterns: e.target.value })} placeholder="^1\\d{4}$" />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('shipping.priority')} type="number" value={zoneForm.priority} onChange={e => setZoneForm({ ...zoneForm, priority: Number(e.target.value) })} />
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="zoneActive" checked={zoneForm.isActive} onChange={e => setZoneForm({ ...zoneForm, isActive: e.target.checked })} className="rounded border-slate-300" />
              <label htmlFor="zoneActive" className="text-sm text-slate-700">{t('common.active')}</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setZoneModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={saveZone} loading={saving}>{editingZone ? t('common.update') : t('common.create')}</Button>
        </div>
      </Modal>

      {/* Method Modal */}
      <Modal isOpen={methodModalOpen} onClose={() => setMethodModalOpen(false)} title={editingMethod ? t('shipping.editMethod') : t('shipping.newMethod')} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('common.name')} value={methodForm.name} onChange={e => setMethodForm({ ...methodForm, name: e.target.value })} required />
          <Input label={t('shipping.methodCode')} value={methodForm.code} onChange={e => setMethodForm({ ...methodForm, code: e.target.value })} placeholder={t('shipping.codePlaceholder')} />
          <Select label={t('shipping.zone')} value={methodForm.zones} onChange={e => setMethodForm({ ...methodForm, zones: e.target.value })} options={zones.map(z => ({ value: z._id, label: z.name }))} />
          <Select label={t('shipping.rateType')} value={methodForm.rateType} onChange={e => setMethodForm({ ...methodForm, rateType: e.target.value })}
            options={[
              { value: 'flat', label: t('shipping.flat') },
              { value: 'weight_based', label: t('shipping.weightBased') },
              { value: 'price_based', label: t('shipping.priceBased') },
              { value: 'free', label: t('shipping.free') },
            ]} />
          <Input label={t('shipping.flatRate')} type="number" value={methodForm.flatRate} onChange={e => setMethodForm({ ...methodForm, flatRate: Number(e.target.value) })} />
          <Input label={t('shipping.minSubtotal')} type="number" value={methodForm.minSubtotal} onChange={e => setMethodForm({ ...methodForm, minSubtotal: Number(e.target.value) })} />
          <Input label={t('shipping.freeAbove')} type="number" value={methodForm.freeAbove} onChange={e => setMethodForm({ ...methodForm, freeAbove: Number(e.target.value) })} />
          <Input label={t('shipping.currency')} value={methodForm.currency} onChange={e => setMethodForm({ ...methodForm, currency: e.target.value })} placeholder="USD" maxLength={3} />
          <Input label={t('shipping.estMinDays')} type="number" value={methodForm.estimatedMinDays} onChange={e => setMethodForm({ ...methodForm, estimatedMinDays: Number(e.target.value) })} />
          <Input label={t('shipping.estMaxDays')} type="number" value={methodForm.estimatedMaxDays} onChange={e => setMethodForm({ ...methodForm, estimatedMaxDays: Number(e.target.value) })} />
          <Input label={t('shipping.sortOrder')} type="number" value={methodForm.sortOrder} onChange={e => setMethodForm({ ...methodForm, sortOrder: Number(e.target.value) })} />
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="methodActive" checked={methodForm.isActive} onChange={e => setMethodForm({ ...methodForm, isActive: e.target.checked })} className="rounded border-slate-300" />
            <label htmlFor="methodActive" className="text-sm text-slate-700">{t('common.active')}</label>
          </div>
          <div className="col-span-2">
            <Input label={t('common.description')} value={methodForm.description} onChange={e => setMethodForm({ ...methodForm, description: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setMethodModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={saveMethod} loading={saving}>{editingMethod ? t('common.update') : t('common.create')}</Button>
        </div>
      </Modal>
    </div>
  );
}
