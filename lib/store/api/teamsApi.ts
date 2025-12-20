'use client';

import { baseApi } from './baseApi';
import { setTeams, setCurrentTeam } from '../slices/authSlice';
import type { Team } from '../slices/authSlice';

// Permission structure matching backend
export interface IPermissions {
  domains: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    verify: boolean;
  };
  prompts: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    analyze: boolean;
  };
  analytics: {
    view_web: boolean;
    view_llm: boolean;
    export: boolean;
  };
  content: {
    view: boolean;
    generate: boolean;
    edit: boolean;
    delete: boolean;
  };
  team: {
    invite: boolean;
    remove: boolean;
    edit_roles: boolean;
  };
  billing: {
    view: boolean;
    manage: boolean;
  };
}

export interface TeamMember {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  role: 'owner' | 'admin' | 'member' | 'viewer' | 'custom';
  customRoleId?: string | null;
  customRoleName?: string | null;
  domainAccess: string[] | 'all';
  status: 'pending' | 'active' | 'suspended';
  joinedAt?: string;
  invitedAt: string;
}

export interface CustomRole {
  id?: string; // Only present for custom roles
  name: string;
  description?: string;
  permissions: IPermissions;
  isDefault: boolean;
}

export interface TeamWithRole {
  id: string;
  name: string;
  slug: string;
  role: string;
  joinedAt?: string;
}

interface CreateTeamRequest {
  name: string;
}

interface InviteMemberRequest {
  teamId: string;
  email: string;
  role?: string;
  customRoleId?: string;
  domainAccess?: string[] | 'all';
}

interface UpdateMemberRequest {
  teamId: string;
  userId: string; // Backend uses userId, not memberId
  role?: string;
  domainAccess?: string[] | 'all';
  customRoleId?: string;
}

interface CreateRoleRequest {
  teamId: string;
  name: string;
  description?: string;
  permissions: IPermissions;
}

interface UpdateRoleRequest {
  teamId: string;
  roleId: string;
  name?: string;
  description?: string;
  permissions?: IPermissions;
}

interface TeamResponse {
  success: boolean;
  data: {
    team: {
      id: string;
      name: string;
      slug: string;
      settings?: {
        defaultRole?: string;
        branding?: {
          logo?: string;
          primaryColor?: string;
        };
      };
      createdAt?: string;
    };
    subscription?: {
      plan: string;
      status: string;
      totalSeats: number;
    } | null;
    memberCount?: number;
    userRole?: string;
  };
}

interface CreateTeamResponse {
  success: boolean;
  data: {
    team: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface TeamsResponse {
  success: boolean;
  data: {
    teams: TeamWithRole[];
  };
}

interface MembersResponse {
  success: boolean;
  data: {
    members: TeamMember[];
  };
}

interface RolesResponse {
  success: boolean;
  data: {
    roles: CustomRole[];
  };
}

interface RoleResponse {
  success: boolean;
  data: {
    role: CustomRole;
  };
}

interface SwitchTeamResponse {
  success: boolean;
  data: {
    accessToken: string;
    teamId: string;
  };
}

interface InvitationDetailsResponse {
  success: boolean;
  data: {
    invitation: {
      id: string;
      email: string;
      teamName: string;
      teamSlug: string;
      inviterName: string;
      role: string;
      status: 'pending' | 'active' | 'suspended';
      isExpired: boolean;
      isAlreadyAccepted: boolean;
      expiresAt?: string;
      userExists: boolean;
      userHasAccount: boolean;
    };
  };
}

interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  data: {
    teamId: string;
    teamName: string;
    teamSlug: string;
    role: string;
  };
}

export interface TeamActivity {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  type: string;
  action: string;
  targetType?: string;
  targetName?: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface ActivityLogResponse {
  success: boolean;
  data: {
    activities: TeamActivity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const teamsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Team CRUD
    listTeams: builder.query<TeamsResponse, void>({
      query: () => '/teams',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            // Map to Team type expected by auth slice
            const teams: Team[] = data.data.teams.map((t) => ({
              id: t.id,
              name: t.name,
              slug: t.slug,
              role: t.role,
            }));
            dispatch(setTeams(teams));
          }
        } catch (error) {
          // Handle error
        }
      },
      providesTags: ['Team'],
    }),

