/**
 * addressesApi.ts
 *
 * RTK Query endpoints for the account "Addresses" view (previously
 * features/address/slice.js thunks + selectors in the CRA app).
 *
 * BUG FIX carried over from the original: the CRA version dispatched a
 * `validateAddress` thunk, awaited an artificial `setTimeout(100)`, then read
 * back the Redux `validation` state hoping the thunk had resolved by then —
 * a real race condition (slow network = stale/empty validation object, and
 * the read used `selectAddressValidation({ address: { validation } })`,
 * re-selecting from a value it had just pulled out of state via the same
 * selector, which is circular). Address validation is pure, synchronous,
 * client-side field checking, so it doesn't need a thunk, a store round
 * trip, or a race at all — see `validateAddressFields` in
 * components/AddressesView.tsx.
 *
 * MERGE NOTE: add `'Address'` to `tagTypes` in apiSlice.ts if it isn't there yet.
 */

import { apiSlice } from './apiSlice';

export interface Address {
    id: string;
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    type: 'billing' | 'shipping';
    isDefault?: boolean;
}

export type AddressInput = Omit<Address, 'id'> & { userId: string };

export const addressesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAddresses: builder.query<Address[], void>({
            query: () => '/addresses',
            transformResponse: (obj: { result: Address[] }) => obj.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Address' as const, id })),
                        { type: 'Address' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Address' as const, id: 'LIST' }],
        }),

        createAddress: builder.mutation<Address, AddressInput>({
            query: (body) => ({
                url: '/addresses',
                method: 'POST',
                body,
            }),
            transformResponse: (obj: { result: Address }) => obj.result,
            invalidatesTags: [{ type: 'Address', id: 'LIST' }],
        }),

        updateAddress: builder.mutation<Address, { id: string; updates: Partial<AddressInput> }>({
            query: ({ id, updates }) => ({
                url: `/addresses/${id}`,
                method: 'PUT',
                body: updates,
            }),
            transformResponse: (obj: { result: Address }) => obj.result,
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Address', id },
                { type: 'Address', id: 'LIST' },
            ],
        }),

        removeAddress: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/addresses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Address', id },
                { type: 'Address', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAddressesQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useRemoveAddressMutation,
} = addressesApi;