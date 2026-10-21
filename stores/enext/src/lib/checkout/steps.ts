/**
 * lib/checkout/steps.ts
 */

export const CHECKOUT_STEPS = {
    details: {
        title: 'Checkout — Shipping Details | eFear',
        description: 'Enter your shipping and billing details.',
    },
    shipping: {
        title: 'Checkout — Shipping Method | eFear',
        description: 'Choose how your order ships.',
    },
    payment: {
        title: 'Checkout — Payment | eFear',
        description: 'Pay securely for your eFear order.',
    },
    review: {
        title: 'Checkout — Review Order | eFear',
        description: 'Review your order before placing it.',
    },
    complete: {
        title: 'Order Confirmed | eFear',
        description: 'Your eFear order is confirmed.',
    },
} as const;

export type CheckoutStepSlug = keyof typeof CHECKOUT_STEPS;

export const isCheckoutStep = (value: string): value is CheckoutStepSlug =>
    Object.hasOwn(CHECKOUT_STEPS, value);