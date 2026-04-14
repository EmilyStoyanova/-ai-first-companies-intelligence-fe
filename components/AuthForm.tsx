'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken, setUserEmail } from '@/lib/api';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AuthForm() {
  const { t, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      setUserEmail(res.user.email);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.register(email, password, tenantName);
      setToken(res.token);
      setUserEmail(res.user.email);
      router.push('/dashboard?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-background' : 'bg-slate-50'} selection:bg-primary selection:text-on-primary`}>
      {/* Fixed header */}
      <header className={`fixed top-0 w-full z-50 ${isDark ? 'bg-background/80' : 'bg-slate-50/80'} backdrop-blur-xl flex justify-between items-center px-12 h-20 font-headline tracking-tight`}>
        <div className={`text-lg font-bold tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.appName}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'text-on-surface-variant hover:bg-surface-container-high hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}
            title="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button
            onClick={toggleLang}
            className={`text-sm uppercase tracking-widest font-medium transition-colors ${isDark ? 'text-on-surface-variant hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* Background accents (dark only) */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-surface-container-highest/20 to-transparent blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-surface-container-low/30 to-transparent blur-[160px] rounded-full" />
        </div>
      )}

      {/* Main */}
      <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <div className="w-full max-w-[480px]">
          {/* Auth card */}
          <div className={`p-8 md:p-12 rounded-xl ${isDark ? 'bg-surface-container-low' : 'bg-white shadow-sm border border-slate-200'}`}>
            {/* Tabs */}
            <div className="flex gap-8 mb-10">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`pb-2 font-headline font-semibold text-sm tracking-widest transition-all uppercase ${
                  tab === 'login'
                    ? isDark ? 'text-white border-b-2 border-white' : 'text-slate-900 border-b-2 border-slate-900'
                    : isDark ? 'text-on-surface-variant hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.login}
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`pb-2 font-headline font-semibold text-sm tracking-widest transition-all uppercase ${
                  tab === 'register'
                    ? isDark ? 'text-white border-b-2 border-white' : 'text-slate-900 border-b-2 border-slate-900'
                    : isDark ? 'text-on-surface-variant hover:text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.register}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 bg-error-container/30 border border-error/20 rounded text-error text-sm">
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-1 group/input">
                  <label className={`block text-[10px] uppercase tracking-[0.2em] font-bold transition-colors group-focus-within/input:text-primary ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="name@company.ai"
                    className={`w-full border-0 border-b focus:ring-0 py-3 px-0 transition-all placeholder:opacity-40 text-sm ${
                      isDark
                        ? 'bg-surface-container-low border-outline-variant/30 focus:border-primary text-white placeholder:text-outline'
                        : 'bg-white border-slate-200 focus:border-slate-900 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <div className="space-y-1 group/input">
                  <label className={`block text-[10px] uppercase tracking-[0.2em] font-bold transition-colors group-focus-within/input:text-primary ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>
                    {t.password}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`w-full border-0 border-b focus:ring-0 py-3 px-0 transition-all placeholder:opacity-40 text-sm ${
                      isDark
                        ? 'bg-surface-container-low border-outline-variant/30 focus:border-primary text-white placeholder:text-outline'
                        : 'bg-white border-slate-200 focus:border-slate-900 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 font-headline font-extrabold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded ${
                    isDark ? 'bg-primary text-on-primary' : 'bg-slate-900 text-white'
                  }`}
                >
                  {loading ? t.signingIn : t.signIn}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-8">
                <div className="space-y-1 group/input">
                  <label className={`block text-[10px] uppercase tracking-[0.2em] font-bold transition-colors group-focus-within/input:text-primary ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>
                    {t.tenantName}
                  </label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    required
                    autoFocus
                    placeholder="Acme Corp"
                    className={`w-full border-0 border-b focus:ring-0 py-3 px-0 transition-all placeholder:opacity-40 text-sm ${
                      isDark
                        ? 'bg-surface-container-low border-outline-variant/30 focus:border-primary text-white placeholder:text-outline'
                        : 'bg-white border-slate-200 focus:border-slate-900 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <div className="space-y-1 group/input">
                  <label className={`block text-[10px] uppercase tracking-[0.2em] font-bold transition-colors group-focus-within/input:text-primary ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.ai"
                    className={`w-full border-0 border-b focus:ring-0 py-3 px-0 transition-all placeholder:opacity-40 text-sm ${
                      isDark
                        ? 'bg-surface-container-low border-outline-variant/30 focus:border-primary text-white placeholder:text-outline'
                        : 'bg-white border-slate-200 focus:border-slate-900 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <div className="space-y-1 group/input">
                  <label className={`block text-[10px] uppercase tracking-[0.2em] font-bold transition-colors group-focus-within/input:text-primary ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>
                    {t.password}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className={`w-full border-0 border-b focus:ring-0 py-3 px-0 transition-all placeholder:opacity-40 text-sm ${
                      isDark
                        ? 'bg-surface-container-low border-outline-variant/30 focus:border-primary text-white placeholder:text-outline'
                        : 'bg-white border-slate-200 focus:border-slate-900 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
                <div className="flex items-start gap-3 py-2">
                  <span className={`material-symbols-outlined text-sm mt-0.5 ${isDark ? 'text-secondary' : 'text-slate-400'}`}>info</span>
                  <p className={`text-[11px] leading-relaxed italic ${isDark ? 'text-on-surface-variant/80' : 'text-slate-400'}`}>
                    {t.checkInbox.trim().replace(/^\./, '')}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 font-headline font-extrabold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded ${
                    isDark ? 'bg-primary text-on-primary' : 'bg-slate-900 text-white'
                  }`}
                >
                  {loading ? t.creating : t.createAccount}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {isDark && (
        <div className="fixed bottom-0 right-0 p-12 opacity-5 hidden lg:block pointer-events-none">
          <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'wght' 100" }}>
            analytics
          </span>
        </div>
      )}
    </div>
  );
}
