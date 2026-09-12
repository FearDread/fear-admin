import type { Metadata } from 'next';
import { policyMetadata, PolicyPage } from '@/lib/legal/PolicyPage';

export const revalidate = 86400;
export const metadata: Metadata = policyMetadata('returns');

export default function ReturnsPage() {
    return <PolicyPage slug="returns" />;
}