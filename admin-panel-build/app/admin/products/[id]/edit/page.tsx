'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsService, Product, ProductUpdateData } from '@/api/services/products.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductUpdateData>({});

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productsService.getProductById(productId);
        setProduct(data);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category,
          brand: data.brand,
          isDeleted: data.isDeleted,
        });
      } catch (err: any) {
        setError(err.response?.data?.error?.message || en.errors.loadingFailed);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await productsService.updateProduct(productId, formData);
      router.push(ROUTES.PRODUCTS);
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

  if (!product) {
    return (
      <div>
        <Link href={ROUTES.PRODUCTS} className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={20} />
          {en.common.back}
        </Link>
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
          <AlertCircle size={20} />
          <p>{error || en.products.notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <Link href={ROUTES.PRODUCTS} className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={20} />
        {en.common.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{en.products.edit}</h1>
        <p className="text-muted-foreground mt-1">{product.name}</p>
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
              value={formData.name || ''}
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
                value={formData.price || 0}
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
                value={formData.stock || 0}
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

          {/* Deleted */}
          <div>
            <label className="block text-sm font-medium mb-2">{en.products.status}</label>
            <select
              value={formData.isDeleted ? 'deleted' : 'active'}
              onChange={(e) => setFormData({ ...formData, isDeleted: e.target.value === 'deleted' })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">{en.products.active}</option>
              <option value="deleted">{en.products.deleted}</option>
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
