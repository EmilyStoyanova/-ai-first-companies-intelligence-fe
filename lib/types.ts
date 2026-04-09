export interface TeamMember {
  name: string;
  position?: string;
  email?: string;
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

export interface Batch {
  id: string;
  fileName?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalCompanies: number;
  processedCompanies: number;
  completionPercentage: number;
  createdAt: string;
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

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    tenantId: string;
  };
}
