import type { Metadata } from 'next';
import CheckoutPaymentClient from './CheckoutPaymentClient';

export const metadata: Metadata = {
  title: 'Checkout — Payment | eFear',
  robots: { index: false, follow: false },
};

export default function CheckoutPaymentPage() {
  return <CheckoutPaymentClient />;
}
