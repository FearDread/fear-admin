/**
 * paymentsApi.ts
 *
 * RTK Query endpoints for the account "Payment Methods" view (previously
 * features/payments/slice.js thunks + selectors in the CRA app).
 *
 * Card data itself is tokenized by Stripe client-side (see StripeCardForm.tsx)
 * — this API only ever sees the Stripe `paymentMethodId` token plus
 * display-only card details (last4, brand, expiry), never raw card numbers.
 *
 * MERGE NOTE: add `'Payment'` to `tagTypes` in apiSlice.ts if it isn't there yet.
 */

import { apiSlice } from './apiSlice';
interface ApiEnvelope<T> {
    result: T;
    success: boolean;
    message: string;
}

export interface CreatePaymentIntentRequest {
    amount: number; // cents
    currency: string;
    metadata?: Record<string, string | undefined>;
}

export interface PaymentIntentResult {
    id: string;
    client_secret: string;
}

export interface PaypalCreateOrderResult {
    id: string;
}

export interface PaypalCaptureOrderResult {
    id: string;
    status: string;
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
            query: (body) => ({
                url: '/payments',
                method: 'POST',
                body,
            }),
            transformResponse: (obj: { result: PaymentMethod }) => obj.result,
            invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
        }),

        removePayment: builder.mutation<{ success: boolean }, string>({
            query: (methodId) => ({
                url: `/payments/${methodId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, methodId) => [
                { type: 'Payment', id: methodId },
                { type: 'Payment', id: 'LIST' },
            ],
        }),

        setDefaultPayment: builder.mutation<{ success: boolean }, string>({
            query: (methodId) => ({
                url: `/payments/${methodId}/default`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
        }),
        createPaymentIntent: builder.mutation<PaymentIntentResult, CreatePaymentIntentRequest>({
            query: (body) => ({ url: '/payments/create-intent', method: 'POST', body }),
            transformResponse: (obj: ApiEnvelope<PaymentIntentResult>) => obj.result,
        }),

        createPaypalOrder: builder.mutation<
            PaypalCreateOrderResult,
            { orderId?: string; amount: number }
        >({
            query: (body) => ({ url: '/payments/paypal/create-order', method: 'POST', body }),
            transformResponse: (obj: ApiEnvelope<PaypalCreateOrderResult>) => obj.result,
        }),

        capturePaypalOrder: builder.mutation<PaypalCaptureOrderResult, { orderID: string }>({
            query: (body) => ({ url: '/payments/paypal/capture-order', method: 'POST', body }),
            transformResponse: (obj: ApiEnvelope<PaypalCaptureOrderResult>) => obj.result,
        }),
    }),
    overrideExisting: false,
});

export const {

    useCreatePaymentIntentMutation,
    useCreatePaypalOrderMutation,
    useCapturePaypalOrderMutation,
    useGetPaymentsQuery,
    useAddPaymentMutation,
    useRemovePaymentMutation,
    useSetDefaultPaymentMutation,
} = paymentsApi;
