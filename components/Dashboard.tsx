'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, clearAuth, getUserEmail } from '@/lib/api';
import type { Batch } from '@/lib/types';
import { useLang } from '@/contexts/LangContext';
import Header from './Header';
import UploadCard from './UploadCard';
import BatchTable from './BatchTable';
import CompaniesModal from './CompaniesModal';

interface Toast {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export default function Dashboard() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modal state
  const [modalBatchId, setModalBatchId] = useState<string | null>(null);
  const [modalBatchName, setModalBatchName] = useState('');

  // Banner (verified / registered)
  const [banner, setBanner] = useState<{ msg: string; type: string } | null>(null);

  // Auth guard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }

    // URL param banners
    const verified = searchParams.get('verified');
    const registered = searchParams.get('registered');
    const err = searchParams.get('error');

    if (verified === 'true') {
      setBanner({ msg: t.verifiedBanner, type: 'success' });
      window.history.replaceState({}, '', '/dashboard');
      setTimeout(() => setBanner(null), 6000);
    } else if (registered === 'true') {
      setBanner({ msg: `${t.registeredBanner} ${getUserEmail()}${t.checkInbox}`, type: 'warning' });
      window.history.replaceState({}, '', '/dashboard');
    } else if (err) {
      setBanner({ msg: t.invalidLink, type: 'error' });
    }

    loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function notify(msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 7000);
  }

  async function loadBatches() {
    try {
      const data = await api.listBatches();
      setBatches(data);
      setLoadingBatches(false);

      const hasProcessing = data.some((b) => b.status === 'PROCESSING');
      if (hasProcessing) startPolling(); else stopPolling();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        clearAuth();
        router.push('/');
        return;
      }
      setLoadingBatches(false);
      notify(msg, 'error');
    }
  }

  function startPolling() {
    if (pollRef.current) return;
    pollRef.current = setInterval(loadBatches, 3000);
  }

  function stopPolling() {
    if (!pollRef.current) return;
    clearInterval(pollRef.current);
    pollRef.current = null;
  }

  // Cleanup on unmount
  useEffect(() => () => stopPolling(), []);

  function handleDelete(id: string) {
    setBatches((prev) => prev.filter((b) => b.id !== id));
  }

  function handleUploaded() {
    setLoadingBatches(true);
    loadBatches();
  }

  function openModal(id: string, name: string) {
    setModalBatchId(id);
    setModalBatchName(name);
  }

  function closeModal() {
    setModalBatchId(null);
  }

  return (
    <>
      <Header />

      {/* Toasts */}
      <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`alert alert-${toast.type}`} style={{ margin: 0, minWidth: 260, boxShadow: 'var(--shadow)' }}>
            {toast.msg}
          </div>
        ))}
      </div>

      {/* Banner */}
      {banner && (
        <div style={{ maxWidth: 1100, margin: '16px auto 0', padding: '0 24px' }}>
          <div className={`alert alert-${banner.type}`}>{banner.msg}</div>
        </div>
      )}

      <main className="main-content">
        <UploadCard onUploaded={handleUploaded} onNotify={notify} />

        <BatchTable
          batches={batches}
          loading={loadingBatches}
          onDelete={handleDelete}
          onView={openModal}
          onNotify={notify}
        />
      </main>

      {modalBatchId && (
        <CompaniesModal
          batchId={modalBatchId}
          batchName={modalBatchName}
          onClose={closeModal}
        />
      )}
    </>
  );
}
