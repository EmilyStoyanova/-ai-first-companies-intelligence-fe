'use client';

import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useLang } from '@/contexts/LangContext';

interface Props {
  onUploaded: () => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function UploadCard({ onUploaded, onNotify }: Props) {
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [forceRecrawl, setForceRecrawl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragover, setIsDragover] = useState(false);

  function handleFile(file: File) {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.csv', '.xlsx', '.xls'].includes(ext)) {
      onNotify('Only CSV and Excel files are supported.', 'error');
      return;
    }
    setSelectedFile(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragover(true);
  }

  function onDragLeave() {
    setIsDragover(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragover(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }

  async function upload() {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      const result = await api.uploadBatch(fd, forceRecrawl);
      onNotify(
        `Batch created! ${result.totalCompanies} companies (${result.jobsEnqueued} queued, ${result.skipped} cached).`,
        'success',
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploaded();
    } catch (err: unknown) {
      onNotify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setUploading(false);
    }
  }

  const cardClass = [
    'upload-card',
    isDragover ? 'dragover' : '',
    selectedFile ? 'has-file' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className="upload-icon">📁</div>
      <h3>{t.uploadTitle}</h3>
      <p>{t.uploadSubtitle}</p>

      <input
        ref={fileInputRef}
        id="file-input"
        type="file"
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      {selectedFile && (
        <div className="file-name">Selected: {selectedFile.name}</div>
      )}

      <div style={{ marginTop: 16 }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => fileInputRef.current?.click()}
          type="button"
          style={{ margin: '0 auto', display: 'block' }}
        >
          {t.chooseFile}
        </button>

        <div className="upload-actions" style={{ marginTop: 12 }}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={forceRecrawl}
              onChange={(e) => setForceRecrawl(e.target.checked)}
            />
            {t.forceRecrawl}
          </label>

          <button
            className="btn btn-primary btn-sm"
            disabled={!selectedFile || uploading}
            onClick={upload}
            type="button"
          >
            {uploading ? t.uploading : t.uploadProcess}
          </button>
        </div>
      </div>
    </div>
  );
}
