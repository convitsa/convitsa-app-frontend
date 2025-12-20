import { baseApi } from './baseApi';

export interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: {
    pagesCount?: number;
    keywordsCount?: number;
    promptsGenerated?: number;
    platformsQueried?: number;
    competitorsFound?: number;
    insightsGenerated?: number;
  };
}

export interface AnalysisSummary {
  totalPages: number;
  totalKeywords: number;
  totalPrompts: number;
  aiPlatformsAnalyzed: string[];
  overallVisibilityScore: number;
  competitorsIdentified: number;
}

export interface Analysis {
  id: string;
  domainId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentStepIndex: number;
  steps: AnalysisStep[];
  error?: string;
  summary?: AnalysisSummary;
  startedAt: string;
  completedAt?: string;
}

export interface AIPlatformConfig {
  platform: string;
  displayName: string;
  isAvailable: boolean;
}

export interface StartAnalysisRequest {
  domainId: string;
}

export interface AnalysisListResponse {
  analyses: Array<{
    id: string;
    status: string;
    currentStepIndex: number;
    summary?: AnalysisSummary;
    startedAt: string;
    completedAt?: string;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
  };
}

export const analysisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Start a new analysis
    startAnalysis: builder.mutation<Analysis, StartAnalysisRequest>({
      query: (body) => ({
        url: '/analysis/start',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Analysis'],
    }),

    // Get analysis status by ID
    getAnalysisStatus: builder.query<Analysis, string>({
      query: (analysisId) => `/analysis/${analysisId}`,
      providesTags: (result) =>
        result ? [{ type: 'Analysis', id: result.id }] : ['Analysis'],
    }),

    // Get latest analysis for a domain
    getLatestAnalysis: builder.query<Analysis, string>({
      query: (domainId) => `/analysis/domain/${domainId}/latest`,
      providesTags: (result) =>
        result ? [{ type: 'Analysis', id: result.id }] : ['Analysis'],
    }),

    // List all analyses for a domain
    listAnalyses: builder.query<AnalysisListResponse, { domainId: string; limit?: number; skip?: number }>({
      query: ({ domainId, limit = 10, skip = 0 }) =>
        `/analysis/domain/${domainId}?limit=${limit}&skip=${skip}`,
      providesTags: ['Analysis'],
    }),

    // Get available AI platforms
    getAvailablePlatforms: builder.query<{ platforms: AIPlatformConfig[] }, void>({
      query: () => '/analysis/platforms',
    }),
  }),
});

export const {
  useStartAnalysisMutation,
  useGetAnalysisStatusQuery,
  useGetLatestAnalysisQuery,
  useListAnalysesQuery,
  useGetAvailablePlatformsQuery,
} = analysisApi;

