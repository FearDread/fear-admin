/**
 * lib/useCheckoutTotals.ts
 *
 * The CRA version repeated the same `taxRate = 0.07; taxes = subtotal * taxRate;
 * total = subtotal + shipping + taxes - discount` block in every single checkout
 * page (Details, Shipping, Payment, Review). Centralizing it here is a genuine
 * bug-prevention fix, not just tidiness — Details.jsx used a *different* formula
 * ("Est. Total" without shipping, since shipping isn't chosen yet) which is still
 * correct, but it's now explicit via the `includeShipping` flag rather than an
 * easy-to-miss copy/paste divergence.
 *
 * Per project convention, derived values like this stay in local computation
 * (useMemo) rather than Redux selectors — cart items now come from `cartApi`
 * (server data), so subtotal is computed here, not read out of a slice.
 */
import { useMemo } from 'react';
import { TAX_RATE } from '@/types/checkout';
import type { OrderItem } from '@/types/checkout';

interface CheckoutTotalsInput {
    items: Pick<OrderItem, 'price' | 'quantity'>[];
    shippingCost?: number;
    discount?: number;
    includeShipping?: boolean;
}

export function useCheckoutTotals({
    items,
    shippingCost = 0,
    discount = 0,
    includeShipping = true,
}: CheckoutTotalsInput) {
    return useMemo(() => {
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxes = subtotal * TAX_RATE;
        const shipping = includeShipping ? shippingCost : 0;
        const total = subtotal + shipping + taxes - discount;
        return { subtotal, taxes, shipping, discount, total, taxRate: TAX_RATE };
    }, [items, shippingCost, discount, includeShipping]);
}
