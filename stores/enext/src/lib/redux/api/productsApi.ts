import { apiSlice } from './apiSlice';
import type { Product } from '@/components/products/ProductCard';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAll: builder.query<Product[], void>({
      query: () => 'products/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: 'Product' as const,
                id: item._id ?? item.id,
              })),
              { type: 'Product' as const, id: 'LIST' },
            ]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),

    getById: builder.query<Product, string>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    create: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: 'products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    update: builder.mutation<Product, Partial<Product> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    patch: builder.mutation<Product, Partial<Product> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    delete: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    search: builder.query<Product[], string>({
      query: (term) => ({
        url: 'products/search',
        params: { q: term },
      }),
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  usePatchMutation,
  useDeleteMutation,
  useSearchQuery,
} = productsApi;