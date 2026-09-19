'use client';

import { Suspense, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import type { CheckoutStepSlug } from './CheckoutSteps';

/**
 * Picks the view for the current checkout step.
 *
 * The five step components are the same ones that used to sit next to their
 * own page.tsx files (moved into this folder — see the move commands in the
 * hand-off notes). They're untouched; each still owns its own guards
 * (auth / empty cart / missing prerequisites) and its own layout.
 *
 * Each step is loaded with next/dynamic so only the active step's code is
 * downloaded. That replaces the per-route code splitting you had when every
 * step was its own page, and it matters most for `payment`, which pulls in the
 * Stripe and PayPal form code.
 */

const StepLoading = () => (
    `<div className= "co-page" >
    <div className="efear-container" >
        <div className="co-loading-screen" >
            <div className="co-pay-spinner" />
                <span className="co-loading-txt" > Loading...</span>
                    </div>
                    </div>
                    </div>`
);

// Module scope on purpose: creating these inside the component would remount
// the step on every render.
const STEP_VIEWS: Record<CheckoutStepSlug, ComponentType> = {
    details: dynamic(() => import('./CheckoutDetailsClient'), { loading: StepLoading }),
    shipping: dynamic(() => import('./CheckoutShippingClient'), { loading: StepLoading }),
    payment: dynamic(() => import('./CheckoutPaymentClient'), { loading: StepLoading }),
    review: dynamic(() => import('./CheckoutReviewClient'), { loading: StepLoading }),
    complete: dynamic(() => import('./CheckoutCompleteClient'), { loading: StepLoading }),
};

interface CheckoutClientProps {
    step: CheckoutStepSlug;
}

export default function CheckoutClient({ step }: CheckoutClientProps) {
    const View = STEP_VIEWS[step];

    // `complete` reads ?order= via useSearchParams, which needs a Suspense
    // boundary in the App Router or the whole route fails to prerender.
    return (
        <Suspense fallback= {< StepLoading />}>
            <View />
            </Suspense>
  );
}