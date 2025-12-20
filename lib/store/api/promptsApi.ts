'use client';

import { baseApi } from './baseApi';

export interface Prompt {
  id: string;
  domainId: string;
  text: string;
  group?: string;
  location?: string;
  aiPlatforms: string[];
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  visibilityScore?: number;
  topLLM?: string;
  topCompetitors?: string[];
  lastAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptAnalysis {
  id: string;
  promptId: string;
  platform: string;
  response: string;
  brandMentioned: boolean;
  brandRank?: number;
  sources: {
    url: string;
    title: string;
    cited: boolean;
  }[];
  competitors: {
    name: string;
    mentioned: boolean;
    rank?: number;
  }[];
  analyzedAt: string;
}

interface CreatePromptRequest {
  domainId: string;
  text: string;
  group?: string;
  location?: string;
  aiPlatforms?: string[];
}

interface UpdatePromptRequest {
  promptId: string;
  text?: string;
  group?: string;
  location?: string;
  aiPlatforms?: string[];
}

interface PromptsResponse {
  success: boolean;
  data: {
    prompts: Prompt[];
    total: number;
  };
}

interface PromptResponse {
  success: boolean;
  data: {
    prompt: Prompt;
    summary?: any;
    analyses?: PromptAnalysis[];
  };
}

interface PromptQueryParams {
  domainId?: string;
  status?: string;
  group?: string;
  page?: number;
  limit?: number;
}

interface PromptDetailParams {
  promptId: string;
  startDate?: string;
  endDate?: string;
}

export interface PromptGroup {
  id: string;
  name: string;
  promptCount: number;
  prompts?: { id: string; text: string }[];
}

export interface SuggestedKeyword {
  id: string;
  keyword: string;
  group: string | null;
  aiModels: string[];
  mentionRate: number;
  priority: 'high' | 'medium' | 'low';
}

export interface BacklinkOpportunity {
  id: string;
  url: string;
  domain: string;
  aiModels: string[];
  usageCount: number;
  lastSeen: string;
  firstIdentified: string;
}

interface PromptGroupsResponse {
  success: boolean;
  data: {
    groups: PromptGroup[];
  };
}

interface SuggestedKeywordsResponse {
  success: boolean;
  data: {
    keywords: SuggestedKeyword[];
  };
}

interface BacklinkOpportunitiesResponse {
  success: boolean;
  data: {
    opportunities: BacklinkOpportunity[];
  };
}

interface KeywordsQueryParams {
  domainId?: string;
  group?: string;
  limit?: number;
}

interface BacklinksQueryParams {
  domainId?: string;
  limit?: number;
}

export const promptsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPrompts: builder.query<PromptsResponse, PromptQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.status) queryParams.set('status', params.status);
        if (params?.group) queryParams.set('group', params.group);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        
        const query = queryParams.toString();
        return `/prompts${query ? `?${query}` : ''}`;
      },
      providesTags: (result) =>
        result?.data?.prompts
          ? [
              ...result.data.prompts.map(({ id }) => ({ type: 'Prompt' as const, id })),
              { type: 'Prompt', id: 'LIST' },
            ]
          : [{ type: 'Prompt', id: 'LIST' }],
    }),

    getPrompt: builder.query<PromptResponse, PromptDetailParams>({
      query: ({ promptId, startDate, endDate }) => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.set('startDate', startDate);
        if (endDate) queryParams.set('endDate', endDate);
        
        const query = queryParams.toString();
        return `/prompts/${promptId}${query ? `?${query}` : ''}`;
      },
      providesTags: (result, error, { promptId }) => [
        { type: 'Prompt', id: promptId },
        { type: 'PromptAnalysis', id: promptId },
      ],
    }),

    createPrompt: builder.mutation<PromptResponse, CreatePromptRequest>({
      query: (data) => ({
        url: '/prompts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Prompt', id: 'LIST' }],
    }),

    updatePrompt: builder.mutation<PromptResponse, UpdatePromptRequest>({
      query: ({ promptId, ...data }) => ({
        url: `/prompts/${promptId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { promptId }) => [
        { type: 'Prompt', id: promptId },
        { type: 'Prompt', id: 'LIST' },
      ],
    }),

    deletePrompt: builder.mutation<{ success: boolean }, string>({
      query: (promptId) => ({
        url: `/prompts/${promptId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Prompt', id: 'LIST' }],
    }),

    analyzePrompt: builder.mutation<{ success: boolean; data: { jobId: string } }, string>({
      query: (promptId) => ({
        url: `/prompts/${promptId}/analyze`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, promptId) => [
        { type: 'Prompt', id: promptId },
        { type: 'PromptAnalysis', id: promptId },
      ],
    }),

    bulkCreatePrompts: builder.mutation<{ success: boolean; data: { prompts: Prompt[] } }, CreatePromptRequest[]>({
      query: (prompts) => ({
        url: '/prompts/bulk',
        method: 'POST',
        body: { prompts },
      }),
      invalidatesTags: [{ type: 'Prompt', id: 'LIST' }],
    }),

    getPromptGroups: builder.query<PromptGroupsResponse, string | void>({
      query: (domainId) => {
        const queryParams = new URLSearchParams();
        if (domainId) queryParams.set('domainId', domainId);
        const query = queryParams.toString();
        return `/prompts/groups${query ? `?${query}` : ''}`;
      },
      providesTags: [{ type: 'Prompt', id: 'GROUPS' }],
    }),

    getSuggestedKeywords: builder.query<SuggestedKeywordsResponse, KeywordsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.group) queryParams.set('group', params.group);
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        const query = queryParams.toString();
        return `/prompts/keywords${query ? `?${query}` : ''}`;
      },
      providesTags: [{ type: 'Prompt', id: 'KEYWORDS' }],
    }),

    getBacklinkOpportunities: builder.query<BacklinkOpportunitiesResponse, BacklinksQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        const query = queryParams.toString();
        return `/prompts/backlinks${query ? `?${query}` : ''}`;
      },
      providesTags: [{ type: 'PromptAnalysis', id: 'BACKLINKS' }],
    }),
  }),
});

export const {
  useListPromptsQuery,
  useLazyListPromptsQuery,
  useGetPromptQuery,
  useLazyGetPromptQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
  useAnalyzePromptMutation,
  useBulkCreatePromptsMutation,
  useGetPromptGroupsQuery,
  useGetSuggestedKeywordsQuery,
  useGetBacklinkOpportunitiesQuery,
} = promptsApi;

