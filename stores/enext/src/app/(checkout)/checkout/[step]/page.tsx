/**
 * app/(checkout)/checkout/[step]/page.tsx
 */

import { Suspense, type ComponentType } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
    CHECKOUT_STEPS,
    isCheckoutStep,
    type CheckoutStepSlug,
} from '@/lib/checkout/steps';

import CheckoutDetailsClient from '@/components/checkout/steps/CheckoutDetailsClient';
import CheckoutShippingClient from '@/components/checkout/steps/CheckoutShippingClient';
import CheckoutPaymentClient from '@/components/checkout/steps/CheckoutPaymentClient';
import CheckoutReviewClient from '@/components/checkout/steps/CheckoutReviewClient';
import CheckoutCompleteClient from '@/components/checkout/steps/CheckoutCompleteClient';

const STEP_VIEWS: Record<CheckoutStepSlug, ComponentType> = {
    details: CheckoutDetailsClient,
    shipping: CheckoutShippingClient,
    payment: CheckoutPaymentClient,
    review: CheckoutReviewClient,
    complete: CheckoutCompleteClient,
};

interface CheckoutStepPageProps {
    // Next.js 15: dynamic route params are async.
    params: Promise<{ step: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(CHECKOUT_STEPS).map((step) => ({ step }));
}

export async function generateMetadata({ params }: CheckoutStepPageProps): Promise<Metadata> {
    const { step } = await params;
    if (!isCheckoutStep(step)) return {};

    const { title, description } = CHECKOUT_STEPS[step];
    return {
        title,
        description,
        robots: { index: false, follow: false },
    };
}

export default async function CheckoutStepPage({ params }: CheckoutStepPageProps) {
    const { step } = await params;
    if (!isCheckoutStep(step)) notFound();

    const View = STEP_VIEWS[step];

    // CheckoutCompleteClient calls useSearchParams(), which needs a Suspense
    // boundary or the whole route opts out of static rendering at build time.
    // Wrapping every step keeps the route file uniform.
    return (
        <Suspense fallback={ <div className="co-page" /> }>
            <View />
        </Suspense>
  );
}