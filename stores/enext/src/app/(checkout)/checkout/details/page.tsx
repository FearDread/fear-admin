import type { Metadata } from 'next';
import CheckoutDetailsClient from './CheckoutDetailsClient';

// Checkout pages are auth-gated, single-user, and change per session —
// there's nothing here for search engines. noindex on all 5 checkout steps.
export const metadata: Metadata = {
  title: 'Checkout — Shipping Details | eFear',
  robots: { index: false, follow: false },
};

export default function CheckoutDetailsPage() {
  return <CheckoutDetailsClient />;
}
