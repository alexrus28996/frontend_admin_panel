'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import { handleApiError } from '@/lib/utils';
import type { StockItem } from '@/lib/types';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

export default function LowStockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ items: StockItem[]; total: number; threshold: number }>('/admin/inventory/low');
      setItems(data.items || []);
    } catch (err) {
      handleApiError(err, t('inventory.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLowStock(); }, [fetchLowStock]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('inventory.lowStockAlerts')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('inventory.lowStockSubtitle')}</p>
        </div>
        <Badge variant="danger">{items.length} {t('inventory.items')}</Badge>
      </div>

      <Card>
        {loading ? <Loading text={t('common.loading')} /> : items.length === 0 ? (
          <EmptyState icon={AlertTriangle} title={t('inventory.noLowStock')} description={t('inventory.noLowStockDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventory.product')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventory.variant')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventory.location')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventory.onHand')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventory.reserved')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventory.available')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('inventory.threshold')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map(item => {
                  return (
                    <tr key={item._id} className="hover:bg-red-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {typeof item.product === 'object' ? item.product.name : item.product}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{item.variantId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {typeof item.location === 'object' ? item.location.name : item.location}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900 text-right">{item.onHand}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 text-right">{item.reserved}</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">{item.available}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 text-right">{item.reorderPoint || 5}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
