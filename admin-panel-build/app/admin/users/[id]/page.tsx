'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usersService, User } from '@/api/services/users.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await usersService.getUserById(userId);
        setUser(userData);
        setFormData({
          name: userData.name,
          isActive: userData.isActive,
        });
      } catch (err: any) {
        setError(err.response?.data?.error?.message || en.errors.loadingFailed);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await usersService.updateUser(userId, formData);
      setUser(updated);
      alert(en.common.success);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async () => {
    try {
      setSaving(true);
      const updated = await usersService.promoteUser(userId);
      setUser(updated);
      alert(en.common.success);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleDemote = async () => {
    try {
      setSaving(true);
      const updated = await usersService.demoteUser(userId);
      setUser(updated);
      alert(en.common.success);
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

  if (error || !user) {
    return (
      <div>
        <Link href={ROUTES.USERS} className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={20} />
          {en.common.back}
        </Link>
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
          <AlertCircle size={20} />
          <p>{error || en.users.notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <Link href={ROUTES.USERS} className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={20} />
        {en.common.back}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground mt-1">{user.email}</p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">{en.common.edit}</h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.users.name}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.users.email}</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground opacity-60"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">{en.users.status}</label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">{en.users.active}</option>
                <option value="inactive">{en.users.inactive}</option>
              </select>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? en.forms.submitting : en.common.save}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User info card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4">{en.users.title}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">{en.users.id}</p>
                <p className="text-sm font-mono">{user.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">{en.users.roles}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <span key={role} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">{en.users.status}</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user.isActive ? en.users.active : en.users.inactive}
                </span>
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4">{en.common.actions}</h3>
            <div className="space-y-2">
              <button
                onClick={handlePromote}
                disabled={saving}
                className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 transition-colors font-medium text-sm"
              >
                {en.users.promote}
              </button>
              <button
                onClick={handleDemote}
                disabled={saving}
                className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 transition-colors font-medium text-sm"
              >
                {en.users.demote}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
