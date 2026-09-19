/**
 * app/(checkout)/checkout/[[...step]]/page.tsx
 *
 * One route file for the whole checkout flow, same idea as `(auth)/[...auth]`
 * and `account/[section]`:
 *
 *   /checkout            → details   (optional catch-all matches zero segments)
 *   /checkout/details    → details
 *   /checkout/shipping   → shipping
 *   /checkout/payment    → payment
 *   /checkout/review     → review
 *   /checkout/complete   → complete  (reads ?order=<id>)
 *   /checkout/anything   → 404
 *
 * IMPORTANT: delete the old per-step folders (details/, shipping/, payment/,
 * review/, complete/). Next.js gives static segments priority over dynamic
 * ones, so if any of them are left behind they silently shadow this file for
 * that step.
 *
 * Nothing user-specific is rendered on the server — cart, auth and draft
 * state are all client-side (RTK Query + Redux) — so the five shells are
 * prerendered at build time. `dynamicParams = false` makes unknown paths a
 * hard 404 instead of an on-demand render.
 *
 * Every step is `noindex`: checkout is per-session and has nothing for search
 * engines. (Don't also `Disallow` /checkout in robots.txt — Google can only
 * honour a noindex on a page it's allowed to crawl.)
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CheckoutClient from '@/components/checkout/CheckoutClient';
import {
    CHECKOUT_STEP_META,
    CHECKOUT_STEP_SLUGS,
    resolveCheckoutStep,
} from '@/components/checkout/CheckoutSteps';

export const dynamicParams = false;

interface CheckoutPageProps {
    // Next.js 15: dynamic route params are async on the server.
    params: Promise<{ step?: string[] }>;
}

export function generateStaticParams() {
    return [{ step: [] }, ...CHECKOUT_STEP_SLUGS.map((slug) => ({ step: [slug] }))];
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
    const { step } = await params;
    const slug = resolveCheckoutStep(step);
    if (!slug) return {};

    return {
        title: CHECKOUT_STEP_META[slug].title,
        robots: { index: false, follow: false },
    };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { step } = await params;
    const slug = resolveCheckoutStep(step);
    if (!slug) notFound();

    return <CheckoutClient step={ slug } />;
}