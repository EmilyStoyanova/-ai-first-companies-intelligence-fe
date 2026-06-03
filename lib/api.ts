import type { AuthResult, Batch, DiscoveryCandidate, PaginatedCompanies, PersonaSearchResult, UploadResult } from './types';

const API_BASE = '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function setUserEmail(email: string): void {
  localStorage.setItem('userEmail', email);
}

export function clearAuth(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
}

export function getUserEmail(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('userEmail') || '';
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isForm?: boolean,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm
      ? (body as FormData)
      : body
      ? JSON.stringify(body)
      : undefined,
  });

  if (res.status === 401) {
    // Only redirect when a session token existed — means it expired.
    // During login/register there is no token, so 401 = bad credentials;
    // let the error propagate to the form so the user sees the message.
    if (getToken()) {
      clearAuth();
      window.location.href = '/';
      throw new Error('Unauthorized');
    }
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const d = await res.json();
      msg = d.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json() as Promise<T>;
  return res as unknown as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResult>('POST', '/auth/login', { email, password }),

  register: (email: string, password: string, tenantName: string) =>
    request<AuthResult>('POST', '/auth/register', { email, password, tenantName }),

  listBatches: () => request<Batch[]>('GET', '/batches'),

  getBatch: (id: string) => request<Batch>('GET', `/batches/${id}`),

  getCompanies: (batchId: string, page: number = 1) =>
    request<PaginatedCompanies>('GET', `/batches/${batchId}/companies?page=${page}&limit=50`),

  uploadBatch: (formData: FormData, forceRecrawl: boolean) =>
    request<UploadResult>(
      'POST',
      `/batches/upload${forceRecrawl ? '?force_recrawl=true' : ''}`,
      formData,
      true,
    ),

  downloadBatch: (id: string, format: 'csv' | 'xlsx') =>
    request<Response>('GET', `/batches/${id}/download?format=${format}`),

  deleteBatch: (id: string) => request<void>('DELETE', `/batches/${id}`),

  reEnrichBatch: (id: string) =>
    request<{ updated: number; total: number }>('POST', `/batches/${id}/re-enrich`),

  createPersonaSearch: (params: {
    persona: string;
    location: string;
    keywords?: string;
    maxResults?: number;
  }) => request<PersonaSearchResult>('POST', '/persona-searches', params),

  getCandidates: (batchId: string) =>
    request<DiscoveryCandidate[]>('GET', `/batches/${batchId}/candidates`),

  updateCandidate: (batchId: string, domain: string, action: 'exclude' | 'include') =>
    request<{ ok: boolean; crawlTriggered?: boolean }>(
      'PATCH',
      `/batches/${batchId}/candidates/${encodeURIComponent(domain)}`,
      { action },
    ),
};
