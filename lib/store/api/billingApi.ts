'use client';

import { baseApi } from './baseApi';

export interface Plan {
  id: string;
  name: string;
  price: number;
  pricePerSeat: number;
  features: string[];
  limits: {
    domains: number | string;
    prompts: number | string;
    seats: number;
  };
}

export interface Subscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  baseSeats: number;
  additionalSeats: number;
  totalSeats: number;
  usedSeats: number;
  currentPeriodEnd?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  data: {
    subscription: Subscription;
    limits: {
      maxDomains: number;
      maxPrompts: number;
      features: string[];
    };
    usage: {
      seats: number;
      seatsLimit: number;
    };
  };
}

export interface PlansResponse {
  success: boolean;
  data: {
    plans: Plan[];
  };
}

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<PlansResponse, void>({
      query: () => '/billing/plans',
      providesTags: ['Billing'],
    }),

    getSubscription: builder.query<SubscriptionResponse, void>({
      query: () => '/billing/subscription',
      providesTags: ['Billing'],
    }),

    addSeats: builder.mutation<{ success: boolean; data: { totalSeats: number; additionalSeats: number } }, { count: number }>({
      query: (data) => ({
        url: '/billing/seats',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Billing'],
    }),

    removeSeats: builder.mutation<{ success: boolean; data: { totalSeats: number; additionalSeats: number } }, { count: number }>({
      query: (data) => ({
        url: '/billing/seats',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetSubscriptionQuery,
  useAddSeatsMutation,
  useRemoveSeatsMutation,
} = billingApi;
