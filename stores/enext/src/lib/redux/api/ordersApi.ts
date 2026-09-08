/**
 * features/api/ordersApi.ts
 *
 * NEW API SLICE — orders did not have an `injectEndpoints` slice in the CRA app;
 * they lived in a hand-rolled `features/orders/slice.js` with thunks
 * (`createOrder`, `updateCurrentOrder`, `updateOrder`) and a `currentOrder` object
 * held in plain Redux state across the whole checkout flow.
 *
 * That pattern doesn't survive the move to Next.js: `currentOrder` was read via
 * `location.state`-adjacent in-memory Redux, which is fine for a client-only SPA
 * but breaks on a full page load / refresh / server render. Converting to RTK
 * Query gives us `useGetOrderByIdQuery` so `CheckoutComplete` (and, if you land on
 * `/checkout/review` directly) can rehydrate from `?order=<id>` instead of relying
 * on in-memory state that may not exist.
 *
 * BACKEND GAP — none of these routes are confirmed to exist on the FEAR API yet:
 *   POST   /fear/api/orders           create a new order
 *   GET    /fear/api/orders/:id       fetch a single order
 *   PATCH  /fear/api/orders/:id       update shipping/payment/status fields
 * Track alongside the other outstanding backend gaps (brands, shipping-estimate,
 * moveToCart, blog routes).
 *
 * MERGE NOTE: add `'Order'` to `apiSlice.ts`'s `tagTypes` array.
 */
import { apiSlice } from '@/features/api/apiSlice';
import type { Order } from '@/types/checkout';

interface ApiEnvelope<T> {
  result: T;
  success: boolean;
  message: string;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (obj: ApiEnvelope<Order>) => obj.result,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      transformResponse: (obj: ApiEnvelope<Order>) => obj.result,
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    updateOrder: builder.mutation<Order, { id: string; changes: Partial<Order> }>({
      query: ({ id, changes }) => ({ url: `/orders/${id}`, method: 'PATCH', body: changes }),
      transformResponse: (obj: ApiEnvelope<Order>) => obj.result,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Order', id }],
    }),
  }),
});

export const {
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = ordersApi;
