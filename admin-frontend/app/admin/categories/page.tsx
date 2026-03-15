'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import type { Category, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Modal from '@/components/ui/modal';
import Loading from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', parent: '', icon: '', imageUrl: '', imageAlt: '', bannerUrl: '', bannerAlt: '', metaTitle: '', metaDescription: '' });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: APP_CONFIG.defaultPageSize.toString(), includeDeleted: 'true' });
      if (search) params.set('q', search);
      const data = await api.get<PaginatedResponse<Category>>(`/admin/categories?${params}`);
      setCategories(data.items || []);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      handleApiError(err, t('categories.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCategories();
    api.get<PaginatedResponse<Category>>(`/admin/categories?limit=${APP_CONFIG.maxPageSize}`).then((d) => setAllCategories(d.items || []));
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', parent: '', icon: '', imageUrl: '', imageAlt: '', bannerUrl: '', bannerAlt: '', metaTitle: '', metaDescription: '' });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      parent: cat.parent || '',
      icon: cat.icon || '',
      imageUrl: cat.image?.url || '',
      imageAlt: cat.image?.alt || '',
      bannerUrl: cat.banner?.url || '',
      bannerAlt: cat.banner?.alt || '',
      metaTitle: cat.metaTitle || '',
      metaDescription: cat.metaDescription || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        description: form.description || undefined,
        parent: form.parent || null,
        icon: form.icon || undefined,
        image: form.imageUrl ? { url: form.imageUrl, alt: form.imageAlt || form.name } : undefined,
        banner: form.bannerUrl ? { url: form.bannerUrl, alt: form.bannerAlt || form.name } : undefined,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
      };
      if (editing) {
        await api.put(`/admin/categories/${editing._id}`, body);
        toast.success(t('categories.updated'));
      } else {
        await api.post('/admin/categories', body);
        toast.success(t('categories.created'));
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      handleApiError(err, t('categories.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('categories.deleteConfirm'))) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success(t('categories.deleted'));
      fetchCategories();
    } catch (err) {
      handleApiError(err, t('categories.deleteFailed'));
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.post(`/admin/categories/${id}/restore`);
      toast.success(t('categories.restored'));
      fetchCategories();
    } catch (err) {
      handleApiError(err, t('categories.restoreFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('categories.title')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('categories.subtitle')}</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> {t('categories.addCategory')}
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder={t('categories.searchPlaceholder')} className="pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? <Loading text={t('common.loading')} /> : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.name')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('categories.slug')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('categories.parent')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.createdAt')}</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {allCategories.find((c) => c._id === cat.parent)?.name || '—'}
                      </td>
                      <td className="px-6 py-4">
                        {cat.deletedAt ? <Badge variant="danger">{t('common.deleted')}</Badge> : <Badge variant="success">{t('common.active')}</Badge>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(cat.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {cat.deletedAt ? (
                            <Button variant="ghost" size="sm" onClick={() => handleRestore(cat._id)}>
                              <RotateCcw className="h-4 w-4 text-green-500" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cat._id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('categories.editCategory') : t('categories.newCategory')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="cat-name" label={t('common.name')} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea id="cat-desc" label={t('common.description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <Select
            id="cat-parent"
            label={t('categories.parentCategory')}
            value={form.parent}
            onChange={(e) => setForm({ ...form, parent: e.target.value })}
            options={[{ value: '', label: t('categories.noParent') }, ...allCategories.filter((c) => c._id !== editing?._id).map((c) => ({ value: c._id, label: c.name }))]}
          />
          <Input id="cat-icon" label={t('categories.icon')} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder={t('categories.iconPlaceholder')} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="cat-image-url" label={t('categories.imageUrl')} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            <Input id="cat-image-alt" label={t('categories.imageAlt')} value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="cat-banner-url" label={t('categories.bannerUrl')} value={form.bannerUrl} onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })} placeholder="https://..." />
            <Input id="cat-banner-alt" label={t('categories.bannerAlt')} value={form.bannerAlt} onChange={(e) => setForm({ ...form, bannerAlt: e.target.value })} />
          </div>
          <Input id="cat-meta-title" label={t('categories.metaTitle')} value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
          <Input id="cat-meta-desc" label={t('categories.metaDescription')} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={saving}>{editing ? t('common.update') : t('common.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
