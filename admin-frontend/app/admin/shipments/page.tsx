'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import type { Shipment, PaginatedResponse } from '@/lib/types';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Truck } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

const statusBadge: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  shipped: 'info',
  in_transit: 'info',
  delivered: 'success',
  failed: 'danger',
};

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedResponse<Shipment>>(`/admin/shipments?page=${page}&limit=${limit}`);
      setShipments(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('shipments.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchShipments(); }, [fetchShipments]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('shipments.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('shipments.subtitle')}</p>
      </div>

      <Card>
        {loading ? <Loading text={t('common.loading')} /> : shipments.length === 0 ? (
          <EmptyState icon={Truck} title={t('shipments.noShipments')} description={t('shipments.noShipmentsDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.id')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipments.order')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipments.carrier')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipments.tracking')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipments.service')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipments.itemCount')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.createdAt')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {shipments.map(s => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-mono text-slate-500">{s._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-500">
                      {typeof s.order === 'string' ? s.order.slice(-6).toUpperCase() : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">{s.carrier}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 font-mono">{s.tracking || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{s.service || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 text-right">{s.items?.length || 0}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > limit && <div className="mt-4"><Pagination page={page} pages={Math.ceil(total / limit)} onPageChange={setPage} total={total} /></div>}
      </Card>
    </div>
  );
}
