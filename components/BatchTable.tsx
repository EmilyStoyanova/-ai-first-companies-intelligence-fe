'use client';

import type { Batch } from '@/lib/types';
import BatchRow from './BatchRow';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

interface Props {
  batches: Batch[];
  loading: boolean;
  onDelete: (id: string) => void;
  onView: (id: string, name: string) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onReEnrich?: () => void;
}

export default function BatchTable({ batches, loading, onDelete, onView, onNotify, onReEnrich }: Props) {
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';

  return (
    <section className="space-y-8">
      <div>
        <h4 className={`text-xl font-headline font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.batchHistory}</h4>
      </div>

      <div className={`rounded-xl overflow-hidden border shadow-2xl ${isDark ? 'bg-surface-container-low border-outline-variant/5' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'bg-surface-container-highest/30 border-outline-variant/10' : 'bg-slate-50 border-slate-200'}`}>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{t.batchId}</th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{t.date}</th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{t.totalDomains}</th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest w-1/4 whitespace-nowrap ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{t.progress}</th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{t.status}</th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest text-right whitespace-nowrap ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-outline-variant/5' : 'divide-slate-100'}`}>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className={`flex items-center justify-center gap-3 text-sm ${isDark ? 'text-on-surface-variant' : 'text-slate-400'}`}>
                      <span className="spinner" />
                      <span>{t.loadingBatches}</span>
                    </div>
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className={`flex flex-col items-center gap-4 ${isDark ? 'text-on-surface-variant' : 'text-slate-400'}`}>
                      <span className="material-symbols-outlined text-5xl opacity-30">inbox</span>
                      <p className="text-sm">{t.noBatches}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <BatchRow
                    key={batch.id}
                    batch={batch}
                    onDelete={onDelete}
                    onView={onView}
                    onNotify={onNotify}
                    onReEnrich={onReEnrich}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && batches.length > 0 && (
          <div className={`p-6 flex justify-between items-center text-xs font-medium border-t ${isDark ? 'bg-surface-container-lowest/50 text-on-surface-variant border-outline-variant/5' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            <p>Showing {batches.length} result{batches.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </section>
  );
}
