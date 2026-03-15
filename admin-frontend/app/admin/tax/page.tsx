'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { handleApiError } from '@/lib/utils';
import type { TaxZone, TaxRule, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import Textarea from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function TaxPage() {
  const [zones, setZones] = useState<TaxZone[]>([]);
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<TaxZone | null>(null);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);
  const [zoneForm, setZoneForm] = useState({ name: '', countries: '', states: '', description: '', isActive: true, priority: 0 });
  const [ruleForm, setRuleForm] = useState({ zone: '', name: '', rate: 0, calcType: 'percentage' as string, inclusive: false, isActive: true, category: '', priority: 0, label: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [zData, rData] = await Promise.all([
        api.get<{ zones: TaxZone[] }>('/admin/tax/zones?limit=100'),
        api.get<PaginatedResponse<TaxRule>>('/admin/tax/rules?limit=100'),
      ]);
      setZones(zData.zones || []);
      setRules(rData.items || []);
    } catch (err) {
      handleApiError(err, t('tax.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreateZone = () => { setEditingZone(null); setZoneForm({ name: '', countries: '', states: '', description: '', isActive: true, priority: 0 }); setZoneModalOpen(true); };
  const openEditZone = (z: TaxZone) => { setEditingZone(z); setZoneForm({ name: z.name, countries: (z.countries || []).join(', '), states: (z.states || []).join(', '), description: z.description || '', isActive: z.isActive !== false, priority: z.priority || 0 }); setZoneModalOpen(true); };

  const saveZone = async () => {
    if (!zoneForm.name) { toast.error(t('tax.nameRequired')); return; }
    setSaving(true);
    try {
      const payload = {
        name: zoneForm.name,
        countries: zoneForm.countries.split(',').map(s => s.trim()).filter(Boolean),
        states: zoneForm.states ? zoneForm.states.split(',').map(s => s.trim()).filter(Boolean) : [],
        description: zoneForm.description || undefined,
        isActive: zoneForm.isActive,
        priority: Number(zoneForm.priority) || 0,
      };
      if (editingZone) {
        await api.patch(`/admin/tax/zones/${editingZone._id}`, payload);
      } else {
        await api.post('/admin/tax/zones', payload);
      }
      toast.success(editingZone ? t('tax.zoneUpdated') : t('tax.zoneCreated'));
      setZoneModalOpen(false);
      fetchData();
    } catch (err) {
      handleApiError(err, t('tax.zoneSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deleteZone = async (id: string) => {
    if (!confirm(t('tax.deleteZoneConfirm'))) return;
    try { await api.delete(`/admin/tax/zones/${id}`); toast.success(t('tax.zoneDeleted')); fetchData(); }
    catch (err) { handleApiError(err, t('common.operationFailed')); }
  };

  const openCreateRule = () => { setEditingRule(null); setRuleForm({ zone: zones[0]?._id || '', name: '', rate: 0, calcType: 'percentage', inclusive: false, isActive: true, category: '', priority: 0, label: '' }); setRuleModalOpen(true); };
  const openEditRule = (r: TaxRule) => { setEditingRule(r); setRuleForm({ zone: typeof r.zone === 'object' ? r.zone._id : r.zone, name: r.name, rate: r.rate, calcType: r.calcType, inclusive: r.inclusive || false, isActive: r.isActive, category: r.category || '', priority: r.priority || 0, label: r.label || '' }); setRuleModalOpen(true); };

  const saveRule = async () => {
    if (!ruleForm.name || !ruleForm.zone) { toast.error(t('tax.nameAndZoneRequired')); return; }
    setSaving(true);
    try {
      const payload = {
        zone: ruleForm.zone,
        name: ruleForm.name,
        rate: Number(ruleForm.rate),
        calcType: ruleForm.calcType,
        inclusive: ruleForm.inclusive,
        isActive: ruleForm.isActive,
        category: ruleForm.category || null,
        priority: Number(ruleForm.priority) || 0,
        label: ruleForm.label || undefined,
      };
      if (editingRule) {
        await api.patch(`/admin/tax/rules/${editingRule._id}`, payload);
      } else {
        await api.post('/admin/tax/rules', payload);
      }
      toast.success(editingRule ? t('tax.ruleUpdated') : t('tax.ruleCreated'));
      setRuleModalOpen(false);
      fetchData();
    } catch (err) {
      handleApiError(err, t('tax.ruleSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm(t('tax.deleteRuleConfirm'))) return;
    try { await api.delete(`/admin/tax/rules/${id}`); toast.success(t('tax.ruleDeleted')); fetchData(); }
    catch (err) { handleApiError(err, t('common.operationFailed')); }
  };

  if (loading) return <Loading text={t('common.loading')} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('tax.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('tax.subtitle')}</p>
      </div>

      <Card title={t('tax.zones')} action={<Button size="sm" onClick={openCreateZone}><Plus className="h-4 w-4 mr-1" /> {t('tax.addZone')}</Button>}>
        {zones.length === 0 ? (
          <EmptyState title={t('tax.noZones')} description={t('tax.noZonesDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('shipping.countries')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {zones.map(z => (
                  <tr key={z._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{z.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{(z.countries || []).join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditZone(z)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteZone(z._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title={t('tax.rules')} action={<Button size="sm" onClick={openCreateRule}><Plus className="h-4 w-4 mr-1" /> {t('tax.addRule')}</Button>}>
        {rules.length === 0 ? (
          <EmptyState title={t('tax.noRules')} description={t('tax.noRulesDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.name')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('tax.zone')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('tax.rate')}</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.type')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('tax.inclusive')}</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.status')}</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rules.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{typeof r.zone === 'object' ? r.zone.name : zones.find(z => z._id === r.zone)?.name || r.zone}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 text-right">{r.calcType === 'percentage' ? `${r.rate}%` : `$${r.rate}`}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 capitalize">{r.calcType}</td>
                    <td className="px-4 py-3 text-center">{r.inclusive ? <Badge variant="info">{t('common.yes')}</Badge> : <Badge>{t('common.no')}</Badge>}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={r.isActive ? 'success' : 'default'}>{r.isActive ? t('common.active') : t('common.inactive')}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditRule(r)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteRule(r._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Zone Modal */}
      <Modal isOpen={zoneModalOpen} onClose={() => setZoneModalOpen(false)} title={editingZone ? t('tax.editZone') : t('tax.newZone')}>
        <div className="space-y-4">
          <Input label={t('common.name')} value={zoneForm.name} onChange={e => setZoneForm({ ...zoneForm, name: e.target.value })} required />
          <Textarea label={t('tax.countriesHelp')} value={zoneForm.countries} onChange={e => setZoneForm({ ...zoneForm, countries: e.target.value })} placeholder="US, CA, GB" rows={2} />
          <Input label={t('tax.statesHelp')} value={zoneForm.states} onChange={e => setZoneForm({ ...zoneForm, states: e.target.value })} placeholder="CA, NY, TX" />
          <Input label={t('common.description')} value={zoneForm.description} onChange={e => setZoneForm({ ...zoneForm, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('tax.priority')} type="number" value={zoneForm.priority} onChange={e => setZoneForm({ ...zoneForm, priority: Number(e.target.value) })} />
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="taxZoneActive" checked={zoneForm.isActive} onChange={e => setZoneForm({ ...zoneForm, isActive: e.target.checked })} className="rounded border-slate-300" />
              <label htmlFor="taxZoneActive" className="text-sm text-slate-700">{t('common.active')}</label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setZoneModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={saveZone} loading={saving}>{editingZone ? t('common.update') : t('common.create')}</Button>
        </div>
      </Modal>

      {/* Rule Modal */}
      <Modal isOpen={ruleModalOpen} onClose={() => setRuleModalOpen(false)} title={editingRule ? t('tax.editRule') : t('tax.newRule')}>
        <div className="space-y-4">
          <Input label={t('common.name')} value={ruleForm.name} onChange={e => setRuleForm({ ...ruleForm, name: e.target.value })} required />
          <Select label={t('tax.zone')} value={ruleForm.zone} onChange={e => setRuleForm({ ...ruleForm, zone: e.target.value })} options={zones.map(z => ({ value: z._id, label: z.name }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('tax.rate')} type="number" step="0.01" value={ruleForm.rate} onChange={e => setRuleForm({ ...ruleForm, rate: Number(e.target.value) })} required />
            <Select label={t('tax.calcType')} value={ruleForm.calcType} onChange={e => setRuleForm({ ...ruleForm, calcType: e.target.value })} options={[{ value: 'percentage', label: t('tax.percentage') }, { value: 'fixed', label: t('tax.fixed') }]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('tax.label')} value={ruleForm.label} onChange={e => setRuleForm({ ...ruleForm, label: e.target.value })} placeholder={t('tax.labelPlaceholder')} />
            <Input label={t('tax.category')} value={ruleForm.category} onChange={e => setRuleForm({ ...ruleForm, category: e.target.value })} placeholder={t('tax.categoryPlaceholder')} />
          </div>
          <Input label={t('tax.priority')} type="number" value={ruleForm.priority} onChange={e => setRuleForm({ ...ruleForm, priority: Number(e.target.value) })} />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={ruleForm.inclusive} onChange={e => setRuleForm({ ...ruleForm, inclusive: e.target.checked })} className="rounded border-slate-300" /><span className="text-sm text-slate-700">{t('tax.taxInclusive')}</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={ruleForm.isActive} onChange={e => setRuleForm({ ...ruleForm, isActive: e.target.checked })} className="rounded border-slate-300" /><span className="text-sm text-slate-700">{t('common.active')}</span></label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setRuleModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={saveRule} loading={saving}>{editingRule ? t('common.update') : t('common.create')}</Button>
        </div>
      </Modal>
    </div>
  );
}
