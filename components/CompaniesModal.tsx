'use client';

import { useEffect, useState } from 'react';
import type { Company, PaginatedCompanies, TeamMember } from '@/lib/types';
import { api } from '@/lib/api';
import { useLang } from '@/contexts/LangContext';

interface Props {
  batchId: string | null;
  batchName: string;
  onClose: () => void;
}

export default function CompaniesModal({ batchId, batchName, onClose }: Props) {
  const { t } = useLang();
  const [data, setData] = useState<PaginatedCompanies | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!batchId) return;
    setPage(1);
    setData(null);
    fetchPage(batchId, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  async function fetchPage(id: string, p: number) {
    setLoading(true);
    setError('');
    try {
      const res = await api.getCompanies(id, p);
      setData(res);
      setPage(p);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function changePage(p: number) {
    if (!batchId) return;
    await fetchPage(batchId, p);
  }

  function crawlStatusBadge(s: string) {
    const map: Record<string, string> = {
      COMPLETED: 'text-primary',
      FAILED: 'text-error',
      CRAWLING: 'text-secondary',
      PENDING: 'text-on-surface-variant',
    };
    return map[s] || 'text-on-surface-variant';
  }

  function renderTeam(team: TeamMember[]) {
    if (!team.length) return <span className="text-on-surface-variant">—</span>;
    return (
      <div className="space-y-1">
        {team.slice(0, 3).map((m, i) => (
          <div key={i} className="text-xs leading-relaxed">
            <span className="font-medium text-white">{m.name}</span>
            {m.position && <span className="text-on-surface-variant"> · {m.position}</span>}
            {m.email && (
              <a href={`mailto:${m.email}`} className="block text-secondary text-[11px] hover:underline">
                {m.email}
              </a>
            )}
          </div>
        ))}
        {team.length > 3 && (
          <span className="text-on-surface-variant text-[11px]">+{team.length - 3} more</span>
        )}
      </div>
    );
  }

  function renderCompany(c: Company) {
    const profile = c.profile;
    const score = profile ? Math.round(profile.completionScore) : 0;
    const name = profile?.name || c.name || '—';
    const emails: string[] = Array.isArray(profile?.emails) ? profile!.emails : [];
    const team: TeamMember[] = Array.isArray(profile?.team) ? (profile!.team as TeamMember[]) : [];

    return (
      <tr key={c.id} className="hover:bg-surface-container-high/50 transition-colors">
        <td className="px-6 py-4">
          <a
            href={`https://${c.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary font-medium text-sm transition-colors"
          >
            {c.domain}
          </a>
        </td>
        <td className="px-6 py-4 text-sm text-white">{name}</td>
        <td className="px-6 py-4">
          <span className={`text-xs font-bold uppercase tracking-wide ${crawlStatusBadge(c.crawlStatus)}`}>
            {c.crawlStatus}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs text-on-surface-variant">{score}%</span>
          </div>
        </td>
        <td className="px-6 py-4 text-xs text-on-surface-variant">
          {emails.slice(0, 2).join(', ') || '—'}
        </td>
        <td className="px-6 py-4">{renderTeam(team)}</td>
      </tr>
    );
  }

  if (!batchId) return null;

  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;

  return (
    <div
      className="fixed inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-headline font-bold text-lg">{batchName}</h2>
            {data && (
              <p className="text-on-surface-variant text-xs mt-0.5">
                {pagination?.total ?? 0} companies found
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-highest rounded text-on-surface-variant hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant text-sm">
              <span className="spinner" />
              <span>Loading companies…</span>
            </div>
          )}

          {error && (
            <div className="m-8 px-4 py-3 bg-error-container/30 border border-error/20 rounded text-error text-sm">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              {data.data.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl opacity-30">domain</span>
                  <p className="text-sm">{t.noCompanies}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-highest/30 border-b border-outline-variant/10">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{t.domain}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{t.name}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{t.status}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{t.score}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{t.emails}</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{t.team}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/5">
                      {data.data.map(renderCompany)}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination footer */}
        {!loading && !error && totalPages > 1 && (
          <div className="px-8 py-5 border-t border-outline-variant/10 flex justify-between items-center text-xs text-on-surface-variant font-medium flex-shrink-0">
            <span>
              {t.showing}{' '}
              {(page - 1) * (pagination?.limit ?? 50) + 1}–
              {Math.min(page * (pagination?.limit ?? 50), pagination?.total ?? 0)}{' '}
              {t.of} {pagination?.total}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <button
                  onClick={() => changePage(page - 1)}
                  className="px-3 py-1.5 border border-outline-variant/20 rounded hover:bg-surface-container-high transition-all hover:text-white"
                >
                  {t.prev}
                </button>
              )}
              {page < totalPages && (
                <button
                  onClick={() => changePage(page + 1)}
                  className="px-3 py-1.5 border border-outline-variant/20 rounded hover:bg-surface-container-high transition-all hover:text-white"
                >
                  {t.next}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
