'use client';

import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    const teamId = (getState() as RootState).auth.currentTeamId;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    if (teamId) {
      headers.set('X-Team-Id', teamId);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Base query with automatic token refresh on 401
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;
    
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        const data = refreshResult.data as { data: { accessToken: string } };
        // Store the new token
        api.dispatch({
          type: 'auth/setAccessToken',
          payload: data.data.accessToken,
        });
        
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token, logout
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

// API slice with tag types for cache invalidation
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Team',
    'TeamMembers',
    'TeamRoles',
    'TeamActivity',
    'Domain',
    'Prompt',
    'PromptAnalysis',
    'Analytics',
    'Content',
    'Competitor',
    'Billing',
    'Onboarding',
    'Analysis',
  ],
  endpoints: () => ({}),
});

export default baseApi;

