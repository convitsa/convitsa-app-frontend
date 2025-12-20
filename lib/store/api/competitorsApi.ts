'use client';

import { baseApi } from './baseApi';

export interface Competitor {
  id: string;
  domainId: string;
  name: string;
  domain?: string;
  source: 'manual' | 'ai_discovered';
  visibilityScore?: number;
  mentionCount?: number;
  topPrompts?: string[];
  lastAnalyzedAt?: string;
  createdAt: string;
}

interface AddCompetitorRequest {
  domainId: string;
  name: string;
  domain?: string;
}

interface CompetitorResponse {
  success: boolean;
  data: {
    competitor: Competitor;
  };
}

interface CompetitorsResponse {
  success: boolean;
  data: {
    competitors: Competitor[];
    total: number;
  };
}

interface CompetitorAnalysisResponse {
  success: boolean;
  data: {
    competitor: Competitor;
    analysis: {
      promptId: string;
      promptText: string;
      mentioned: boolean;
      rank?: number;
      platforms: string[];
    }[];
  };
}

export const competitorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCompetitors: builder.query<CompetitorsResponse, string | void>({
      query: (domainId) => {
        const query = domainId ? `?domainId=${domainId}` : '';
        return `/competitors${query}`;
      },
      providesTags: (result) =>
        result?.data?.competitors
          ? [
              ...result.data.competitors.map(({ id }) => ({ type: 'Competitor' as const, id })),
              { type: 'Competitor', id: 'LIST' },
            ]
          : [{ type: 'Competitor', id: 'LIST' }],
    }),

    getCompetitor: builder.query<CompetitorAnalysisResponse, string>({
      query: (competitorId) => `/competitors/${competitorId}`,
      providesTags: (result, error, id) => [{ type: 'Competitor', id }],
    }),

    addCompetitor: builder.mutation<CompetitorResponse, AddCompetitorRequest>({
      query: (data) => ({
        url: '/competitors',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Competitor', id: 'LIST' }],
    }),

    updateCompetitor: builder.mutation<CompetitorResponse, { competitorId: string; name?: string; domain?: string }>({
      query: ({ competitorId, ...data }) => ({
        url: `/competitors/${competitorId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { competitorId }) => [
        { type: 'Competitor', id: competitorId },
        { type: 'Competitor', id: 'LIST' },
      ],
    }),

    deleteCompetitor: builder.mutation<{ success: boolean }, string>({
      query: (competitorId) => ({
        url: `/competitors/${competitorId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Competitor', id: 'LIST' }],
    }),

    analyzeCompetitor: builder.mutation<{ success: boolean; data: { jobId: string } }, string>({
      query: (competitorId) => ({
        url: `/competitors/${competitorId}/analyze`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, competitorId) => [{ type: 'Competitor', id: competitorId }],
    }),
  }),
});

export const {
  useListCompetitorsQuery,
  useLazyListCompetitorsQuery,
  useGetCompetitorQuery,
  useLazyGetCompetitorQuery,
  useAddCompetitorMutation,
  useUpdateCompetitorMutation,
  useDeleteCompetitorMutation,
  useAnalyzeCompetitorMutation,
} = competitorsApi;

