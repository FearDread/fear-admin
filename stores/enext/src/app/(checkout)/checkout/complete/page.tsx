import { Suspense } from 'react';
import type { Metadata } from 'next';
import CheckoutCompleteClient from './CheckoutCompleteClient';

export const metadata: Metadata = {
  title: 'Order Confirmed | eFear',
  robots: { index: false, follow: false },
};

// CheckoutCompleteClient reads `?order=` via useSearchParams, which requires a
// Suspense boundary in the App Router (otherwise the whole route opts out of
// static rendering during build).
export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<div className="co-page" />}>
      <CheckoutCompleteClient />
    </Suspense>
  );
}
