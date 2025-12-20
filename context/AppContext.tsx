'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api';

interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isLoading: boolean;
  
  // Team state
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  switchTeam: (teamId: string) => Promise<void>;
  
  // Domain state
  domain: string | null;
  setDomain: (domain: string | null) => void;
  isDomainVerified: boolean;
  setIsDomainVerified: (value: boolean) => void;
  verificationCode: string;
  
  // Analysis state
  competitorAnalysisComplete: boolean;
  setCompetitorAnalysisComplete: (value: boolean) => void;
  aiOptimizationComplete: boolean;
  setAiOptimizationComplete: (value: boolean) => void;
  
  // Toast
  toast: Toast | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string; userId?: string }>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [isDomainVerified, setIsDomainVerified] = useState(false);
  const [competitorAnalysisComplete, setCompetitorAnalysisComplete] = useState(false);
  const [aiOptimizationComplete, setAiOptimizationComplete] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Generate a random verification code
  const verificationCode = 'abc123xyz456';

  // Load initial state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.getMe();
          if (response.success && response.data) {
            setUser(response.data.user);
            setTeams(response.data.teams || []);
            setIsAuthenticated(true);
            
            // Set current team
            const savedTeamId = localStorage.getItem('currentTeamId');
            const team = response.data.teams?.find((t: Team) => t.id === savedTeamId) || response.data.teams?.[0];
            if (team) {
              setCurrentTeam(team);
            }
          }
        } catch (error) {
          console.error('Auth init error:', error);
          api.clearTokens();
        }
      }
      
      // Load domain from localStorage
      const savedDomain = localStorage.getItem('convitsa_domain');
      const savedVerified = localStorage.getItem('convitsa_verified');
      if (savedDomain) setDomain(savedDomain);
      if (savedVerified === 'true') setIsDomainVerified(true);
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Save domain to localStorage
  useEffect(() => {
    if (domain) localStorage.setItem('convitsa_domain', domain);
  }, [domain]);

  useEffect(() => {
    localStorage.setItem('convitsa_verified', isDomainVerified ? 'true' : 'false');
  }, [isDomainVerified]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    
    if (response.success && response.data) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Fetch teams
      const teamsResponse = await api.listTeams();
      if (teamsResponse.success && teamsResponse.data) {
        setTeams(teamsResponse.data.teams);
        if (teamsResponse.data.teams.length > 0) {
          setCurrentTeam(teamsResponse.data.teams[0]);
        }
      }
      
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Login failed' };
  };

  const signup = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await api.signup(data);
    
    if (response.success && response.data) {
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      if (response.data.team) {
        setTeams([response.data.team]);
        setCurrentTeam(response.data.team);
      }
      
      return { success: true, userId: response.data.user?.id };
    }
    
    return { success: false, error: response.error?.message || 'Signup failed' };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setIsAuthenticated(false);
    setTeams([]);
    setCurrentTeam(null);
    setDomain(null);
    setIsDomainVerified(false);
    localStorage.removeItem('convitsa_domain');
    localStorage.removeItem('convitsa_verified');
  };

  const verifyEmail = async (email: string, code: string) => {
    const response = await api.verifyEmail(email, code);
    
    if (response.success) {
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
      return { success: true };
    }
    
    return { success: false, error: response.error?.message || 'Verification failed' };
  };

  const refreshUser = async () => {
    const response = await api.getMe();
    if (response.success && response.data) {
      setUser(response.data.user);
      setTeams(response.data.teams || []);
    }
  };

  const switchTeam = async (teamId: string) => {
    const response = await api.switchTeam(teamId);
    if (response.success) {
      const team = teams.find(t => t.id === teamId);
      if (team) {
        setCurrentTeam(team);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        teams,
        currentTeam,
        setCurrentTeam,
        switchTeam,
        domain,
        setDomain,
        isDomainVerified,
        setIsDomainVerified,
        verificationCode,
        competitorAnalysisComplete,
        setCompetitorAnalysisComplete,
        aiOptimizationComplete,
        setAiOptimizationComplete,
        toast,
        showToast,
        hideToast,
        login,
        signup,
        logout,
        verifyEmail,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
