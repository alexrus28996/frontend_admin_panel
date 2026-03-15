'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';
import { handleApiError } from '@/lib/utils';
import type { InventoryLocation, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import Select from '@/components/ui/select';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

const initialForm = { name: '', code: '', type: 'WAREHOUSE' as string, active: true, priority: 0, lat: '', lng: '', pincode: '', country: '', region: '' };

export default function LocationsPage() {
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryLocation | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedResponse<InventoryLocation>>(`/admin/inventory/locations?page=${page}&limit=${limit}`);
      setLocations(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('inventoryLocations.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (loc: InventoryLocation) => {
    setEditing(loc);
    setForm({
      name: loc.name,
      code: loc.code || '',
      type: loc.type,
      active: loc.active,
      priority: loc.priority || 0,
      lat: loc.geo?.lat?.toString() || '',
      lng: loc.geo?.lng?.toString() || '',
      pincode: loc.geo?.pincode || '',
      country: loc.geo?.country || '',
      region: loc.geo?.region || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error(t('inventoryLocations.nameRequired')); return; }
    setSaving(true);
    try {
      const geo = (form.lat || form.lng || form.pincode || form.country || form.region) ? {
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        pincode: form.pincode || undefined,
        country: form.country || undefined,
        region: form.region || undefined,
      } : undefined;
      const payload = {
        name: form.name,
        code: form.code || undefined,
        type: form.type,
        active: form.active,
        priority: Number(form.priority) || 0,
        geo,
      };
      if (editing) {
        await api.put(`/admin/inventory/locations/${editing._id}`, payload);
        toast.success(t('inventoryLocations.updated'));
      } else {
        await api.post('/admin/inventory/locations', payload);
        toast.success(t('inventoryLocations.created'));
      }
      setModalOpen(false);
      fetchLocations();
    } catch (err) {
      handleApiError(err, t('inventoryLocations.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('inventoryLocations.deleteConfirm'))) return;
    try {
      await api.delete(`/admin/inventory/locations/${id}`);
      toast.success(t('inventoryLocations.deleted'));
      fetchLocations();
    } catch (err) {
      handleApiError(err, t('inventoryLocations.deleteFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('inventoryLocations.title')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('inventory.locationsSubtitle')}</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> {t('inventoryLocations.addLocation')}</Button>
      </div>

      <Card>
        {loading ? <Loading text={t('common.loading')} /> : locations.length === 0 ? (
          <EmptyState icon={MapPin} title={t('inventoryLocations.noLocations')} description={t('inventoryLocations.noLocationsDesc')} action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> {t('common.add')}</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventoryLocations.code')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.type')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {locations.map(loc => (
                  <tr key={loc._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{loc.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-500">{loc.code || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{loc.type}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={loc.active ? 'success' : 'default'}>{loc.active ? t('common.active') : t('common.inactive')}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(loc)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(loc._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('inventoryLocations.editLocation') : t('inventoryLocations.addLocation')}>
        <div className="space-y-4">
          <Input label={t('common.name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label={t('inventoryLocations.code')} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder={t('inventoryLocations.codePlaceholder')} />
          <Select label={t('inventoryLocations.locationType')} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={[{ value: 'WAREHOUSE', label: t('inventoryLocations.warehouse') }, { value: 'STORE', label: t('inventoryLocations.store') }, { value: 'DROPSHIP', label: t('inventoryLocations.dropship') }, { value: 'BUFFER', label: t('inventoryLocations.buffer') }]} />
          <Input label={t('inventoryLocations.priority')} type="number" value={form.priority} onChange={e => setForm({ ...form, priority: Number(e.target.value) })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('inventoryLocations.latitude')} value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} placeholder="40.7128" />
            <Input label={t('inventoryLocations.longitude')} value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} placeholder="-74.006" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label={t('inventoryLocations.pincode')} value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="10001" />
            <Input label={t('inventoryLocations.country')} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="US" />
            <Input label={t('inventoryLocations.region')} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} placeholder="Northeast" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="locActive" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded border-slate-300" />
            <label htmlFor="locActive" className="text-sm text-slate-700">{t('common.active')}</label>
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
