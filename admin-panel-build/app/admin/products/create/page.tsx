'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsService, ProductCreateData } from '@/api/services/products.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductCreateData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    brand: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await productsService.createProduct(formData);
      router.push(ROUTES.PRODUCTS);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.saveFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <Link href={ROUTES.PRODUCTS} className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={20} />
        {en.common.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{en.products.createNew}</h1>
        <p className="text-muted-foreground mt-1">{en.products.pageTitle}</p>
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">{en.products.name} *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">{en.products.description}</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.products.price} *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.products.stock} *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.products.category}</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.products.brand}</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? en.forms.submitting : en.products.createNew}
            </button>
            <Link
              href={ROUTES.PRODUCTS}
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
