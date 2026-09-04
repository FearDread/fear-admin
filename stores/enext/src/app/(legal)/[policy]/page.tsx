import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { POLICIES, type PolicySlug } from '@/lib/legal/content';
import { policyStyles } from '@/lib/legal/tokens';
import PolicyDocument from '@/components/legal/PolicyDocument';

// Legal copy changes rarely — long ISR window is fine, no need for full SSG
// lockstep with a redeploy.
export const revalidate = 86400;

export function generateStaticParams() {
  return Object.keys(POLICIES).map((policy) => ({ policy }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ policy: string }> }
): Promise<Metadata> {
  const { policy } = await params;
  const config = POLICIES[policy as PolicySlug];
  if (!config) return {};
  return {
    title: `${config.titlePrefix} ${config.titleAccent} | eFear`,
    description: config.metaDescription,
  };
}

export default async function LegalPage(
  { params }: { params: Promise<{ policy: string }> }
) {
  const { policy } = await params;
  const config = POLICIES[policy as PolicySlug];
  if (!config) notFound();

  return (
    <>
      {/* Injected here rather than in PolicyDocument so it's part of the
          server-rendered HTML on first paint, not a client-only insert. */}
      <style dangerouslySetInnerHTML={{ __html: policyStyles }} />
      <PolicyDocument slug={policy as PolicySlug} />
    </>
  );
}