'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Domain {
  id: string;
  url: string;
  name: string;
  verified: boolean;
  trackingScriptInstalled: boolean;
  verificationCode?: string;
  createdAt: string;
}

export type AnalysisStage = 
  | 'pending'
  | 'verifying'
  | 'creating_prompts'
  | 'analyzing'
  | 'indexing'
  | 'completed'
  | 'failed';

interface DomainState {
  domains: Domain[];
  currentDomainId: string | null;
  isVerified: boolean;
  analysisStage: AnalysisStage;
  analysisProgress: number;
  verificationCode: string;
}

// Get initial state from localStorage (client-side only)
const getInitialState = (): DomainState => {
  if (typeof window !== 'undefined') {
    const currentDomainId = localStorage.getItem('currentDomainId');
    const isVerified = localStorage.getItem('domainVerified') === 'true';
    
    return {
      domains: [],
      currentDomainId,
      isVerified,
      analysisStage: 'pending',
      analysisProgress: 0,
      verificationCode: 'cvts_' + Math.random().toString(36).substring(2, 10),
    };
  }
  
  return {
    domains: [],
    currentDomainId: null,
    isVerified: false,
    analysisStage: 'pending',
    analysisProgress: 0,
    verificationCode: 'cvts_' + Math.random().toString(36).substring(2, 10),
  };
};

const domainSlice = createSlice({
  name: 'domain',
  initialState: getInitialState(),
  reducers: {
    setDomains: (state, action: PayloadAction<Domain[]>) => {
      state.domains = action.payload;
    },
    
    addDomain: (state, action: PayloadAction<Domain>) => {
      state.domains.push(action.payload);
    },
    
    updateDomain: (state, action: PayloadAction<Domain>) => {
      const index = state.domains.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.domains[index] = action.payload;
      }
    },
    
    removeDomain: (state, action: PayloadAction<string>) => {
      state.domains = state.domains.filter((d) => d.id !== action.payload);
      if (state.currentDomainId === action.payload) {
        state.currentDomainId = state.domains[0]?.id || null;
      }
    },
    
    setCurrentDomain: (state, action: PayloadAction<string | null>) => {
      state.currentDomainId = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('currentDomainId', action.payload);
        } else {
          localStorage.removeItem('currentDomainId');
        }
      }
      
      // Update verification status based on selected domain
      const domain = state.domains.find((d) => d.id === action.payload);
      if (domain) {
        state.isVerified = domain.verified;
      }
    },
    
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('domainVerified', action.payload.toString());
      }
      
      // Update domain in list
      if (state.currentDomainId) {
        const domain = state.domains.find((d) => d.id === state.currentDomainId);
        if (domain) {
          domain.verified = action.payload;
        }
      }
    },
    
    setAnalysisStage: (state, action: PayloadAction<AnalysisStage>) => {
      state.analysisStage = action.payload;
    },
    
    setAnalysisProgress: (state, action: PayloadAction<number>) => {
      state.analysisProgress = action.payload;
    },
    
    resetDomainState: (state) => {
      state.domains = [];
      state.currentDomainId = null;
      state.isVerified = false;
      state.analysisStage = 'pending';
      state.analysisProgress = 0;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentDomainId');
        localStorage.removeItem('domainVerified');
      }
    },
  },
});

export const {
  setDomains,
  addDomain,
  updateDomain,
  removeDomain,
  setCurrentDomain,
  setVerified,
  setAnalysisStage,
  setAnalysisProgress,
  resetDomainState,
} = domainSlice.actions;

export default domainSlice.reducer;

// Selectors
export const selectDomains = (state: { domain: DomainState }) => state.domain.domains;
export const selectCurrentDomainId = (state: { domain: DomainState }) => state.domain.currentDomainId;
export const selectCurrentDomain = (state: { domain: DomainState }) =>
  state.domain.domains.find((d) => d.id === state.domain.currentDomainId) || null;
export const selectIsVerified = (state: { domain: DomainState }) => state.domain.isVerified;
export const selectAnalysisStage = (state: { domain: DomainState }) => state.domain.analysisStage;
export const selectAnalysisProgress = (state: { domain: DomainState }) => state.domain.analysisProgress;
export const selectVerificationCode = (state: { domain: DomainState }) => state.domain.verificationCode;

