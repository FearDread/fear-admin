'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { makeStore, type AppStore } from '@/lib/redux/store';
import { useGetCurrentUserQuery } from '@/lib/redux/api/authApi';

// Silently hydrates authSlice from the session cookie on first load, via
// getCurrentUser's onQueryStarted (see features/auth/api.ts). A 401 here is
// expected/normal for a logged-out visitor — the query's onQueryStarted
// already dispatches logout() in that case, so there's nothing to render
// here either way.
function AuthHydrator() {
  useGetCurrentUserQuery();
  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Enables refetchOnFocus / refetchOnReconnect for RTK Query — must run
    // client-side only, and only once per store instance.
    const unsubscribe = setupListeners(storeRef.current!.dispatch);
    return unsubscribe;
  }, []);

  return (
    <Provider store={storeRef.current}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}

export default StoreProvider;