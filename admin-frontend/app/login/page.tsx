'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { Globe, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('auth.loginSuccess'));
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-4">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>

      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center h-14 w-14 bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('common.appName')}
            </h1>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/60 p-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('auth.signIn')}
          </h2>
          <p className="text-[13px] text-slate-500 mt-1 mb-7">
            {t('auth.signInSubtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {t('auth.signInButton')}
            </Button>
          </form>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-[12px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{t('auth.secureConnection')}</span>
        </div>
      </div>
    </div>
  );
}
