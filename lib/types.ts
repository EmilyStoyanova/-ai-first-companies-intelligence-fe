export interface TeamMember {
  name: string;
  position?: string;
  email?: string;
  linkedin?: string;
}

export interface CompanyProfile {
  name?: string;
  description?: string;
  location?: string;
  emails: string[];
  phones: string[];
  services: string[];
  team: TeamMember[];
  history?: string;
  socialLinks: Record<string, string>;
  completionScore: number;
}

export interface Company {
  id: string;
  domain: string;
  name?: string;
  crawlStatus: 'PENDING' | 'CRAWLING' | 'COMPLETED' | 'FAILED';
  lastCrawledAt?: string;
  profile?: CompanyProfile;
}

export interface SearchQuery {
  persona: string;
  location: string;
  keywords?: string;
  maxResults?: number;
}

export interface Batch {
  id: string;
  fileName?: string;
  sourceType?: 'UPLOAD' | 'PERSONA_SEARCH';
  searchQuery?: SearchQuery;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalCompanies: number;
  processedCompanies: number;
  completionPercentage: number;
  createdAt: string;
}

export interface PersonaSearchResult {
  batchId: string;
  message: string;
}

export interface PaginatedCompanies {
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UploadResult {
  batchId: string;
  totalCompanies: number;
  jobsEnqueued: number;
  skipped: number;
}

export type CandidateStatus = 'KEPT' | 'FILTERED' | 'BLOCKED' | 'EXCLUDED';

export interface DiscoveryCandidate {
  id: string;
  batchId: string;
  domain: string;
  url: string;
  title?: string;
  snippet?: string;
  status: CandidateStatus;
  createdAt: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    tenantId: string;
  };
}
