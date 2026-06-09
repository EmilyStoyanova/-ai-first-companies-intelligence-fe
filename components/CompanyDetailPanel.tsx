'use client';

import { useState } from 'react';
import type { Company, TeamMember } from '@/lib/types';
import { useLang } from '@/contexts/LangContext';

interface Props {
  company: Company;
  onClose: () => void;
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'facebook',
  linkedin: 'work',
  instagram: 'photo_camera',
  twitter: 'alternate_email',
  youtube: 'play_circle',
};

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-outline-variant/10 last:border-0">
      <div className="px-6 pt-5 pb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{title}</span>
      </div>
      <div className="px-6 pb-5">{children}</div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant/15 leading-relaxed">
      {label}
    </span>
  );
}

function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="text-[10px] font-medium px-2 py-0.5 rounded border border-outline-variant/20 text-on-surface-variant hover:text-white hover:border-outline-variant/40 transition-all flex-shrink-0"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

export default function CompanyDetailPanel({ company, onClose }: Props) {
  const { t } = useLang();
  const profile = company.profile;
  const personalized = company.personalizedContents?.[0];

  const score = profile ? Math.round(profile.completionScore) : 0;
  const emails: string[] = Array.isArray(profile?.emails) ? profile!.emails : [];
  const phones: string[] = Array.isArray(profile?.phones) ? profile!.phones : [];
  const services: string[] = Array.isArray(profile?.services) ? profile!.services : [];
  const team: TeamMember[] = Array.isArray(profile?.team) ? profile!.team as TeamMember[] : [];
  const socialLinks: Record<string, string> = profile?.socialLinks ?? {};

  const statusColor: Record<string, string> = {
    COMPLETED: 'text-primary',
    FAILED:    'text-error',
    CRAWLING:  'text-secondary',
    PENDING:   'text-on-surface-variant',
    BLOCKED:   'text-amber-400',
  };

  const statusLabel: Record<string, string> = {
    COMPLETED: 'COMPLETED',
    FAILED:    'FAILED',
    CRAWLING:  'CRAWLING',
    PENDING:   'PENDING',
    BLOCKED:   'Bot protected',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[300]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[520px] bg-surface-container-low border-l border-outline-variant/10 z-[310] flex flex-col shadow-2xl overflow-hidden animate-slide-in-right">

        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-white font-headline font-bold text-lg leading-tight truncate">
                {profile?.name || company.name || company.domain}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:underline"
                >
                  {company.domain}
                </a>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${statusColor[company.crawlStatus] ?? 'text-on-surface-variant'}`}>
                  {statusLabel[company.crawlStatus] ?? company.crawlStatus}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-white transition-all flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Score bar */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs text-on-surface-variant font-medium w-8 text-right">{score}%</span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Bot-protection notice */}
          {company.crawlStatus === 'BLOCKED' && (
            <div className="mx-6 mt-5 px-4 py-3 rounded-lg border border-amber-400/20 bg-amber-400/5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[18px] text-amber-400 flex-shrink-0 mt-0.5">shield</span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-1">Bot protection detected</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {company.crawlNote || 'Site is protected by human verification. Automated crawling could not access the content.'}
                </p>
              </div>
            </div>
          )}

          {/* Login-protected site notice */}
          {profile?.loginProtected && (
            <div className="mx-6 mt-5 px-4 py-3 rounded-lg border border-blue-400/20 bg-blue-400/5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[18px] text-blue-400 flex-shrink-0 mt-0.5">lock</span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">
                  Login-protected site
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Recovered company identity from visible branding / logo.
                </p>
                {profile.companyNameFromLogo && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-white font-medium">{profile.companyNameFromLogo}</span>
                    {!!profile.logoNameConfidence && profile.logoNameConfidence > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400/15 text-blue-300 font-medium">
                        {profile.logoNameConfidence}% confidence
                      </span>
                    )}
                  </div>
                )}
                {profile.sloganFromLogo && (
                  <p className="text-[11px] text-on-surface-variant/70 mt-1 italic">{profile.sloganFromLogo}</p>
                )}
              </div>
            </div>
          )}

          {/* Profile */}
          <Section title={t.reviewProfile} icon="apartment">
            <div className="space-y-3">
              {(profile?.industry || profile?.foundingYear) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {profile.industry && (
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      {profile.industry}
                    </span>
                  )}
                  {profile.foundingYear && (
                    <span className="text-xs text-on-surface-variant">
                      {t.reviewFounded} {profile.foundingYear}
                    </span>
                  )}
                </div>
              )}
              {profile?.description ? (
                <p className="text-sm text-on-surface-variant leading-relaxed">{profile.description}</p>
              ) : (
                <p className="text-xs text-on-surface-variant/50 italic">{t.reviewNoData}</p>
              )}
              {profile?.location && (
                <div className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant mt-0.5 flex-shrink-0">location_on</span>
                  <span className="text-sm text-on-surface-variant">{profile.location}</span>
                </div>
              )}
            </div>
          </Section>

          {/* Contact */}
          {(emails.length > 0 || phones.length > 0 || Object.keys(socialLinks).length > 0) && (
            <Section title={t.reviewContact} icon="contacts">
              <div className="space-y-3">
                {emails.length > 0 && (
                  <div className="space-y-1">
                    {emails.map((email) => (
                      <div key={email} className="flex items-center justify-between gap-2 group">
                        <a
                          href={`mailto:${email}`}
                          className="text-sm text-secondary hover:underline truncate"
                        >
                          {email}
                        </a>
                        <CopyButton text={email} label={t.reviewCopy} copiedLabel={t.reviewCopied} />
                      </div>
                    ))}
                  </div>
                )}
                {phones.length > 0 && (
                  <div className="space-y-1">
                    {phones.map((phone) => (
                      <div key={phone} className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant flex-shrink-0">call</span>
                        <a href={`tel:${phone}`} className="text-sm text-on-surface-variant hover:text-white transition-colors">
                          {phone}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                {Object.keys(socialLinks).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(socialLinks).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-white border border-outline-variant/20 px-2 py-1 rounded transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {SOCIAL_ICONS[key] ?? 'link'}
                        </span>
                        {key}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Services */}
          {services.length > 0 && (
            <Section title={t.reviewServices} icon="build">
              <div className="flex flex-wrap gap-1.5">
                {[...new Set(services)].map((s) => <Tag key={s} label={s} />)}
              </div>
            </Section>
          )}

          {/* Team */}
          {team.length > 0 && (
            <Section title={t.reviewTeam} icon="group">
              <div className="space-y-3">
                {team.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white leading-tight">
                        {m.name || m.position || '—'}
                      </div>
                      {m.name && m.position && (
                        <div className="text-xs text-on-surface-variant mt-0.5">{m.position}</div>
                      )}
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {m.email && (
                          <a href={`mailto:${m.email}`} className="text-[11px] text-secondary hover:underline">
                            {m.email}
                          </a>
                        )}
                        {m.linkedin && (
                          <a
                            href={m.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-on-surface-variant hover:text-white flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[12px]">work</span>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* History */}
          {profile?.history && (
            <Section title={t.reviewHistory} icon="history_edu">
              <p className="text-sm text-on-surface-variant leading-relaxed">{profile.history}</p>
            </Section>
          )}

          {/* AI Email */}
          {personalized && (personalized.emailSubject || personalized.fullMessage) && (
            <Section title={t.reviewAiEmail} icon="auto_awesome">
              <div className="space-y-4">
                {personalized.emailSubject && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                      {t.reviewEmailSubject}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-white font-medium">{personalized.emailSubject}</span>
                      <CopyButton text={personalized.emailSubject} label={t.reviewCopy} copiedLabel={t.reviewCopied} />
                    </div>
                  </div>
                )}
                {personalized.fullMessage && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        {t.reviewFullMessage}
                      </div>
                      <CopyButton text={personalized.fullMessage} label={t.reviewCopy} copiedLabel={t.reviewCopied} />
                    </div>
                    <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap bg-surface-container-highest/40 rounded-lg px-4 py-3 border border-outline-variant/10">
                      {personalized.fullMessage}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

        </div>
      </div>
    </>
  );
}
