'use client';

import { useRouter } from 'next/navigation';
import { clearAuth, getUserEmail } from '@/lib/api';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { t, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const email = getUserEmail();

  function logout() {
    clearAuth();
    router.push('/');
  }

  return (
    <header className="dashboard-header">
      <div className="header-brand">
        {t.appName}
      </div>
      <div className="header-user">
        <span>{email}</span>
        <button className="btn btn-ghost btn-sm" onClick={toggleTheme} title="Toggle dark mode">
          {theme === 'light' ? '🌙' : '☀'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={toggleLang}>
          {t.langToggle}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={logout}>
          {t.logout}
        </button>
      </div>
    </header>
  );
}
