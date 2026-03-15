'use client';

import { useState, useCallback, type DragEvent } from 'react';
import { t } from '@/lib/i18n';
import type { ProductImage } from '@/lib/types';
import { Plus, X, GripVertical, ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
  helpText?: string;
}

export default function ImageUpload({ images, onChange, maxImages = 10, helpText }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [previewError, setPreviewError] = useState<Record<number, boolean>>({});

  const addImage = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;

    if (images.length >= maxImages) {
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return;
    }

    onChange([...images, { url, alt: altInput.trim() || '' }]);
    setUrlInput('');
    setAltInput('');
  }, [urlInput, altInput, images, maxImages, onChange]);

  const removeImage = useCallback((index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    setPreviewError((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }, [images, onChange]);

  const updateField = useCallback((index: number, field: 'url' | 'alt', value: string) => {
    const updated = images.map((img, i) => i === index ? { ...img, [field]: value } : img);
    onChange(updated);
    if (field === 'url') {
      setPreviewError((prev) => ({ ...prev, [index]: false }));
    }
  }, [images, onChange]);

  // Drag-to-reorder handlers
  const handleReorderDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleReorderDragOver = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const updated = [...images];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, dragged);
    onChange(updated);
    setDragIndex(index);
  }, [dragIndex, images, onChange]);

  const handleReorderDragEnd = useCallback(() => {
    setDragIndex(null);
  }, []);

  const canAdd = images.length < maxImages && urlInput.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Add image by URL */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={t('products.imageUrlPlaceholder')}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 transition-all"
            />
          </div>
          <button
            type="button"
            onClick={addImage}
            disabled={!canAdd}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            {t('common.add')}
          </button>
        </div>
        <input
          type="text"
          value={altInput}
          onChange={(e) => setAltInput(e.target.value)}
          placeholder={t('products.imageAltPlaceholder')}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 transition-all"
        />
        <p className="text-xs text-slate-400">
          {t('products.imageLimit', { current: String(images.length), max: String(maxImages) })}
        </p>
      </div>

      {/* Help text */}
      {helpText && (
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {helpText}
        </p>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, index) => (
            <div
              key={`img-${index}`}
              draggable
              onDragStart={() => handleReorderDragStart(index)}
              onDragOver={(e) => handleReorderDragOver(e, index)}
              onDragEnd={handleReorderDragEnd}
              className={`
                group flex items-center gap-3 rounded-xl border p-2.5 transition-all duration-150
                ${dragIndex === index
                  ? 'border-blue-300 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }
              `}
            >
              {/* Drag handle */}
              <button
                type="button"
                className="cursor-grab active:cursor-grabbing p-0.5 text-slate-300 hover:text-slate-500 transition-colors"
                tabIndex={-1}
              >
                <GripVertical className="h-4 w-4" />
              </button>

              {/* Thumbnail */}
              <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                {img.url && !previewError[index] ? (
                  <img
                    src={img.url}
                    alt={img.alt || ''}
                    className="h-full w-full object-cover"
                    onError={() => setPreviewError((prev) => ({ ...prev, [index]: true }))}
                  />
                ) : (
                  <ImageIcon className="h-5 w-5 text-slate-300" />
                )}
              </div>

              {/* Editable fields */}
              <div className="flex-1 min-w-0 space-y-1">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => updateField(index, 'url', e.target.value)}
                  placeholder={t('products.imageUrlPlaceholder')}
                  className="w-full text-[13px] text-slate-700 bg-transparent border-0 outline-none placeholder:text-slate-300 focus:ring-0 p-0"
                />
                <input
                  type="text"
                  value={img.alt || ''}
                  onChange={(e) => updateField(index, 'alt', e.target.value)}
                  placeholder={t('products.imageAltPlaceholder')}
                  className="w-full text-xs text-slate-500 bg-transparent border-0 outline-none placeholder:text-slate-300 focus:ring-0 p-0"
                />
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex-shrink-0">
                  {t('products.primaryImage')}
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
