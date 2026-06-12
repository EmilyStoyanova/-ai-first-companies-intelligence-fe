'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { EmailTemplate } from '@/lib/types';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LangContext';

interface Props {
  onNotify: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

interface FormState {
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
}

const EMPTY_FORM: FormState = { name: '', subject: '', body: '', isDefault: false };

const PLACEHOLDERS = [
  '{{targetName}}',
  '{{targetDomain}}',
  '{{senderCompanyName}}',
  '{{senderWebsite}}',
  '{{senderContactName}}',
  '{{senderContactTitle}}',
  '{{senderContactEmail}}',
  '{{senderContactPhone}}',
];

export default function TemplatesCard({ onNotify }: Props) {
  const { theme } = useTheme();
  const { t } = useLang();
  const isDark = theme === 'dark';

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const data = await api.listTemplates();
      setTemplates(data);
    } catch (err) {
      onNotify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(tmpl: EmailTemplate) {
    setEditingId(tmpl.id);
    setForm({ name: tmpl.name, subject: tmpl.subject, body: tmpl.body, isDefault: tmpl.isDefault });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await api.updateTemplate(editingId, form);
        setTemplates((prev) => prev.map((t) => {
          if (form.isDefault && t.id !== editingId) return { ...t, isDefault: false };
          return t.id === editingId ? updated : t;
        }));
        onNotify(t.templateUpdated, 'success');
      } else {
        const created = await api.createTemplate(form);
        setTemplates((prev) => {
          const updated = form.isDefault ? prev.map((t) => ({ ...t, isDefault: false })) : prev;
          return [created, ...updated];
        });
        onNotify(t.templateCreated, 'success');
      }
      cancelForm();
    } catch (err) {
      onNotify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await api.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      onNotify(t.templateDeleted, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const updated = await api.setDefaultTemplate(id);
      setTemplates((prev) =>
        prev.map((tmpl) =>
          tmpl.id === id ? updated : { ...tmpl, isDefault: false }
        )
      );
      onNotify(t.templateDefaultSet, 'success');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : String(err), 'error');
    }
  }

  const inputBase = `w-full px-4 py-3 rounded-lg text-sm border transition-colors outline-none ${
    isDark
      ? 'bg-surface-container border-outline-variant/30 text-white placeholder:text-on-surface-variant/50 focus:border-primary/60'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400'
  }`;

  const labelBase = `block text-xs font-bold uppercase tracking-wide mb-1.5 ${
    isDark ? 'text-on-surface-variant' : 'text-slate-500'
  }`;

  return (
    <section>
      <div className="mb-8">
        <h2 className={`text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t.templatesTitle}
        </h2>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className={`relative border rounded-xl p-8 md:p-12 overflow-hidden ${isDark ? 'bg-surface-container-low border-outline-variant/15' : 'bg-white border-slate-200'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="relative max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl flex-shrink-0 ${isDark ? 'bg-surface-container-high border-outline-variant/20' : 'bg-slate-100 border-slate-200'}`}>
                  <span className={`material-symbols-outlined text-2xl ${isDark ? 'text-primary' : 'text-slate-700'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    mail
                  </span>
                </div>
                <div>
                  <h3 className={`text-xl font-headline font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.templatesTitle}</h3>
                  <p className={`text-sm ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{t.templatesSubtitle}</p>
                </div>
              </div>
              {!showForm && (
                <button
                  onClick={openNew}
                  className={`flex items-center gap-2 px-5 py-2.5 font-headline font-bold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all duration-200 rounded ${isDark ? 'bg-primary text-on-primary' : 'bg-slate-900 text-white'}`}
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  {t.templatesNew}
                </button>
              )}
            </div>

            {/* Form */}
            {showForm && (
              <div className={`rounded-xl p-6 border space-y-5 ${isDark ? 'bg-surface-container border-outline-variant/20' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <label className={labelBase}>{t.templateName}</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder={t.templateNamePlaceholder}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>{t.templateSubject}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder={t.templateSubjectPlaceholder}
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>{t.templateBody}</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder={t.templateBodyPlaceholder}
                    rows={12}
                    className={`${inputBase} resize-y font-mono text-xs leading-relaxed`}
                  />
                  <div className={`mt-2 text-xs ${isDark ? 'text-on-surface-variant/60' : 'text-slate-400'}`}>
                    <span className="font-medium">{t.availablePlaceholders}</span>{' '}
                    {PLACEHOLDERS.map((p, i) => (
                      <span key={p}>
                        <code className={`px-1 py-0.5 rounded text-[11px] ${isDark ? 'bg-surface-container-high text-primary' : 'bg-slate-100 text-slate-600'}`}>{p}</code>
                        {i < PLACEHOLDERS.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <label className={`flex items-center gap-2.5 text-sm cursor-pointer select-none ${isDark ? 'text-on-surface-variant' : 'text-slate-600'}`}>
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                    className={`rounded focus:ring-0 focus:ring-offset-0 ${isDark ? 'border-outline-variant/30 bg-surface-container-high text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                  />
                  {t.templateIsDefault}
                </label>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving || !form.name.trim() || !form.subject.trim() || !form.body.trim()}
                    className={`px-6 py-2.5 font-headline font-bold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded ${isDark ? 'bg-primary text-on-primary' : 'bg-slate-900 text-white'}`}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                        …
                      </span>
                    ) : t.templateSave}
                  </button>
                  <button
                    onClick={cancelForm}
                    className={`px-5 py-2.5 text-sm font-medium rounded transition-colors ${isDark ? 'text-on-surface-variant hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t.templateCancel}
                  </button>
                </div>
              </div>
            )}

            {/* Template list */}
            {loading ? (
              <div className={`text-sm ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>
                <span className="spinner inline-block mr-2" style={{ width: 14, height: 14, borderWidth: 2 }} />
              </div>
            ) : templates.length === 0 ? (
              <p className={`text-sm ${isDark ? 'text-on-surface-variant/60' : 'text-slate-400'}`}>{t.noTemplates}</p>
            ) : (
              <div className="space-y-3">
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className={`rounded-xl border p-5 transition-colors ${isDark ? 'bg-surface-container border-outline-variant/15 hover:border-outline-variant/30' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{tmpl.name}</span>
                          {tmpl.isDefault && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${isDark ? 'bg-primary/20 text-primary' : 'bg-slate-900 text-white'}`}>
                              {t.templateDefaultBadge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 truncate ${isDark ? 'text-on-surface-variant' : 'text-slate-500'}`}>{tmpl.subject}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {!tmpl.isDefault && (
                          <button
                            onClick={() => handleSetDefault(tmpl.id)}
                            className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${isDark ? 'text-on-surface-variant hover:text-white hover:bg-surface-container-high' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
                          >
                            {t.templateSetDefault}
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(tmpl)}
                          className={`p-1.5 rounded transition-colors ${isDark ? 'text-on-surface-variant hover:text-white hover:bg-surface-container-high' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'}`}
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(tmpl.id)}
                          disabled={deletingId === tmpl.id}
                          className={`p-1.5 rounded transition-colors disabled:opacity-40 ${isDark ? 'text-error/60 hover:text-error hover:bg-error-container/20' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}`}
                        >
                          {deletingId === tmpl.id
                            ? <span className="spinner inline-block" style={{ width: 14, height: 14, borderWidth: 2 }} />
                            : <span className="material-symbols-outlined text-base">delete</span>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
