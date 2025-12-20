'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
}

interface UIState {
  toasts: Toast[];
  modals: Record<string, Modal>;
  globalLoading: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
}

const initialState: UIState = {
  toasts: [],
  modals: {},
  globalLoading: false,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toast notifications
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: Toast['type']; duration?: number }>
    ) => {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        message: action.payload.message,
        type: action.payload.type,
        duration: action.payload.duration || 4000,
      });
    },
    
    hideToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    
    clearToasts: (state) => {
      state.toasts = [];
    },
    
    // Modal management
    openModal: (state, action: PayloadAction<{ id: string; data?: any }>) => {
      state.modals[action.payload.id] = {
        id: action.payload.id,
        isOpen: true,
        data: action.payload.data,
      };
    },
    
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false;
      }
    },
    
    // Global loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // Mobile menu
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  showToast,
  hideToast,
  clearToasts,
  openModal,
  closeModal,
  setGlobalLoading,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectToasts = (state: { ui: UIState }) => state.ui.toasts;
export const selectModal = (id: string) => (state: { ui: UIState }) => state.ui.modals[id];
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectMobileMenuOpen = (state: { ui: UIState }) => state.ui.mobileMenuOpen;

