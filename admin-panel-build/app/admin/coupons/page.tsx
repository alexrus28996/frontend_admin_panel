'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { couponsService, Coupon, CouponsListResponse } from '@/api/services/coupons.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, Loader2, Trash2 } from 'lucide-react';

export default function CouponsPage() {
  const [data, setData] = useState<CouponsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const limit = 10;

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await couponsService.getCoupons(page, limit, activeFilter);
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.loadingFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, [page, activeFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm(en.common.confirm)) return;
    try {
      await couponsService.deleteCoupon(id);
      loadCoupons();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.deleteFailed);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{en.coupons.title}</h1>
          <p className="text-muted-foreground mt-1">{en.coupons.pageTitle}</p>
        </div>
        <Link
          href={ROUTES.COUPONS_CREATE}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          {en.coupons.createNew}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => {
            setActiveFilter(undefined);
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === undefined
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-muted'
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setActiveFilter(true);
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === true
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-muted'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => {
            setActiveFilter(false);
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === false
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-muted'
          }`}
        >
          Inactive
        </button>
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
          <p className="text-muted-foreground">{en.coupons.noCoupons}</p>
        </div>
      )}

      {/* Table */}
      {!loading && data && data.items.length > 0 && (
        <>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.coupons.code}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.coupons.discountType}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.coupons.discountValue}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.coupons.expiresAt}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.coupons.status}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold">{coupon.code}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {coupon.discountType === 'percentage' ? '%' : '$'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {coupon.discountValue}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {coupon.active ? en.coupons.status : 'Expired'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={ROUTES.COUPON_EDIT(coupon.id)}
                          className="text-primary hover:underline"
                        >
                          {en.common.edit}
                        </Link>
                        <button
                          onClick={() => handleDelete(coupon.id)}
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
