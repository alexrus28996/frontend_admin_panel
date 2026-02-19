'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsService, Product, ProductsListResponse } from '@/api/services/products.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, Loader2, Trash2, Download } from 'lucide-react';

export default function ProductsPage() {
  const [data, setData] = useState<ProductsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await productsService.getProducts(page, limit, {
        q: search || undefined,
      });
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.loadingFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm(en.common.confirm)) return;
    try {
      await productsService.deleteProduct(id);
      loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.deleteFailed);
    }
  };

  const handleExport = async () => {
    try {
      await productsService.exportProducts();
      alert('Export started');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.saveFailed);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{en.products.title}</h1>
          <p className="text-muted-foreground mt-1">{en.products.pageTitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Download size={20} />
            {en.products.export}
          </button>
          <Link
            href={ROUTES.PRODUCTS_CREATE}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            {en.products.createNew}
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={en.common.search}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg mb-6">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      )}

      {/* Empty state */}
      {!loading && data && data.items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{en.products.noProducts}</p>
        </div>
      )}

      {/* Table */}
      {!loading && data && data.items.length > 0 && (
        <>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.products.name}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.products.price}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.products.stock}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.products.category}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((product) => (
                  <tr key={product.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm font-bold">${Number(product.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.stock || 0}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.category || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={ROUTES.PRODUCT_EDIT(product.id)}
                          className="text-primary hover:underline"
                        >
                          {en.common.edit}
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:underline"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.pages} • Total: {data.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage(Math.min(data.pages, page + 1))}
                  disabled={page === data.pages}
                  className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
