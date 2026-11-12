'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { makeStore, type AppStore } from '@/lib/redux/store';
import { useGetSessionQuery } from '@/lib/redux/api/authApi';

// Silently hydrates authSlice from the session cookie on first load.
function AuthHydrator() {
    useGetSessionQuery();
    return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) storeRef.current = makeStore();
    const store = storeRef.current;

    useEffect(() => setupListeners(store.dispatch), [store]);

    // FIX: this used to be <Provider store={makeStore()}>, i.e. a brand-new
    // (empty) store on every render, while setupListeners was wired to a
    // different, orphaned one. Any re-render wiped auth state.
    return (
        <Provider store={ store } >
            <AuthHydrator />
            { children }
        </Provider>
  );
}

export default StoreProvider;