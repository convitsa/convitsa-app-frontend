'use client';

import { baseApi } from './baseApi';

export interface WebAnalyticsData {
  summary: {
    totalPageViews: number;
    uniqueVisitors: number;
    pageViewsChange: number;
    visitorsChange: number;
  };
  topPages: {
    path: string;
    views: number;
  }[];
  topReferrers: {
    domain: string;
    visits: number;
  }[];
  topCountries: {
    country: string;
    visits: number;
  }[];
  devices: Record<string, number>;
  dailyData: {
    date: string;
    pageViews: number;
  }[];
}

export interface LLMAnalyticsData {
  totalCrawls: number;
  uniqueBots: number;
  avgCrawlsPerDay: number;
  topBots: {
    name: string;
    icon: string;
    crawls: number;
    lastSeen: string;
    percentage: number;
    type: string;
  }[];
  crawlsByPath: {
    path: string;
    crawls: number;
    visitors: number;
    bots: string[];
  }[];
  chartData: {
    date: string;
    chatgpt: number;
    claude: number;
    perplexity: number;
    gemini: number;
    others: number;
  }[];
  botExplanations: {
    name: string;
    icon: string;
    description: string;
    purpose: string;
    type: string;
  }[];
}

export interface OverviewData {
  visibilityScore: number;
  visibilityTrend: number;
  topLLM: string;
  totalPrompts: number;
  analyzedPrompts: number;
  brandMentions: number;
  topCompetitors: {
    name: string;
    score: number;
  }[];
  llmPresence: {
    platform: string;
    score: number;
    mentions: number;
  }[];
  recentAnalyses: {
    prompt: string;
    score: number;
    date: string;
  }[];
}

interface AnalyticsParams {
  domainId?: string;
  startDate?: string;
  endDate?: string;
}

interface WebAnalyticsResponse {
  success: boolean;
  data: WebAnalyticsData;
}

interface LLMAnalyticsResponse {
  success: boolean;
  data: LLMAnalyticsData;
}

interface OverviewResponse {
  success: boolean;
  data: OverviewData;
}

interface ExportParams {
  domainId: string;
  format?: 'csv' | 'json';
  type?: 'web' | 'llm' | 'all';
}

export interface LiveVisitorsData {
  count: number;
  byPage: { page: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byDevice: { device: string; count: number }[];
  visitors: {
    visitorId: string;
    sessionId: string;
    siteId: string;
    page: string;
    country: string | null;
    device: string;
    referrer: string | null;
    lastSeen: number;
  }[];
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLiveVisitors: builder.query<LiveVisitorsData, string>({
      query: (domainId) => `/analytics/live/${domainId}`,
      // No caching, always fresh data
      keepUnusedDataFor: 0,
    }),

    getWebAnalytics: builder.query<WebAnalyticsResponse, AnalyticsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.startDate) queryParams.set('startDate', params.startDate);
        if (params?.endDate) queryParams.set('endDate', params.endDate);
        
        const query = queryParams.toString();
        return `/analytics/web${query ? `?${query}` : ''}`;
      },
      providesTags: ['Analytics'],
    }),

    getLLMAnalytics: builder.query<LLMAnalyticsResponse, AnalyticsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.startDate) queryParams.set('startDate', params.startDate);
        if (params?.endDate) queryParams.set('endDate', params.endDate);
        
        const query = queryParams.toString();
        return `/analytics/llm${query ? `?${query}` : ''}`;
      },
      providesTags: ['Analytics'],
    }),

    getAnalyticsOverview: builder.query<OverviewResponse, string | void>({
      query: (domainId) => {
        const query = domainId ? `?domainId=${domainId}` : '';
        return `/analytics/overview${query}`;
      },
      providesTags: ['Analytics'],
    }),

    exportAnalytics: builder.query<Blob, ExportParams>({
      query: ({ domainId, format = 'csv', type = 'all' }) => ({
        url: `/analytics/export?domainId=${domainId}&format=${format}&type=${type}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetLiveVisitorsQuery,
  useGetWebAnalyticsQuery,
  useLazyGetWebAnalyticsQuery,
  useGetLLMAnalyticsQuery,
  useLazyGetLLMAnalyticsQuery,
  useGetAnalyticsOverviewQuery,
  useLazyGetAnalyticsOverviewQuery,
  useLazyExportAnalyticsQuery,
} = analyticsApi;

