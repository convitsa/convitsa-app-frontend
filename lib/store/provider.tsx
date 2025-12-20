'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { useGetMeQuery, useLazyGetMeQuery } from './api/authApi';
import { useListDomainsQuery, useLazyListDomainsQuery } from './api/domainsApi';
import { setLoading, selectIsAuthenticated, selectUser } from './slices/authSlice';
import { useAppSelector } from './hooks';

function AuthInitializer({ children }: { children: ReactNode }) {
  const initialized = useRef(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  
  // Use lazy queries so we can trigger them manually
  const [fetchMe, { isLoading: isLoadingUser, isError }] = useLazyGetMeQuery();
  const [fetchDomains] = useLazyListDomainsQuery();
  
  // Initial load - check for token and fetch user
  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
    
    if (hasToken && !user && !initialized.current) {
      // We have a token but no user - fetch user data
      fetchMe();
      initialized.current = true;
    } else if (!hasToken && !initialized.current) {
      store.dispatch(setLoading(false));
      initialized.current = true;
    }
  }, [fetchMe, user]);
  
  // Fetch domains when authenticated and user is loaded
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDomains();
    }
  }, [isAuthenticated, user, fetchDomains]);
  
  useEffect(() => {
    if (isError) {
      store.dispatch(setLoading(false));
    }
  }, [isError]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}

