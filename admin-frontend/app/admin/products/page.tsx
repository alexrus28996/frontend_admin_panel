'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, handleApiError } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';
import type { Product, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, RotateCcw, Upload, Download } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: APP_CONFIG.defaultPageSize.toString() });
      if (search) params.set('q', search);
      const data = await api.get<PaginatedResponse<Product>>(`/admin/products?${params}`);
      setProducts(data.items || []);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      handleApiError(err, t('products.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('products.deleteConfirm'))) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success(t('products.deleted'));
      fetchProducts();
    } catch (err) {
      handleApiError(err, t('products.deleteFailed'));
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.post(`/admin/products/${id}/restore`);
      toast.success(t('products.restored'));
      fetchProducts();
    } catch (err) {
      handleApiError(err, t('products.restoreFailed'));
    }
  };

  const handleExport = async () => {
    try {
      const blob = await api.get<Blob>('/admin/products/export?format=csv', { responseType: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('products.exportStarted'));
    } catch (err) {
      handleApiError(err, t('products.exportFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('products.title')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('products.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> {t('common.export')}
          </Button>
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> {t('products.addProduct')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t('products.searchPlaceholder')}
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <Loading text={t('common.loading')} />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('products.product')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('products.sku')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('products.price')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('products.visibility')}</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.createdAt')}</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-900">{product.name}</p>
                            {product.hasVariants && <Badge variant="info">{t('products.hasVariants')}</Badge>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{product.sku || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {product.price != null ? formatCurrency(product.price, product.currency) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {product.deletedAt ? (
                          <Badge variant="danger">{t('common.deleted')}</Badge>
                        ) : product.isActive ? (
                          <Badge variant="success">{t('common.active')}</Badge>
                        ) : (
                          <Badge variant="warning">{t('common.inactive')}</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.visibility === 'visible' ? 'success' : 'default'}>
                          {product.visibility}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(product.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product._id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          {product.deletedAt ? (
                            <Button variant="ghost" size="sm" onClick={() => handleRestore(product._id)}>
                              <RotateCcw className="h-4 w-4 text-green-500" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)}>
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
    </div>
  );
}
