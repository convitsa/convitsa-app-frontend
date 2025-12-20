'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  teams: Team[];
  currentTeamId: string | null;
}

// Get initial state from localStorage (client-side only)
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const currentTeamId = localStorage.getItem('currentTeamId');
    
    return {
      user: null,
      isAuthenticated: !!accessToken,
      isLoading: true,
      accessToken,
      refreshToken,
      teams: [],
      currentTeamId,
    };
  }
  
  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
    refreshToken: null,
    teams: [],
    currentTeamId: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        teamId?: string;
        teams?: Team[];
      }>
    ) => {
      const { user, accessToken, refreshToken, teamId, teams } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      if (teams) {
        state.teams = teams;
      }
      
      if (teamId) {
        state.currentTeamId = teamId;
      }
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        if (teamId) {
          localStorage.setItem('currentTeamId', teamId);
        }
      }
    },
    
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload);
      }
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    
    setCurrentTeam: (state, action: PayloadAction<string>) => {
      state.currentTeamId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentTeamId', action.payload);
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.teams = [];
      state.currentTeamId = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentTeamId');
      }
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setUser,
  setTeams,
  setCurrentTeam,
  setLoading,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectTeams = (state: { auth: AuthState }) => state.auth.teams;
export const selectCurrentTeamId = (state: { auth: AuthState }) => state.auth.currentTeamId;
export const selectCurrentTeam = (state: { auth: AuthState }) => 
  state.auth.teams.find(t => t.id === state.auth.currentTeamId) || null;

