'use client';

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import domainReducer from './slices/domainSlice';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      ui: uiReducer,
      domain: domainReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(baseApi.middleware),
    devTools: process.env.NEXT_PUBLIC_ENV !== 'production',
  });

  // Enable refetchOnFocus/refetchOnReconnect
  setupListeners(store.dispatch);

  return store;
};

// Create store instance
export const store = makeStore();

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

