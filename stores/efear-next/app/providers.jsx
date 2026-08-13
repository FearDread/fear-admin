'use client';

import { Provider } from 'react-redux';
//import { store } from '../features/store';
import AuthProvider from '../contexts/Auth';
import SiteLayout from '../components/layout/SiteLayout';

export default function Providers({ children }) {
  return (
    <Provider>
      <AuthProvider>
        <SiteLayout>
          {children}
        </SiteLayout>
      </AuthProvider>
    </Provider>
  );
}