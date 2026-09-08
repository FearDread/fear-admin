import { apiSlice } from '@/lib/redux/api/apiSlice';
import type { Order } from '@/types/checkout';
import type { FearEnvelope as ApiEnvelope } from '@/types/fear';


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
