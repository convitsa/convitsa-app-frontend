'use client';

import { baseApi } from './baseApi';

export interface SourceTag {
  label: string;
  type: 'default' | 'success' | 'warning' | 'danger';
}

export interface Source {
  id: string;
  url: string;
  domain: string;
  title: string | null;
  aiModels: string[];
  usageCount: number;
  lastSeen: string;
  firstIdentified: string;
  status: 'opportunity' | 'mentions_you' | 'your_website';
  tags: SourceTag[];
}

export interface TopDomain {
  id: string;
  domain: string;
  count: number;
  urlCount: number;
  color: string;
}

export interface DomainTrend {
  date: string;
  [domain: string]: string | number;
}

interface SourcesQueryParams {
  domainId?: string;
  status?: 'all' | 'opportunity' | 'mentions_you' | 'your_website';
  aiPlatform?: string;
  sourceDomain?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface SourcesResponse {
  success: boolean;
  data: {
    sources: Source[];
    counts: {
      opportunity: number;
      mentions_you: number;
      your_website: number;
      total: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface TopDomainsQueryParams {
  domainId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  aiPlatform?: string;
}

interface TopDomainsResponse {
  success: boolean;
  data: {
    domains: TopDomain[];
  };
}

interface DomainTrendsQueryParams {
  domainId?: string;
  startDate?: string;
  endDate?: string;
  aiPlatform?: string;
}

interface DomainTrendsResponse {
  success: boolean;
  data: {
    trends: DomainTrend[];
    domains: string[];
  };
}

export const sourcesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSources: builder.query<SourcesResponse, SourcesQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.status) queryParams.set('status', params.status);
        if (params?.aiPlatform) queryParams.set('aiPlatform', params.aiPlatform);
        if (params?.sourceDomain) queryParams.set('sourceDomain', params.sourceDomain);
        if (params?.startDate) queryParams.set('startDate', params.startDate);
        if (params?.endDate) queryParams.set('endDate', params.endDate);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        
        const query = queryParams.toString();
        return `/sources${query ? `?${query}` : ''}`;
      },
      providesTags: [{ type: 'Analytics', id: 'SOURCES' }],
    }),

    getTopDomains: builder.query<TopDomainsResponse, TopDomainsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.startDate) queryParams.set('startDate', params.startDate);
        if (params?.endDate) queryParams.set('endDate', params.endDate);
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.aiPlatform) queryParams.set('aiPlatform', params.aiPlatform);
        
        const query = queryParams.toString();
        return `/sources/top-domains${query ? `?${query}` : ''}`;
      },
      providesTags: [{ type: 'Analytics', id: 'TOP_DOMAINS' }],
    }),

    getDomainTrends: builder.query<DomainTrendsResponse, DomainTrendsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.startDate) queryParams.set('startDate', params.startDate);
        if (params?.endDate) queryParams.set('endDate', params.endDate);
        if (params?.aiPlatform) queryParams.set('aiPlatform', params.aiPlatform);
        
        const query = queryParams.toString();
        return `/sources/trends${query ? `?${query}` : ''}`;
      },
      providesTags: [{ type: 'Analytics', id: 'DOMAIN_TRENDS' }],
    }),
  }),
});

export const {
  useGetSourcesQuery,
  useLazyGetSourcesQuery,
  useGetTopDomainsQuery,
  useGetDomainTrendsQuery,
} = sourcesApi;

