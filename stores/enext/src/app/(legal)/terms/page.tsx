import type { Metadata } from 'next';
import { policyMetadata, PolicyPage } from '@/lib/legal/PolicyPage';

export const revalidate = 86400;
export const metadata: Metadata = policyMetadata('terms');

export default function TermsPage() {
    return <PolicyPage slug="terms" />;
}