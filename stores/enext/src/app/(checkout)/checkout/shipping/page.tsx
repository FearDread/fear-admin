import type { Metadata } from 'next';
import CheckoutShippingClient from './CheckoutShippingClient';

export const metadata: Metadata = {
  title: 'Checkout — Shipping Method | eFear',
  robots: { index: false, follow: false },
};

export default function CheckoutShippingPage() {
  return <CheckoutShippingClient />;
}
