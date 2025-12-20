'use client';

import { baseApi } from './baseApi';

export interface Content {
  id: string;
  domainId: string;
  type: 'blog' | 'social' | 'landing' | 'faq' | 'email';
  title: string;
  content: string;
  keyword: string;
  instructions?: string;
  status: 'generating' | 'completed' | 'failed';
  metadata?: {
    wordCount: number;
    readingTime: number;
    seoScore?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface GenerateContentRequest {
  domainId: string;
  type: Content['type'];
  keyword: string;
  instructions?: string;
}

interface UpdateContentRequest {
  contentId: string;
  title?: string;
  content?: string;
}

interface ContentQueryParams {
  domainId?: string;
  type?: Content['type'];
  status?: string;
  page?: number;
  limit?: number;
}

interface ContentResponse {
  success: boolean;
  data: {
    content: Content;
  };
}

interface ContentsResponse {
  success: boolean;
  data: {
    contents: Content[];
    total: number;
  };
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listContent: builder.query<ContentsResponse, ContentQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.domainId) queryParams.set('domainId', params.domainId);
        if (params?.type) queryParams.set('type', params.type);
        if (params?.status) queryParams.set('status', params.status);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        
        const query = queryParams.toString();
        return `/content${query ? `?${query}` : ''}`;
      },
      providesTags: (result) =>
        result?.data?.contents
          ? [
              ...result.data.contents.map(({ id }) => ({ type: 'Content' as const, id })),
              { type: 'Content', id: 'LIST' },
            ]
          : [{ type: 'Content', id: 'LIST' }],
    }),

    getContent: builder.query<ContentResponse, string>({
      query: (contentId) => `/content/${contentId}`,
      providesTags: (result, error, id) => [{ type: 'Content', id }],
    }),

    generateContent: builder.mutation<ContentResponse, GenerateContentRequest>({
      query: (data) => ({
        url: '/content/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Content', id: 'LIST' }],
    }),

    updateContent: builder.mutation<ContentResponse, UpdateContentRequest>({
      query: ({ contentId, ...data }) => ({
        url: `/content/${contentId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { contentId }) => [
        { type: 'Content', id: contentId },
        { type: 'Content', id: 'LIST' },
      ],
    }),

    deleteContent: builder.mutation<{ success: boolean }, string>({
      query: (contentId) => ({
        url: `/content/${contentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Content', id: 'LIST' }],
    }),

    regenerateContent: builder.mutation<ContentResponse, string>({
      query: (contentId) => ({
        url: `/content/${contentId}/regenerate`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, contentId) => [
        { type: 'Content', id: contentId },
        { type: 'Content', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListContentQuery,
  useLazyListContentQuery,
  useGetContentQuery,
  useLazyGetContentQuery,
  useGenerateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useRegenerateContentMutation,
} = contentApi;

// Alias for backwards compatibility
export const useGetContentHistoryQuery = useListContentQuery;

