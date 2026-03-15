'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { handleApiError } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { Product, Category, Brand, ProductImage } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import ImageUpload from '@/components/ui/image-upload';
import Loading from '@/components/ui/loading';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    longDescription: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    currency: 'USD',
    sku: '',
    barcode: '',
    tags: '',
    category: '',
    brand: '',
    visibility: 'visible',
    requiresShipping: true,
    hasVariants: false,
    weight: '',
    weightUnit: 'kg',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [productData, catData, brandData] = await Promise.all([
          api.get<{ product: Product }>(`/admin/products/${id}`),
          api.get<{ items: Category[] }>('/admin/categories?limit=100'),
          api.get<{ items: Brand[] }>('/admin/brands?limit=100'),
        ]);
        const p = productData.product;
        setCategories(catData.items || []);
        setBrands(brandData.items || []);
        setImages(p.images || []);
        setForm({
          name: p.name || '',
          description: p.description || '',
          longDescription: p.longDescription || '',
          price: p.price?.toString() || '',
          compareAtPrice: p.compareAtPrice?.toString() || '',
          costPrice: p.costPrice?.toString() || '',
          currency: p.currency || 'USD',
          sku: p.sku || '',
          barcode: p.barcode || '',
          tags: p.tags?.join(', ') || '',
          category: (typeof p.category === 'string' ? p.category : p.category?._id) || '',
          brand: (typeof p.brand === 'string' ? p.brand : p.brand?._id) || '',
          visibility: p.visibility || 'visible',
          requiresShipping: p.requiresShipping ?? true,
          hasVariants: p.hasVariants ?? false,
          weight: p.weight?.toString() || '',
          weightUnit: p.weightUnit || 'kg',
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
          isActive: p.isActive ?? true,
        });
      } catch (err) {
        handleApiError(err, t('products.loadFailed'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        longDescription: form.longDescription,
        currency: form.currency,
        sku: form.sku || undefined,
        barcode: form.barcode || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        category: form.category || undefined,
        brand: form.brand || undefined,
        visibility: form.visibility,
        requiresShipping: form.requiresShipping,
        hasVariants: form.hasVariants,
        weightUnit: form.weightUnit,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        isActive: form.isActive,
      };
      if (!form.hasVariants && form.price) body.price = parseFloat(form.price);
      if (form.compareAtPrice) body.compareAtPrice = parseFloat(form.compareAtPrice);
      if (form.costPrice) body.costPrice = parseFloat(form.costPrice);
      if (form.weight) body.weight = parseFloat(form.weight);
      if (images.length > 0) body.images = images;
      else body.images = [];

      await api.put(`/admin/products/${id}`, body);
      toast.success(t('products.updated'));
      router.push('/admin/products');
    } catch (err) {
      handleApiError(err, t('products.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text={t('common.loading')} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> {t('common.back')}
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('products.editProduct')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title={t('products.basicInfo')}>
              <div className="space-y-4">
                <Input id="name" label={t('products.productName')} required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
                <Textarea id="description" label={t('products.shortDescription')} value={form.description} onChange={(e) => updateField('description', e.target.value)} />
                <Textarea id="longDescription" label={t('products.longDescription')} rows={6} value={form.longDescription} onChange={(e) => updateField('longDescription', e.target.value)} />
              </div>
            </Card>

            <Card title={t('products.pricing')}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input id="price" label={t('products.price')} type="number" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
                <Input id="compareAtPrice" label={t('products.compareAtPrice')} type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => updateField('compareAtPrice', e.target.value)} />
                <Input id="costPrice" label={t('products.costPrice')} type="number" step="0.01" value={form.costPrice} onChange={(e) => updateField('costPrice', e.target.value)} />
              </div>
            </Card>

            <Card title={t('products.inventoryShipping')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="sku" label={t('products.sku')} value={form.sku} onChange={(e) => updateField('sku', e.target.value)} />
                <Input id="barcode" label={t('products.barcode')} value={form.barcode} onChange={(e) => updateField('barcode', e.target.value)} />
                <Input id="weight" label={t('products.weight')} type="number" step="0.01" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} />
                <Select
                  id="weightUnit"
                  label={t('products.weightUnit')}
                  value={form.weightUnit}
                  onChange={(e) => updateField('weightUnit', e.target.value)}
                  options={[
                    { value: 'kg', label: t('products.kilograms') },
                    { value: 'g', label: t('products.grams') },
                    { value: 'lb', label: t('products.pounds') },
                    { value: 'oz', label: t('products.ounces') },
                  ]}
                />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.requiresShipping} onChange={(e) => updateField('requiresShipping', e.target.checked)} className="rounded border-slate-300 text-blue-600" />
                  <span className="text-sm text-slate-700">{t('products.requiresShipping')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.hasVariants} onChange={(e) => updateField('hasVariants', e.target.checked)} className="rounded border-slate-300 text-blue-600" />
                  <span className="text-sm text-slate-700">{t('products.hasVariants')}</span>
                </label>
              </div>
            </Card>

            <Card title={t('products.images')} description={t('products.imagesHelp')}>
              <ImageUpload
                images={images}
                onChange={setImages}
                maxImages={10}
                helpText={t('products.imageDragHint')}
              />
            </Card>

            <Card title={t('products.seo')}>
              <div className="space-y-4">
                <Input id="metaTitle" label={t('products.metaTitle')} value={form.metaTitle} onChange={(e) => updateField('metaTitle', e.target.value)} />
                <Textarea id="metaDescription" label={t('products.metaDescription')} value={form.metaDescription} onChange={(e) => updateField('metaDescription', e.target.value)} rows={2} />
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card title={t('common.status')}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => updateField('isActive', e.target.checked)} className="rounded border-slate-300 text-blue-600" />
                <span className="text-sm text-slate-700">{t('common.active')}</span>
              </label>
            </Card>

            <Card title={t('products.organization')}>
              <div className="space-y-4">
                <Select
                  id="category"
                  label={t('products.category')}
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  options={[{ value: '', label: t('products.selectCategory') }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
                />
                <Select
                  id="brand"
                  label={t('products.brand')}
                  value={form.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  options={[{ value: '', label: t('products.selectBrand') }, ...brands.map((b) => ({ value: b._id, label: b.name }))]}
                />
                <Input id="tags" label={t('products.tagsSeparated')} value={form.tags} onChange={(e) => updateField('tags', e.target.value)} />
                <Select
                  id="visibility"
                  label={t('products.visibility')}
                  value={form.visibility}
                  onChange={(e) => updateField('visibility', e.target.value)}
                  options={[
                    { value: 'visible', label: t('products.visible') },
                    { value: 'hidden', label: t('products.hidden') },
                  ]}
                />
              </div>
            </Card>

            <Button type="submit" loading={saving} className="w-full">
              <Save className="h-4 w-4 mr-1" /> {t('products.saveChanges')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
