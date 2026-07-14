'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Header2 from '@/components/header/Header2';
import Footer2 from '@/components/common/Footer2';
import BestSelling from '@/components/products/BestSelling';
import ProductQuickView from '@/components/products/ProductQuickView';
import CookieBanner from '@/components/common/CookieBanner';

import { useGetAllQuery as useGetAllProductsQuery } from '@/lib/redux/api/productsApi';
import { useGetAllQuery as useGetAllCategoriesQuery } from '@/lib/redux/api/categoriesApi';

// loadStripe is SSR-safe (resolves to null server-side), so calling it at
// module scope is fine even though this file is a Client Component.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
);

interface CookieConsent {
  essential: boolean;
  [key: string]: boolean;
}

type CookieStatus = 'visible' | 'accepted' | 'rejected' | null;

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { data: products = [] } = useGetAllProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetAllCategoriesQuery();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [status, setStatus] = useState<CookieStatus>(null);
  const [, setAcceptedPrefs] = useState<CookieConsent | null>(null);

  const handleAccept = (prefs: CookieConsent) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    setAcceptedPrefs(prefs);
    setStatus('accepted');
  };

  const handleReject = () => {
    const essentialOnly: CookieConsent = { essential: true };
    localStorage.setItem('cookie-consent', JSON.stringify(essentialOnly));
    setAcceptedPrefs(essentialOnly);
    setStatus('rejected');
  };

  // Replaces the old <ScrollToTop /> that relied on react-router's useLocation
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('cookie-consent');
    if (!saved) {
      const timer = setTimeout(() => setStatus('visible'), 600);
      return () => clearTimeout(timer);
    }
    setStatus('accepted');
    setAcceptedPrefs(JSON.parse(saved));
  }, []);

  const stripeOptions = useMemo(
    () => ({
      appearance: {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#0570de',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          colorDanger: '#df1b41',
          fontFamily: 'Ideal Sans, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '4px',
        },
      },
    }),
    []
  );

  return (
    <>
      <div className="separator-animated-border animated-true" />
      <Elements stripe={stripePromise} options={stripeOptions}>
        <b className="screen-overlay" />
        <div className="wrapper">
          <Header2 />
        </div>
        <div className="page-wrapper">
          <div className="page-content">
            {children}
            <BestSelling />
          </div>
        </div>
        <Footer2
          categories={!categoriesLoading ? categories : []}
          products={products}
        />

        {status === 'visible' && (
          <CookieBanner onAccept={handleAccept} onReject={handleReject} />
        )}

        {selectedProduct && (
          <ProductQuickView
            product={selectedProduct}
            isOpen={showQuickView}
            onClose={() => {
              setShowQuickView(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Elements>
    </>
  );
}