'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { couponsService, CouponCreateData } from '@/api/services/coupons.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CouponCreateData>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await couponsService.createCoupon(formData);
      router.push(ROUTES.COUPONS);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.saveFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <Link href={ROUTES.COUPONS} className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={20} />
        {en.common.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{en.coupons.createNew}</h1>
        <p className="text-muted-foreground mt-1">{en.coupons.pageTitle}</p>
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
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., SAVE10"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.coupons.discountType} *</label>
              <select
                value={formData.discountType}
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
                value={formData.discountValue}
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
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? en.forms.submitting : en.coupons.createNew}
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
