/**
 * paymentsApi.ts
 *
 * RTK Query endpoints for:
 *   1. Checkout payments  → /stripe/intent, /paypal/order, /paypal/capture
 *   2. Saved cards        → /payments (account "Payment Methods" view)
 */

import { apiSlice } from './apiSlice';

export interface StripeIntentRequest {
    amount: number;
    orderId?: string;
}

export interface StripeIntentResult {
    clientSecret: string;
}

export interface PayPalCreateOrderRequest {
    /** Dollars, e.g. 42.5 */
    amount: number;
    orderId?: string;
}

export interface PayPalCreateOrderResult {
    id: string;
}

export interface PayPalCaptureRequest {
    /** The PayPal order id (data.orderID from onApprove). */
    orderId: string;
}

export interface PayPalCaptureResult {
    success: boolean;
    [key: string]: unknown;
}

export interface PaymentMethod {
    id: string;
    cardType?: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault?: boolean;
    verified?: boolean;
}

export interface AddPaymentInput {
    userId: string;
    paymentMethodId: string; // Stripe token, never a raw card number
    cardholderName: string;
    makeDefault?: boolean;
    cardDetails: {
        last4: string;
        brand: string;
        expiryMonth: string;
        expiryYear: string;
        fingerprint: string;
    };
}

export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ── Checkout: Stripe ────────────────────────────────────────────
        createStripeIntent: builder.mutation<StripeIntentResult, StripeIntentRequest>({
            query: (body) => ({ url: '/stripe/intent', method: 'POST', body }),
            transformResponse: (res: { result: StripeIntentResult }) => res.result,
        }),

        // ── Checkout: PayPal ────────────────────────────────────────────
        createPayPalOrder: builder.mutation<PayPalCreateOrderResult, PayPalCreateOrderRequest>({
            query: (body) => ({ url: '/paypal/order', method: 'POST', body }),
        }),

        capturePayPalOrder: builder.mutation<PayPalCaptureResult, PayPalCaptureRequest>({
            query: (body) => ({ url: '/paypal/capture', method: 'POST', body }),
            // A captured payment changes order state server-side.
            invalidatesTags: [{ type: 'Order', id: 'LIST' }],
        }),

        // ── Account: saved cards ────────────────────────────────────────
        getPayments: builder.query<PaymentMethod[], void>({
            query: () => '/payments',
            transformResponse: (obj: { result: PaymentMethod[] }) => obj.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Payment' as const, id })),
                        { type: 'Payment' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Payment' as const, id: 'LIST' }],
        }),

        addPayment: builder.mutation<PaymentMethod, AddPaymentInput>({
            query: (body) => ({ url: '/payments', method: 'POST', body }),
            transformResponse: (obj: { result: PaymentMethod }) => obj.result,
            invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
        }),

        removePayment: builder.mutation<{ success: boolean }, string>({
            query: (methodId) => ({ url: `/payments/${methodId}`, method: 'DELETE' }),
            invalidatesTags: (_r, _e, methodId) => [
                { type: 'Payment', id: methodId },
                { type: 'Payment', id: 'LIST' },
            ],
        }),

        setDefaultPayment: builder.mutation<{ success: boolean }, string>({
            query: (methodId) => ({ url: `/payments/${methodId}/default`, method: 'PATCH' }),
            invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateStripeIntentMutation,
    useCreatePayPalOrderMutation,
    useCapturePayPalOrderMutation,
    useGetPaymentsQuery,
    useAddPaymentMutation,
    useRemovePaymentMutation,
    useSetDefaultPaymentMutation,
} = paymentsApi;