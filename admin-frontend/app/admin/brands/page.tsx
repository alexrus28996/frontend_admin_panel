'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import type { Brand, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Pagination from '@/components/ui/pagination';
import Modal from '@/components/ui/modal';
import Loading from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', logo: '', description: '' });

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: APP_CONFIG.defaultPageSize.toString() });
      if (search) params.set('q', search);
      const data = await api.get<PaginatedResponse<Brand>>(`/admin/brands?${params}`);
      setBrands(data.items || []);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      handleApiError(err, t('brands.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const openCreate = () => { setEditing(null); setForm({ name: '', logo: '', description: '' }); setModalOpen(true); };
  const openEdit = (b: Brand) => { setEditing(b); setForm({ name: b.name, logo: b.logo || '', description: b.description || '' }); setModalOpen(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name: form.name, logo: form.logo || undefined, description: form.description || undefined };
      if (editing) {
        await api.put(`/admin/brands/${editing._id}`, body);
        toast.success(t('brands.updated'));
      } else {
        await api.post('/admin/brands', body);
        toast.success(t('brands.created'));
      }
      setModalOpen(false);
      fetchBrands();
    } catch (err) {
      handleApiError(err, t('brands.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('brands.deleteConfirm'))) return;
    try {
      await api.delete(`/admin/brands/${id}`);
      toast.success(t('brands.deleted'));
      fetchBrands();
    } catch (err) {
      handleApiError(err, t('brands.deleteFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('brands.title')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('brands.subtitle')}</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> {t('brands.addBrand')}</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder={t('brands.searchPlaceholder')} className="pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? <Loading text={t('common.loading')} /> : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('brands.brand')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.description')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.createdAt')}</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {brands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {brand.logo && <img src={brand.logo} alt={brand.name} className="h-8 w-8 rounded object-contain" />}
                          <span className="text-sm font-medium text-slate-900">{brand.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">{brand.description || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(brand.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(brand)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(brand._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('brands.editBrand') : t('brands.newBrand')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="brand-name" label={t('common.name')} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input id="brand-logo" label={t('brands.logo')} value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
          <Textarea id="brand-desc" label={t('common.description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={saving}>{editing ? t('common.update') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
