import type { Metadata } from 'next';
import CheckoutReviewClient from './CheckoutReviewClient';

export const metadata: Metadata = {
  title: 'Checkout — Review Order | eFear',
  robots: { index: false, follow: false },
};

export default function CheckoutReviewPage() {
  return <CheckoutReviewClient />;
}
