'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getUserEmail } from '@/lib/api';
import type { TenantProfile } from '@/lib/types';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from './Header';

export default function SettingsForm() {
  const { t } = useLang();
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';

  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactPersonTitle, setContactPersonTitle] = useState('');
  const [contactPersonEmail, setContactPersonEmail] = useState('');
  const [contactPersonPhone, setContactPersonPhone] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }

    api.getTenantProfile()
      .then((p) => {
        setProfile(p);
        setName(p.name ?? '');
        setWebsite(p.website ?? '');
        setContactPersonName(p.contactPersonName ?? '');
        setContactPersonTitle(p.contactPersonTitle ?? '');
        setContactPersonEmail(p.contactPersonEmail ?? getUserEmail());
        setContactPersonPhone(p.contactPersonPhone ?? '');
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setBanner(null);
    try {
      await api.updateTenantProfile({
        name:               name               || undefined,
        website:            website            || null,
        contactPersonName:  contactPersonName  || null,
        contactPersonTitle: contactPersonTitle || null,
        contactPersonEmail: contactPersonEmail || null,
        contactPersonPhone: contactPersonPhone || null,
      });
      setBanner({ msg: t.settingsSaved, type: 'success' });
      setTimeout(() => setBanner(null), 4000);
    } catch (err: unknown) {
      setBanner({ msg: err instanceof Error ? err.message : t.settingsFailed, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  const inputCls = `w-full border-0 border-b focus:ring-0 py-3 px-0 transition-all placeholder:opacity-40 text-sm ${
    isDark
      ? 'bg-surface-container-low border-outline-variant/30 focus:border-primary text-white placeholder:text-outline'
      : 'bg-white border-slate-200 focus:border-slate-900 text-slate-900 placeholder:text-slate-400'
  }`;

  const labelCls = `block text-[10px] uppercase tracking-[0.2em] font-bold transition-colors group-focus-within/input:text-primary ${
    isDark ? 'text-on-surface-variant' : 'text-slate-500'
  }`;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-background' : 'bg-slate-50'}`}>
        <Header />
        <div className="pt-20 flex items-center justify-center h-screen">
          <span className={`text-sm ${isDark ? 'text-on-surface-variant' : 'text-slate-400'}`}>{t.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-background' : 'bg-slate-50'}`}>
      <Header />

      <main className="pt-28 pb-16 px-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className={`font-headline font-bold text-2xl tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.settingsTitle}
          </h1>
          <p className={`text-sm ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>
            {t.settingsSubtitle}
          </p>
        </div>

        {banner && (
          <div className={`mb-6 px-4 py-3 rounded text-sm border ${
            banner.type === 'success'
              ? isDark ? 'bg-surface-container border-outline-variant/20 text-white' : 'bg-green-50 border-green-200 text-green-800'
              : isDark ? 'bg-error-container/30 border-error/20 text-error' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {banner.msg}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className={`p-8 rounded-xl mb-6 ${isDark ? 'bg-surface-container-low' : 'bg-white shadow-sm border border-slate-200'}`}>
            <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-8 ${isDark ? 'text-on-surface-variant/60' : 'text-slate-400'}`}>
              {t.accountSection}
            </p>
            <div className="space-y-6">
              <div className="space-y-1 group/input">
                <label className={labelCls}>{t.tenantName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-xl ${isDark ? 'bg-surface-container-low' : 'bg-white shadow-sm border border-slate-200'}`}>
            <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-8 ${isDark ? 'text-on-surface-variant/60' : 'text-slate-400'}`}>
              {t.senderSection}
            </p>
            <div className="space-y-6">
              <div className="space-y-1 group/input">
                <label className={labelCls}>{t.contactPersonName}</label>
                <input
                  type="text"
                  value={contactPersonName}
                  onChange={(e) => setContactPersonName(e.target.value)}
                  placeholder={t.contactPersonNamePlaceholder}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1 group/input">
                <label className={labelCls}>{t.contactPersonTitle}</label>
                <input
                  type="text"
                  value={contactPersonTitle}
                  onChange={(e) => setContactPersonTitle(e.target.value)}
                  placeholder={t.contactPersonTitlePlaceholder}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1 group/input">
                  <label className={labelCls}>{t.email}</label>
                  <input
                    type="email"
                    value={contactPersonEmail}
                    onChange={(e) => setContactPersonEmail(e.target.value)}
                    placeholder="name@company.ai"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1 group/input">
                  <label className={labelCls}>{t.contactPersonPhone}</label>
                  <input
                    type="tel"
                    value={contactPersonPhone}
                    onChange={(e) => setContactPersonPhone(e.target.value)}
                    placeholder={t.contactPersonPhonePlaceholder}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-1 group/input">
                <label className={labelCls}>{t.companyWebsite}</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder={t.companyWebsitePlaceholder}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`h-12 px-8 font-headline font-extrabold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded ${
                isDark ? 'bg-primary text-on-primary' : 'bg-slate-900 text-white'
              }`}
            >
              {saving ? t.settingsSaving : t.settingsSave}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