    getTeam: builder.query<TeamResponse, string>({
      query: (teamId) => `/teams/${teamId}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),

    createTeam: builder.mutation<CreateTeamResponse, CreateTeamRequest>({
      query: (data) => ({
        url: '/teams',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Team'],
    }),

    updateTeam: builder.mutation<{ success: boolean; data: { team: any } }, { teamId: string; name?: string; settings?: any }>({
      query: ({ teamId, ...data }) => ({
        url: `/teams/${teamId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'Team', id: teamId }, 'Team', { type: 'TeamActivity', id: teamId }],
    }),

    deleteTeam: builder.mutation<{ success: boolean; message: string }, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),

    switchTeam: builder.mutation<SwitchTeamResponse, string>({
      query: (teamId) => ({
        url: `/teams/${teamId}/switch`,
        method: 'POST',
      }),
      async onQueryStarted(teamId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(setCurrentTeam(data.data.teamId));
            // Store new access token
            if (typeof window !== 'undefined') {
              localStorage.setItem('accessToken', data.data.accessToken);
            }
          }
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['Domain', 'Prompt', 'Analytics', 'Content', 'Competitor'],
    }),

    // Team Members
    listTeamMembers: builder.query<MembersResponse, string>({
      query: (teamId) => `/teams/${teamId}/members`,
      providesTags: (result, error, teamId) => [{ type: 'TeamMembers', id: teamId }],
    }),

    inviteTeamMember: builder.mutation<{ success: boolean; message: string }, InviteMemberRequest>({
      query: ({ teamId, email, role, customRoleId, domainAccess }) => ({
        url: `/teams/${teamId}/invite`,
        method: 'POST',
        body: { email, role, customRoleId, domainAccess },
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'TeamMembers', id: teamId }, { type: 'TeamActivity', id: teamId }],
    }),

    updateTeamMember: builder.mutation<{ success: boolean; data: { member: any } }, UpdateMemberRequest>({
      query: ({ teamId, userId, ...data }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'TeamMembers', id: teamId }, { type: 'TeamActivity', id: teamId }],
    }),

    removeTeamMember: builder.mutation<{ success: boolean; message: string }, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'TeamMembers', id: teamId }, { type: 'TeamActivity', id: teamId }],
    }),

    resendInvitation: builder.mutation<{ success: boolean; message: string }, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}/resend`,
        method: 'POST',
      }),
    }),

    // Invitation - Get details (public, no auth required)
    getInvitationDetails: builder.query<InvitationDetailsResponse, string>({
      query: (token) => `/teams/invitations/${token}/details`,
    }),

    // Invitation - Accept (requires auth)
    acceptInvitation: builder.mutation<AcceptInvitationResponse, string>({
      query: (token) => ({
        url: `/teams/invitations/${token}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Team', 'TeamMembers'],
    }),

    // Team Activity Log
    getTeamActivity: builder.query<ActivityLogResponse, { teamId: string; page?: number; limit?: number }>({
      query: ({ teamId, page = 1, limit = 20 }) => `/teams/${teamId}/activity?page=${page}&limit=${limit}`,
      providesTags: (result, error, { teamId }) => [{ type: 'TeamActivity', id: teamId }],
    }),

    // Custom Roles
    listRoles: builder.query<RolesResponse, string>({
      query: (teamId) => `/teams/${teamId}/roles`,
      providesTags: (result, error, teamId) => [{ type: 'TeamRoles', id: teamId }],
    }),

    createRole: builder.mutation<RoleResponse, CreateRoleRequest>({
      query: ({ teamId, ...data }) => ({
        url: `/teams/${teamId}/roles`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'TeamRoles', id: teamId }, { type: 'TeamActivity', id: teamId }],
    }),

    updateRole: builder.mutation<RoleResponse, UpdateRoleRequest>({
      query: ({ teamId, roleId, ...data }) => ({
        url: `/teams/${teamId}/roles/${roleId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'TeamRoles', id: teamId }, { type: 'TeamActivity', id: teamId }],
    }),

    deleteRole: builder.mutation<{ success: boolean; message: string }, { teamId: string; roleId: string }>({
      query: ({ teamId, roleId }) => ({
        url: `/teams/${teamId}/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: 'TeamRoles', id: teamId }, { type: 'TeamActivity', id: teamId }],
    }),
  }),
});

export const {
  // Team hooks
  useListTeamsQuery,
  useGetTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useSwitchTeamMutation,
  // Member hooks
  useListTeamMembersQuery,
  useInviteTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useResendInvitationMutation,
  // Activity hooks
  useGetTeamActivityQuery,
  // Invitation hooks
  useGetInvitationDetailsQuery,
  useAcceptInvitationMutation,
  // Role hooks
  useListRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = teamsApi;
