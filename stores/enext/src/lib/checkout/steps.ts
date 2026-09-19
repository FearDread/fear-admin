/**
 * lib/checkout/steps.ts
 *
 * Single source of truth for the checkout route table. Lives outside any
 * 'use client' file on purpose: the server page needs the actual values
 * (for generateStaticParams / generateMetadata), and importing a runtime
 * value from a client module into a server component only gives you a
 * client reference, not the value.
 *
 * To add a step: add its slug here, its title below, and its view to
 * STEP_VIEWS in components/checkout/CheckoutClient.tsx.
 */

export const CHECKOUT_STEP_SLUGS = ['details', 'shipping', 'payment', 'review', 'complete'] as const;

export type CheckoutStepSlug = (typeof CHECKOUT_STEP_SLUGS)[number];

/** `/checkout` with no segment renders this step (the CRA app mapped /checkout → details too). */
export const DEFAULT_CHECKOUT_STEP: CheckoutStepSlug = 'details';

export const CHECKOUT_STEP_META: Record<CheckoutStepSlug, { title: string }> = {
    details: { title: 'Checkout — Shipping Details | eFear' },
    shipping: { title: 'Checkout — Shipping Method | eFear' },
    payment: { title: 'Checkout — Payment | eFear' },
    review: { title: 'Checkout — Review Order | eFear' },
    complete: { title: 'Order Confirmed | eFear' },
};

/**
 * Maps the optional catch-all segments to a step.
 *   []            → default step
 *   ['payment']   → 'payment'
 *   ['nope']      → null  (caller 404s)
 *   ['a', 'b']    → null
 *
 * Uses an includes() check rather than `slug in obj`, because `'constructor' in {}`
 * is true and would let /checkout/constructor through.
 */
export function resolveCheckoutStep(segments: string[] = []): CheckoutStepSlug | null {
    if (segments.length === 0) return DEFAULT_CHECKOUT_STEP;
    if (segments.length > 1) return null;
    const [slug] = segments;
    return (CHECKOUT_STEP_SLUGS as readonly string[]).includes(slug) ? (slug as CheckoutStepSlug) : null;
}