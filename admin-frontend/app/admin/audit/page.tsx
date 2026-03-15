'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import type { AuditLog, PaginatedResponse } from '@/lib/types';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [path, setPath] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const limit = APP_CONFIG.defaultPageSize;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (method) params.set('method', method);
      if (status) params.set('status', status);
      if (path) params.set('path', path);
      if (userFilter) params.set('user', userFilter);
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
      const data = await api.get<PaginatedResponse<AuditLog>>(`/admin/audit?${params}`);
      setLogs(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('audit.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, method, status, path, userFilter, fromDate, toDate]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const methodColor: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700',
    POST: 'bg-green-100 text-green-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    PATCH: 'bg-orange-100 text-orange-700',
    DELETE: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('audit.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('audit.subtitle')}</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Select
            value={method}
            onChange={e => { setMethod(e.target.value); setPage(1); }}
            options={[
              { value: '', label: t('audit.allMethods') },
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' },
              { value: 'DELETE', label: 'DELETE' },
            ]}
          />
          <Select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            options={[
              { value: '', label: t('audit.allStatuses') },
              { value: '200', label: t('audit.status200') },
              { value: '201', label: t('audit.status201') },
              { value: '400', label: t('audit.status400') },
              { value: '401', label: t('audit.status401') },
              { value: '403', label: t('audit.status403') },
              { value: '404', label: t('audit.status404') },
              { value: '500', label: t('audit.status500') },
            ]}
          />
          <Input
            placeholder={t('audit.filterByPath')}
            value={path}
            onChange={e => { setPath(e.target.value); setPage(1); }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder={t('audit.filterByUser')}
            value={userFilter}
            onChange={e => { setUserFilter(e.target.value); setPage(1); }}
          />
          <Input
            type="date"
            placeholder={t('audit.fromDate')}
            value={fromDate}
            onChange={e => { setFromDate(e.target.value); setPage(1); }}
          />
          <Input
            type="date"
            placeholder={t('audit.toDate')}
            value={toDate}
            onChange={e => { setToDate(e.target.value); setPage(1); }}
          />
        </div>

        {loading ? <Loading text={t('common.loading')} /> : logs.length === 0 ? (
          <EmptyState icon={Shield} title={t('audit.noLogs')} description={t('audit.noLogsDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.date')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('audit.user')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('audit.method')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('audit.path')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('audit.statusCode')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('audit.duration')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('audit.ip')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {typeof log.user === 'object' ? log.user.name || log.user.email : log.user || t('audit.system')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-mono font-bold ${methodColor[log.method] || 'bg-slate-100 text-slate-700'}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600 max-w-xs truncate">{log.path}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={(log.status ?? 0) < 400 ? 'success' : (log.status ?? 0) < 500 ? 'warning' : 'danger'}>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 text-right">{log.meta?.durationMs ? `${log.meta.durationMs}ms` : '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-400">{log.ip || '—'}</td>
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
