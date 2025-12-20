'use client';

import { baseApi } from './baseApi';
import { setDomains, addDomain, updateDomain, removeDomain, setVerified, setCurrentDomain } from '../slices/domainSlice';
import type { Domain } from '../slices/domainSlice';

interface CreateDomainRequest {
  url: string;
}

interface VerifyDomainRequest {
  domainId: string;
  method?: 'meta' | 'file' | 'dns';
}

interface DomainResponse {
  success: boolean;
  data: {
    domain: Domain;
  };
}

interface DomainsResponse {
  success: boolean;
  data: {
    domains: Domain[];
  };
}

interface TrackingScriptResponse {
  success: boolean;
  data: {
    script: string;
    siteId: string;
  };
}

export const domainsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDomains: builder.query<DomainsResponse, void>({
      query: () => '/domains',
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            const domains = data.data.domains;
            dispatch(setDomains(domains));
            
            // Get current state
            const state = getState() as { domain: { currentDomainId: string | null } };
            const currentDomainId = state.domain.currentDomainId;
            
            // Check if currentDomainId is valid (exists in loaded domains)
            const currentDomainExists = domains.some(d => d.id === currentDomainId);
            
            if (!currentDomainExists && domains.length > 0) {
              // If no valid current domain, set the first one
              dispatch(setCurrentDomain(domains[0].id));
            } else if (currentDomainExists) {
              // Re-set the current domain to update verification status
              dispatch(setCurrentDomain(currentDomainId));
            }
          }
        } catch (error) {
          // Handle error
        }
      },
      providesTags: ['Domain'],
    }),

    getDomain: builder.query<DomainResponse, string>({
      query: (domainId) => `/domains/${domainId}`,
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),

    createDomain: builder.mutation<DomainResponse, CreateDomainRequest>({
      query: (data) => ({
        url: '/domains',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(addDomain(data.data.domain));
          }
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['Domain'],
    }),

    verifyDomain: builder.mutation<DomainResponse, VerifyDomainRequest>({
      query: ({ domainId, method = 'meta' }) => ({
        url: `/domains/${domainId}/verify`,
        method: 'POST',
        body: { method },
      }),
      async onQueryStarted({ domainId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(updateDomain(data.data.domain));
            dispatch(setVerified(data.data.domain.verified));
          }
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: (result, error, { domainId }) => [{ type: 'Domain', id: domainId }],
    }),

    deleteDomain: builder.mutation<{ success: boolean }, string>({
      query: (domainId) => ({
        url: `/domains/${domainId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(domainId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeDomain(domainId));
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['Domain'],
    }),

    getTrackingScript: builder.query<TrackingScriptResponse, string>({
      query: (domainId) => `/domains/${domainId}/script`,
    }),

    updateDomainSettings: builder.mutation<DomainResponse, { domainId: string; settings: any }>({
      query: ({ domainId, settings }) => ({
        url: `/domains/${domainId}/settings`,
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: (result, error, { domainId }) => [{ type: 'Domain', id: domainId }],
    }),
  }),
});

export const {
  useListDomainsQuery,
  useLazyListDomainsQuery,
  useGetDomainQuery,
  useCreateDomainMutation,
  useVerifyDomainMutation,
  useDeleteDomainMutation,
  useGetTrackingScriptQuery,
  useLazyGetTrackingScriptQuery,
  useUpdateDomainSettingsMutation,
} = domainsApi;

