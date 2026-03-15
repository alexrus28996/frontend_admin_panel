'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import type { Reservation, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Clock, Unlock } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<PaginatedResponse<Reservation>>(`/admin/reservations?page=${page}&limit=${limit}`);
      setReservations(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('reservations.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const release = async (orderId: string) => {
    try {
      await api.post(`/admin/reservations/${orderId}/release`, {
        reason: 'Manual stock release',
      });
      toast.success(t('reservations.released'));
      fetchReservations();
    } catch (err) {
      handleApiError(err, t('reservations.releaseFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('reservations.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('reservations.subtitle')}</p>
      </div>

      <Card>
        {loading ? <Loading text={t('common.loading')} /> : reservations.length === 0 ? (
          <EmptyState icon={Clock} title={t('reservations.noReservations')} description={t('reservations.noReservationsDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.id')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('reservations.order')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('reservations.product')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('reservations.quantity')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('reservations.expires')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reservations.map(r => {
                  const isExpired = r.expiryTimestamp && new Date(r.expiryTimestamp) < new Date();
                  return (
                    <tr key={r._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{r._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-500">{r.orderId.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">{r.productId}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 text-right">{r.reservedQty}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={r.status === 'active' ? (isExpired ? 'warning' : 'success') : 'default'}>
                          {isExpired ? t('reservations.expired') : r.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{r.expiryTimestamp ? formatDate(r.expiryTimestamp) : '—'}</td>
                      <td className="px-4 py-3 text-right">
                        {r.status === 'active' && (
                          <Button variant="ghost" size="sm" onClick={() => release(r.orderId)} title={t('reservations.release')}>
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )}
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
    </div>
  );
}
