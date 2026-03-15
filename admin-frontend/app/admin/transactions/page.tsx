'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, formatCurrency, getStatusClasses, handleApiError } from '@/lib/utils';
import type { PaymentTransaction, Refund, PaymentEvent, PaginatedResponse } from '@/lib/types';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { CreditCard } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

type Tab = 'transactions' | 'refunds' | 'events';

export default function TransactionsPage() {
  const [tab, setTab] = useState<Tab>('transactions');
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = APP_CONFIG.defaultPageSize;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (tab === 'transactions') {
        const data = await api.get<PaginatedResponse<PaymentTransaction>>(`/admin/transactions?${params}`);
        setTransactions(data.items || []);
        setTotal(data.total);
      } else if (tab === 'refunds') {
        const data = await api.get<PaginatedResponse<Refund>>(`/admin/refunds?${params}`);
        setRefunds(data.items || []);
        setTotal(data.total);
      } else {
        const data = await api.get<PaginatedResponse<PaymentEvent>>(`/admin/payment-events?${params}`);
        setEvents(data.items || []);
        setTotal(data.total);
      }
    } catch (err) {
      handleApiError(err, t('transactions.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const tabs = [
    { key: 'transactions' as Tab, label: t('transactions.title') },
    { key: 'refunds' as Tab, label: t('transactions.refunds') },
    { key: 'events' as Tab, label: t('transactions.events') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('transactions.payments')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('transactions.subtitle')}</p>
      </div>

      <div className="border-b">
        <nav className="flex gap-6">
          {tabs.map(tabItem => (
            <button
              key={tabItem.key}
              onClick={() => { setTab(tabItem.key); setPage(1); }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${tab === tabItem.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tabItem.label}
            </button>
          ))}
        </nav>
      </div>

      <Card>
        {loading ? <Loading text={t('common.loading')} /> : (
          <>
            {tab === 'transactions' && (
              transactions.length === 0 ? (
                <EmptyState icon={CreditCard} title={t('transactions.noTransactions')} description={t('transactions.noTransactionsDesc')} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.id')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('transactions.order')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('transactions.provider')}</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.amount')}</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.date')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transactions.map(tx => (
                        <tr key={tx._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-mono text-slate-500">{tx._id.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3 text-sm font-mono text-slate-500">
                            {typeof tx.order === 'string' ? tx.order.slice(-6).toUpperCase() : '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">{tx.provider}</td>
                          <td className="px-4 py-3 text-sm text-slate-900 text-right">{formatCurrency(tx.amount, tx.currency)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(tx.status)}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">{formatDate(tx.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === 'refunds' && (
              refunds.length === 0 ? (
                <EmptyState title={t('transactions.noRefunds')} description={t('transactions.noRefundsDesc')} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.id')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('transactions.order')}</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.amount')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('transactions.providerRef')}</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.date')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {refunds.map(r => (
                        <tr key={r._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-mono text-slate-500">{r._id.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3 text-sm font-mono text-slate-500">
                            {r.order.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900 text-right">{formatCurrency(r.amount)}</td>
                          <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{r.providerRef || '—'}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant={r.status === 'succeeded' ? 'success' : r.status === 'failed' ? 'danger' : 'warning'}>{r.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">{formatDate(r.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === 'events' && (
              events.length === 0 ? (
                <EmptyState title={t('transactions.noEvents')} description={t('transactions.noEventsDesc')} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.id')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.type')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('transactions.provider')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('transactions.eventId')}</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.date')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {events.map(e => (
                        <tr key={e._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-mono text-slate-500">{e._id.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{e.type}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{e.provider}</td>
                          <td className="px-4 py-3 text-sm font-mono text-slate-500">{e.eventId}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{formatDate(e.receivedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
        {total > limit && <div className="mt-4"><Pagination page={page} pages={Math.ceil(total / limit)} onPageChange={setPage} total={total} /></div>}
      </Card>
    </div>
  );
}
