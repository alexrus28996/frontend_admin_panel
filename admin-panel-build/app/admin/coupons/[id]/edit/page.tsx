'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { couponsService, Coupon, CouponCreateData } from '@/api/services/coupons.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditCouponPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = params.id as string;

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CouponCreateData>>({});

  useEffect(() => {
    const loadCoupon = async () => {
      try {
        const data = await couponsService.getCouponById(couponId);
        setCoupon(data);
        setFormData({
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          active: data.active,
          expiresAt: data.expiresAt,
          maxUses: data.maxUses,
        });
      } catch (err: any) {
        setError(err.response?.data?.error?.message || en.errors.loadingFailed);
      } finally {
        setLoading(false);
      }
    };

    loadCoupon();
  }, [couponId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await couponsService.updateCoupon(couponId, formData);
      router.push(ROUTES.COUPONS);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div>
        <Link href={ROUTES.COUPONS} className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={20} />
          {en.common.back}
        </Link>
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
          <AlertCircle size={20} />
          <p>{error || en.coupons.notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <Link href={ROUTES.COUPONS} className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={20} />
        {en.common.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{en.coupons.edit}</h1>
        <p className="text-muted-foreground mt-1">{coupon.code}</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl bg-card border border-border rounded-lg p-6">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg mb-6">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-2">{en.coupons.code} *</label>
            <input
              type="text"
              required
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.coupons.discountType} *</label>
              <select
                value={formData.discountType || 'percentage'}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="percentage">{en.coupons.types.percentage}</option>
                <option value="fixed">{en.coupons.types.fixed}</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.coupons.discountValue} *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.discountValue || 0}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.coupons.maxUses}</label>
              <input
                type="number"
                min="0"
                value={formData.maxUses || ''}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.coupons.expiresAt}</label>
              <input
                type="datetime-local"
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value || undefined })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Active */}
          <div>
            <label className="block text-sm font-medium mb-2">{en.coupons.status}</label>
            <select
              value={formData.active ? 'active' : 'inactive'}
              onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              {saving && <Loader2 className="animate-spin" size={20} />}
              {saving ? en.forms.submitting : en.common.save}
            </button>
            <Link
              href={ROUTES.COUPONS}
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              {en.common.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
