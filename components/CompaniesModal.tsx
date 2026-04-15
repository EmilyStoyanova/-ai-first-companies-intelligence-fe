'use client';

import { useEffect, useState } from 'react';
import type { Company, DiscoveryCandidate, PaginatedCompanies, TeamMember } from '@/lib/types';
import { api } from '@/lib/api';
import { useLang } from '@/contexts/LangContext';

interface Props {
  batchId: string | null;
  batchName: string;
  isPersonaSearch: boolean;
  onClose: () => void;
}

type Tab = 'results' | 'candidates';

export default function CompaniesModal({ batchId, batchName, isPersonaSearch, onClose }: Props) {
  const { t } = useLang();

  // Results tab state
  const [data, setData] = useState<PaginatedCompanies | null>(null);
  const [page, setPage] = useState(1);
  const [loadingResults, setLoadingResults] = useState(false);
  const [errorResults, setErrorResults] = useState('');

  // Candidates tab state
  const [candidates, setCandidates] = useState<DiscoveryCandidate[] | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [errorCandidates, setErrorCandidates] = useState('');
  const [updatingDomain, setUpdatingDomain] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>('results');

  useEffect(() => {
    if (!batchId) return;
    setPage(1);
    setData(null);
    setCandidates(null);
    fetchPage(batchId, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  useEffect(() => {
    if (activeTab === 'candidates' && batchId && candidates === null) {
      fetchCandidates(batchId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function fetchPage(id: string, p: number) {
    setLoadingResults(true);
    setErrorResults('');
    try {
      const res = await api.getCompanies(id, p);
      setData(res);
      setPage(p);
    } catch (err: unknown) {
      setErrorResults(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingResults(false);
    }
  }

  async function fetchCandidates(id: string) {
    setLoadingCandidates(true);
    setErrorCandidates('');
    try {
      const res = await api.getCandidates(id);
      setCandidates(res);
    } catch (err: unknown) {
      setErrorCandidates(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingCandidates(false);
    }
  }

  async function handleCandidateAction(domain: string, action: 'exclude' | 'include') {
    if (!batchId) return;
    setUpdatingDomain(domain);
    try {
      await api.updateCandidate(batchId, domain, action);
      // Refresh both tabs
      await Promise.all([
        fetchCandidates(batchId),
        fetchPage(batchId, page),
      ]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setUpdatingDomain(null);
    }
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

  function candidateStatusStyle(s: DiscoveryCandidate['status']): string {
    const map: Record<DiscoveryCandidate['status'], string> = {
      KEPT:     'bg-primary/10 text-primary',
      FILTERED: 'bg-secondary/10 text-secondary',
      BLOCKED:  'bg-surface-container-highest text-on-surface-variant',
      EXCLUDED: 'bg-error/10 text-error',
    };
    return map[s];
  }

  function candidateStatusLabel(s: DiscoveryCandidate['status']): string {
    const map: Record<DiscoveryCandidate['status'], string> = {
      KEPT:     t.candidateKept,
      FILTERED: t.candidateFiltered,
      BLOCKED:  t.candidateBlocked,
      EXCLUDED: t.candidateExcluded,
    };
    return map[s];
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
        {isPersonaSearch && (
          <td className="px-6 py-4">
            <button
              onClick={() => handleCandidateAction(c.domain, 'exclude')}
              disabled={updatingDomain === c.domain}
              className="text-xs px-2 py-1 rounded border border-error/30 text-error hover:bg-error/10 transition-all disabled:opacity-40"
            >
              {updatingDomain === c.domain ? '…' : t.excludeBtn}
            </button>
          </td>
        )}
      </tr>
    );
  }

  function renderCandidates() {
    if (loadingCandidates) {
      return (
        <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant text-sm">
          <span className="spinner" />
          <span>{t.loading}</span>
        </div>
      );
    }
    if (errorCandidates) {
      return (
        <div className="m-8 px-4 py-3 bg-error-container/30 border border-error/20 rounded text-error text-sm">
          {errorCandidates}
        </div>
      );
    }
    if (!candidates || candidates.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl opacity-30">filter_list</span>
          <p className="text-sm text-center max-w-sm">{t.noCandidates}</p>
        </div>
      );
    }

    const counts = candidates.reduce(
      (acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc; },
      {} as Record<string, number>,
    );

    return (
      <div className="overflow-x-auto">
        {/* Summary pills */}
        <div className="flex gap-2 px-6 py-3 border-b border-outline-variant/10 flex-wrap">
          {(['KEPT', 'FILTERED', 'BLOCKED', 'EXCLUDED'] as const).map((s) =>
            counts[s] ? (
              <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium ${candidateStatusStyle(s)}`}>
                {candidateStatusLabel(s)} · {counts[s]}
              </span>
            ) : null,
          )}
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest/30 border-b border-outline-variant/10">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t.domain}</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t.candidateTitle}</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t.status}</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-surface-container-high/50 transition-colors">
                <td className="px-6 py-4">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary font-medium text-sm transition-colors"
                  >
                    {c.domain}
                  </a>
                </td>
                <td className="px-6 py-4 text-xs text-on-surface-variant max-w-xs truncate">
                  {c.title || '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${candidateStatusStyle(c.status)}`}>
                    {candidateStatusLabel(c.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {c.status === 'KEPT' && (
                    <button
                      onClick={() => handleCandidateAction(c.domain, 'exclude')}
                      disabled={updatingDomain === c.domain}
                      className="text-xs px-2 py-1 rounded border border-error/30 text-error hover:bg-error/10 transition-all disabled:opacity-40"
                    >
                      {updatingDomain === c.domain ? '…' : t.excludeBtn}
                    </button>
                  )}
                  {(c.status === 'FILTERED' || c.status === 'BLOCKED' || c.status === 'EXCLUDED') && (
                    <button
                      onClick={() => handleCandidateAction(c.domain, 'include')}
                      disabled={updatingDomain === c.domain}
                      className="text-xs px-2 py-1 rounded border border-primary/30 text-primary hover:bg-primary/10 transition-all disabled:opacity-40"
                    >
                      {updatingDomain === c.domain ? '…' : t.includeBtn}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

        {/* Tabs — only shown for persona search batches */}
        {isPersonaSearch && (
          <div className="flex border-b border-outline-variant/10 px-8 flex-shrink-0">
            {(['results', 'candidates'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                {tab === 'results' ? t.resultsTab : t.candidatesTab}
              </button>
            ))}
          </div>
        )}

        {/* Modal body */}
        <div className="overflow-y-auto flex-1">
          {activeTab === 'results' && (
            <>
              {loadingResults && (
                <div className="flex items-center justify-center py-20 gap-3 text-on-surface-variant text-sm">
                  <span className="spinner" />
                  <span>Loading companies…</span>
                </div>
              )}
              {errorResults && (
                <div className="m-8 px-4 py-3 bg-error-container/30 border border-error/20 rounded text-error text-sm">
                  {errorResults}
                </div>
              )}
              {!loadingResults && !errorResults && data && (
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
                            {isPersonaSearch && (
                              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">{t.actions}</th>
                            )}
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
            </>
          )}

          {activeTab === 'candidates' && renderCandidates()}
        </div>

        {/* Pagination footer — only on results tab */}
        {activeTab === 'results' && !loadingResults && !errorResults && totalPages > 1 && (
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
                  onClick={() => { if (batchId) fetchPage(batchId, page - 1); }}
                  className="px-3 py-1.5 border border-outline-variant/20 rounded hover:bg-surface-container-high transition-all hover:text-white"
                >
                  {t.prev}
                </button>
              )}
              {page < totalPages && (
                <button
                  onClick={() => { if (batchId) fetchPage(batchId, page + 1); }}
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
