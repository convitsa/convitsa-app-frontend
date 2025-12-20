'use client';

import { baseApi } from './baseApi';
import { setCredentials, setUser, setTeams, logout } from '../slices/authSlice';
import type { User, Team } from '../slices/authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    teamId?: string;
    teams?: Team[];
  };
}

interface VerifyEmailRequest {
  email: string;
  code: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface MeResponse {
  success: boolean;
  data: {
    user: User;
    teams: Team[];
  };
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  weeklyReports: boolean;
  competitorAlerts: boolean;
  productUpdates: boolean;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse & { requiresVerification?: boolean }, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Only set credentials if email is verified (user has tokens)
          if (data.success && data.data?.accessToken) {
            dispatch(
              setCredentials({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                teamId: data.data.teamId,
                teams: data.data.teams,
              })
            );
          }
          // If requiresVerification is true, don't set credentials - let the page handle redirect
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['User'],
    }),

    signup: builder.mutation<{ success: boolean; message?: string }, SignupRequest>({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
      // Don't set credentials on signup - user needs to verify email first
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          // Still logout on error
          dispatch(logout());
        }
      },
      invalidatesTags: ['User', 'Team', 'Domain', 'Prompt', 'Analytics'],
    }),

    verifyEmail: builder.mutation<AuthResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Set credentials after successful email verification
          if (data.success && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                teamId: data.data.teamId,
                teams: data.data.teams,
              })
            );
          }
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['User'],
    }),

    resendCode: builder.mutation<{ success: boolean }, { email: string }>({
      query: (data) => ({
        url: '/auth/resend-code',
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<{ success: boolean }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ success: boolean }, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    sendMagicLink: builder.mutation<{ success: boolean }, { email: string }>({
      query: (data) => ({
        url: '/auth/magic-link',
        method: 'POST',
        body: data,
      }),
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => '/auth/me',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(setUser(data.data.user));
            dispatch(setTeams(data.data.teams));
          }
        } catch (error) {
          // Token invalid, logout
          dispatch(logout());
        }
      },
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<{ success: boolean; data: { user: User } }, { firstName: string; lastName: string; email: string }>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<{ success: boolean }, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: data,
      }),
    }),

    updateNotificationPreferences: builder.mutation<
      { success: boolean; data: { notificationPreferences: NotificationPreferences } },
      Partial<NotificationPreferences>
    >({
      query: (data) => ({
        url: '/auth/notification-preferences',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteAccount: builder.mutation<{ success: boolean }, { password?: string }>({
      query: (data) => ({
        url: '/auth/account',
        method: 'DELETE',
        body: data,
      }),
    }),

    refreshToken: builder.mutation<{ success: boolean; data: { accessToken: string } }, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendMagicLinkMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateNotificationPreferencesMutation,
  useDeleteAccountMutation,
} = authApi;

