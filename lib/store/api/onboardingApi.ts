'use client';

import { baseApi } from './baseApi';

export interface OnboardingData {
  companyName?: string;
  businessType?: string;
  companySize?: string;
  goals?: string[];
  aiPlatforms?: string[];
  websiteUrl?: string;
}

interface OnboardingStatusResponse {
  success: boolean;
  data: {
    completed: boolean;
    data: OnboardingData;
  };
}

interface SaveOnboardingResponse {
  success: boolean;
  message: string;
  data: {
    onboardingData: OnboardingData;
  };
}

interface CompleteOnboardingResponse {
  success: boolean;
  message: string;
  data: {
    onboardingData: OnboardingData;
    domain?: {
      id: string;
      url: string;
      hostname: string;
    };
  };
}

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingStatus: builder.query<OnboardingStatusResponse, void>({
      query: () => '/onboarding',
      providesTags: ['Onboarding'],
    }),

    saveOnboarding: builder.mutation<SaveOnboardingResponse, OnboardingData>({
      query: (data) => ({
        url: '/onboarding',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Onboarding'],
    }),

    completeOnboarding: builder.mutation<CompleteOnboardingResponse, void>({
      query: () => ({
        url: '/onboarding/complete',
        method: 'POST',
      }),
      invalidatesTags: ['Onboarding', 'User'],
    }),
  }),
});

export const {
  useGetOnboardingStatusQuery,
  useSaveOnboardingMutation,
  useCompleteOnboardingMutation,
} = onboardingApi;

