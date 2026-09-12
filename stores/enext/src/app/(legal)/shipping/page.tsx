// app/(legal)/shipping/page.tsx
import type { Metadata } from 'next';
import { policyMetadata, PolicyPage } from '@/lib/legal/PolicyPage';

export const revalidate = 86400;
export const metadata: Metadata = policyMetadata('shipping');

export default function ShippingPage() {
  return <PolicyPage slug="shipping" />;
}