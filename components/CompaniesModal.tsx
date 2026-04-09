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

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
    fetch(batchId, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  async function fetch(id: string, p: number) {
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
    await fetch(batchId, p);
  }

  function statusColor(s: string): string {
    const map: Record<string, string> = {
      COMPLETED: 'var(--success)',
      FAILED: 'var(--danger)',
      CRAWLING: 'var(--primary)',
      PENDING: 'var(--text-muted)',
    };
    return map[s] || 'var(--text-muted)';
  }

  function renderTeam(team: TeamMember[]) {
    if (!team.length) return <span>—</span>;
    return (
      <span style={{ fontSize: 12, lineHeight: 1.7 }}>
        {team.slice(0, 4).map((m, i) => (
          <span key={i} style={{ display: 'block' }}>
            <strong>{m.name}</strong>
            {m.position && (
              <span style={{ color: 'var(--text-muted)' }}> ({m.position})</span>
            )}
            {m.email && (
              <>
                {' '}
                <a
                  href={`mailto:${m.email}`}
                  style={{ color: 'var(--primary)', fontSize: 11 }}
                >
                  {m.email}
                </a>
              </>
            )}
          </span>
        ))}
        {team.length > 4 && (
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
            +{team.length - 4} more
          </span>
        )}
      </span>
    );
  }

  function renderCompany(c: Company) {
    const profile = c.profile;
    const score = profile ? Math.round(profile.completionScore) : 0;
    const name = profile?.name || c.name || '—';

    let emails: string[] = [];
    if (profile?.emails) {
      emails = Array.isArray(profile.emails) ? profile.emails : [];
    }

    let team: TeamMember[] = [];
    if (profile?.team) {
      team = Array.isArray(profile.team) ? (profile.team as TeamMember[]) : [];
    }

    return (
      <tr key={c.id}>
        <td className="domain-cell">
          <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer">
            {c.domain}
          </a>
        </td>
        <td>{name}</td>
        <td>
          <span style={{ color: statusColor(c.crawlStatus), fontWeight: 500 }}>
            {c.crawlStatus}
          </span>
        </td>
        <td>
          <div className="score-cell">
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${score}%` }} />
            </div>
            <span>{score}%</span>
          </div>
        </td>
        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {emails.slice(0, 2).join(', ') || '—'}
        </td>
        <td>{renderTeam(team)}</td>
      </tr>
    );
  }

  if (!batchId) return null;

  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>{batchName}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="loading-state" style={{ padding: 60 }}>
              <span className="spinner" />
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ margin: 20 }}>{error}</div>
          )}

          {!loading && !error && data && (
            <>
              {data.data.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">🏢</div>
                  <p>{t.noCompanies}</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>{t.domain}</th>
                      <th>{t.name}</th>
                      <th>{t.status}</th>
                      <th>{t.score}</th>
                      <th>{t.emails}</th>
                      <th>{t.team}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map(renderCompany)}
                  </tbody>
                </table>
              )}

              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderTop: '1px solid var(--border)',
                    fontSize: 13,
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>
                    {t.showing}{' '}
                    {(page - 1) * (pagination?.limit ?? 50) + 1}–
                    {Math.min(page * (pagination?.limit ?? 50), pagination?.total ?? 0)}{' '}
                    {t.of} {pagination?.total}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {page > 1 && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => changePage(page - 1)}
                      >
                        {t.prev}
                      </button>
                    )}
                    {page < totalPages && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => changePage(page + 1)}
                      >
                        {t.next}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
