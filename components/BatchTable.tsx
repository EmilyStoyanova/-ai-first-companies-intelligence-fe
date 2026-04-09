'use client';

import type { Batch } from '@/lib/types';
import BatchRow from './BatchRow';
import { useLang } from '@/contexts/LangContext';

interface Props {
  batches: Batch[];
  loading: boolean;
  onDelete: (id: string) => void;
  onView: (id: string, name: string) => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function BatchTable({ batches, loading, onDelete, onView, onNotify }: Props) {
  const { t } = useLang();

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <span className="section-title" style={{ marginBottom: 0 }}>{t.batches}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>{t.file}</th>
            <th>{t.status}</th>
            <th>{t.progress}</th>
            <th>{t.count}</th>
            <th>{t.created}</th>
            <th>{t.actions}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>
                <div className="loading-state">
                  <span className="spinner" />
                </div>
              </td>
            </tr>
          ) : batches.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className="empty-state">
                  <div className="icon">📋</div>
                  <p>{t.noBatches}</p>
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
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
