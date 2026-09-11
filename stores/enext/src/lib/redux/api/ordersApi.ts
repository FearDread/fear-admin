/**
 * ordersApi.ts
 *
 * RTK Query endpoints for the account "Orders" view (previously
 * features/orders/slice.js thunks + selectors in the CRA app).
 *
 * Follows the project-wide injectEndpoints pattern:
 *   - injects into the single shared `apiSlice` (relative `/fear/api` baseUrl,
 *     so requests go through the Next.js rewrite proxy to the Express API).
 *   - unwraps the FEAR API envelope `{ result, success, message, count }`
 *     via `transformResponse`.
 *   - tags follow `[{ type: 'Order', id }, { type: 'Order', id: 'LIST' }]`.
 *
 * MERGE NOTE: add `'Order'` to `tagTypes` in apiSlice.ts if it isn't there yet.
 */

import { apiSlice } from './apiSlice';

export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderNumber?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'failed';
    orderDate?: string;
    createdAt?: string;
    total: number;
    items: OrderItem[];
    trackingNumber?: string;
}

export interface OrderFilters {
    status?: string;
    sort?: string;
}

export const ordersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<Order[], { sort?: string } | void>({
            query: (params) => ({
                url: '/orders',
                params: params ?? undefined,
            }),
            transformResponse: (obj: { result: Order[] }) => obj.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Order' as const, id })),
                        { type: 'Order' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Order' as const, id: 'LIST' }],
        }),

        // Separate endpoint (rather than a client-side filter of getOrders) so the
        // filter drawer can hit the backend's own filtering/sorting when the list
        // is large. Falls back to getOrders when statusFilter === 'all'.
        getOrdersWithFilters: builder.query<Order[], OrderFilters>({
            query: (filters) => ({
                url: '/orders',
                params: filters,
            }),
            transformResponse: (obj: { result: Order[] }) => obj.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Order' as const, id })),
                        { type: 'Order' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Order' as const, id: 'LIST' }],
        }),

        cancelOrder: builder.mutation<{ success: boolean; message?: string }, { orderId: string; reason?: string }>({
            query: ({ orderId, reason }) => ({
                url: `/orders/${orderId}/cancel`,
                method: 'POST',
                body: { reason },
            }),
            transformResponse: (obj: { success: boolean; message?: string }) => obj,
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: 'Order', id: orderId },
                { type: 'Order', id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetOrdersQuery,
    useGetOrdersWithFiltersQuery,
    useCancelOrderMutation,
} = ordersApi;