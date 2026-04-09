'use client';

import { useEffect, useRef, useState } from 'react';
import type { Batch } from '@/lib/types';
import { api } from '@/lib/api';
import { useLang } from '@/contexts/LangContext';

interface Props {
  batch: Batch;
  onDelete: (id: string) => void;
  onView: (id: string, name: string) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

interface Anim {
  current: number;   // where the counter is right now
  target: number;    // where it should reach
  timer: ReturnType<typeof setInterval> | null;
  finalized: boolean; // true once we've called setShowFinal
}

export default function BatchRow({ batch, onDelete, onView, onNotify }: Props) {
  const { t } = useLang();
  const realPct = Math.round(batch.completionPercentage);
  const isDone = batch.status === 'COMPLETED' || batch.status === 'FAILED';

  // Batches already done on page-load show their final state immediately, no animation.
  const [displayPct, setDisplayPct] = useState(() => (isDone ? realPct : 0));
  const [showFinal, setShowFinal] = useState(() => isDone);

  const anim = useRef<Anim>({
    current: isDone ? realPct : 0,
    target: realPct,
    timer: null,
    finalized: isDone,
  });

  // ── Ticker ────────────────────────────────────────────────────────────────
  function startTicker() {
    if (anim.current.timer || anim.current.finalized) return;

    anim.current.timer = setInterval(() => {
      const a = anim.current;

      if (a.current < a.target) {
        a.current = Math.min(
          a.current + (a.target - a.current > 15 ? 2 : 1),
          a.target,
        );
        setDisplayPct(a.current);
      }

      // Reached target while finalized → reveal the completed state
      if (a.finalized && a.current >= a.target) {
        clearInterval(a.timer!);
        a.timer = null;
        setShowFinal(true);
      }
    }, 80);
  }

  function stopTicker() {
    if (anim.current.timer) {
      clearInterval(anim.current.timer);
      anim.current.timer = null;
    }
  }

  // ── Single effect: react to every status/percentage change ────────────────
  useEffect(() => {
    const a = anim.current;

    // Always keep target up to date
    a.target = realPct;

    if (batch.status === 'PROCESSING') {
      // Start ticker if not already running
      startTicker();
      return;
    }

    if (isDone && !a.finalized) {
      a.finalized = true;

      if (a.timer) {
        // Ticker is running — it will call setShowFinal when current reaches target.
        // Just make sure target is set (done above).
      } else if (a.current >= realPct) {
        // Already at the right percentage (e.g. PENDING → COMPLETED instantly)
        setDisplayPct(realPct);
        setShowFinal(true);
      } else {
        // Was PENDING, never animated — run a quick catch-up
        startTicker();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch.status, realPct]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => () => stopTicker(), []);

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete() {
    const name = batch.fileName || 'this batch';
    if (!confirm(`${t.confirmDelete} "${name}"?\n\n${t.confirmDeleteMsg}`)) return;
    try {
      await api.deleteBatch(batch.id);
      stopTicker();
      onDelete(batch.id);
      onNotify(t.batchDeleted, 'success');
    } catch (err: unknown) {
      onNotify(t.deleteFailed + (err instanceof Error ? err.message : String(err)), 'error');
    }
  }

  // ── Download ───────────────────────────────────────────────────────────────
  async function handleDownload(format: 'csv' | 'xlsx') {
    try {
      const res = await api.downloadBatch(batch.id, format);
      const blob = await (res as unknown as Response).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch-${batch.id.slice(0, 8)}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      onNotify(t.downloadFailed + (err instanceof Error ? err.message : String(err)), 'error');
    }
  }

  // ── Badge ──────────────────────────────────────────────────────────────────
  function Badge() {
    // While animating toward completion, keep showing "Processing"
    const status = showFinal ? batch.status : batch.status === 'COMPLETED' || batch.status === 'FAILED' ? (anim.current.timer ? 'PROCESSING' : batch.status) : batch.status;
    const map: Record<string, React.ReactNode> = {
      PROCESSING: <span className="badge badge-processing">⟳ {t.processing}</span>,
      COMPLETED:  <span className="badge badge-completed">✓ {t.done}</span>,
      FAILED:     <span className="badge badge-failed">✕ {t.failed}</span>,
      PENDING:    <span className="badge badge-pending">{t.pending}</span>,
    };
    return <>{map[status] ?? <span className="badge badge-pending">{status}</span>}</>;
  }

  const barClass = `progress-bar${showFinal && batch.status === 'COMPLETED' ? ' done' : ''}`;

  const date = new Date(batch.createdAt).toLocaleDateString('bg-BG', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 500 }}>{batch.fileName || 'Unknown'}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{batch.id.slice(0, 8)}…</div>
      </td>

      <td><Badge /></td>

      <td>
        <div className="progress-wrap">
          <div className="progress">
            <div className={barClass} style={{ width: `${displayPct}%` }} />
          </div>
          <span className="progress-pct">{displayPct}%</span>
        </div>
      </td>

      <td>{batch.processedCompanies} / {batch.totalCompanies}</td>

      <td>{date}</td>

      <td>
        <div className="actions">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onView(batch.id, batch.fileName || 'Batch')}
          >
            {t.view}
          </button>

          {showFinal && batch.status === 'COMPLETED' && (
            <>
              <button className="btn btn-sm btn-secondary" onClick={() => handleDownload('csv')}>CSV</button>
              <button className="btn btn-sm btn-secondary" onClick={() => handleDownload('xlsx')}>XLSX</button>
            </>
          )}

          <button className="btn btn-sm btn-danger" onClick={handleDelete} title={t.delete}>✕</button>
        </div>
      </td>
    </tr>
  );
}
