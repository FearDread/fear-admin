import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { POLICIES, type PolicySlug } from '@/lib/legal/content';
import { policyStyles } from '@/lib/legal/tokens';
import PolicyDocument from '@/components/legal/PolicyDocument';

/** Static metadata for a known policy slug — no async/generateMetadata needed. */
export function policyMetadata(slug: PolicySlug): Metadata {
    const config = POLICIES[slug];
    if (!config) return {};
    return {
        title: `${config.titlePrefix} ${config.titleAccent} | eFear`,
        description: config.metaDescription,
        alternates: { canonical: `https://efear.store/${slug}` },
    };
}

export function PolicyPage({ slug }: { slug: PolicySlug }) {
    const config = POLICIES[slug];
    if (!config) notFound();
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: policyStyles }} />
            <PolicyDocument slug={slug} />
        </>
    );
}