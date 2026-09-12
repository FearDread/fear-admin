import type { Metadata } from 'next';
import { policyMetadata, PolicyPage } from '@/lib/legal/PolicyPage';

export const revalidate = 86400;
export const metadata: Metadata = policyMetadata('cookies');

export default function CookiesPage() {
    return <PolicyPage slug="cookies" />;
}