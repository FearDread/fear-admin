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
    }),
    overrideExisting: false,
});

export const {
    useGetPaymentsQuery,
    useAddPaymentMutation,
    useRemovePaymentMutation,
    useSetDefaultPaymentMutation,
} = paymentsApi;