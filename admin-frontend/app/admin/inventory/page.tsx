'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';
import { handleApiError } from '@/lib/utils';
import type { StockItem, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Package, Minus, Plus, RefreshCw } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [adjustForm, setAdjustForm] = useState({ delta: 0, reason: '' });
  const [saving, setSaving] = useState(false);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('product', search);
      const data = await api.get<PaginatedResponse<StockItem>>(`/admin/inventory?${params}`);
      setItems(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('inventory.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdjust = (item: StockItem) => {
    setSelectedItem(item);
    setAdjustForm({ delta: 0, reason: '' });
    setAdjustModalOpen(true);
  };

  const handleAdjust = async () => {
    if (!selectedItem || adjustForm.delta === 0) return;
    setSaving(true);
    try {
      const productId = typeof selectedItem.product === 'object' ? selectedItem.product._id : selectedItem.product;
      const locationId = typeof selectedItem.location === 'object' ? selectedItem.location._id : selectedItem.location;
      await api.post('/admin/inventory/adjustments', {
        productId,
        locationId,
        qtyChange: adjustForm.delta,
        reason: adjustForm.reason || undefined,
      });
      toast.success(t('inventory.stockAdjusted'));
      setAdjustModalOpen(false);
      fetchItems();
    } catch (err) {
      handleApiError(err, t('inventory.adjustFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('inventory.overview')}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{t('inventory.subtitle')}</p>
        </div>
        <Button variant="outline" onClick={fetchItems}><RefreshCw className="h-4 w-4 mr-1" /> {t('common.refresh')}</Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder={t('inventory.searchPlaceholder')}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {loading ? <Loading text={t('common.loading')} /> : items.length === 0 ? (
          <EmptyState icon={Package} title={t('inventory.noInventory')} description={t('inventory.noInventoryDesc')} />
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
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map(item => {
                  const isLow = item.available <= (item.reorderPoint || 5);
                  return (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {typeof item.product === 'object' ? item.product.name : item.product}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{item.variantId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {typeof item.location === 'object' ? item.location.name : item.location}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900 text-right">{item.onHand}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 text-right">{item.reserved}</td>
                      <td className="px-4 py-3 text-sm font-medium text-right">
                        <span className={isLow ? 'text-red-600' : 'text-green-600'}>{item.available}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <Badge variant="danger">{t('inventory.lowStock')}</Badge>
                        ) : (
                          <Badge variant="success">{t('inventory.inStock')}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openAdjust(item)}>
                          {t('inventory.adjustStock')}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {total > limit && <div className="mt-4"><Pagination page={page} pages={Math.ceil(total / limit)} onPageChange={setPage} total={total} /></div>}
      </Card>

      <Modal isOpen={adjustModalOpen} onClose={() => setAdjustModalOpen(false)} title={t('inventory.adjustStock')}>
        <div className="space-y-4">
          {selectedItem && (
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <p className="font-medium">{typeof selectedItem.product === 'object' ? selectedItem.product.name : selectedItem.product}</p>
              <p className="text-slate-500">{t('inventory.currentOnHand')}: {selectedItem.onHand}</p>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setAdjustForm({ ...adjustForm, delta: adjustForm.delta - 1 })}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              label={t('inventory.delta')}
              type="number"
              value={adjustForm.delta}
              onChange={e => setAdjustForm({ ...adjustForm, delta: Number(e.target.value) })}
              className="w-32 text-center"
            />
            <Button variant="outline" size="sm" onClick={() => setAdjustForm({ ...adjustForm, delta: adjustForm.delta + 1 })}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Select
            label={t('inventory.reason')}
            value={adjustForm.reason}
            onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })}
            options={[
              { value: '', label: t('inventory.selectReason') },
              { value: 'recount', label: t('inventory.recount') },
              { value: 'received', label: t('inventory.received') },
              { value: 'damaged', label: t('inventory.damaged') },
              { value: 'returned', label: t('inventory.returned') },
              { value: 'correction', label: t('inventory.correction') },
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setAdjustModalOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleAdjust} loading={saving}>{t('inventory.adjustStock')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
