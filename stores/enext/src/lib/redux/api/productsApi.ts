import { apiSlice } from './apiSlice';
import type { Product } from '@/components/products/ProductCard';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
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

    getProductById: builder.query<Product, string>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: 'products',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<Product, Partial<Product> & { id: string }>({
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

    patchProduct: builder.mutation<Product, Partial<Product> & { id: string }>({
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

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    searchProducts: builder.query<Product[], string>({
      query: (term) => ({
        url: 'products/search',
        params: { q: term },
      }),
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),
  }),
  overrideExisting: false,
});

// Re-exported under the original generic names so nothing importing these
// has to change — only the underlying endpoint keys (which must be unique
// across the whole shared apiSlice) were renamed.
export const {
  useGetAllProductsQuery: useGetAllQuery,
  useGetProductByIdQuery: useGetByIdQuery,
  useCreateProductMutation: useCreateMutation,
  useUpdateProductMutation: useUpdateMutation,
  usePatchProductMutation: usePatchMutation,
  useDeleteProductMutation: useDeleteMutation,
  useSearchProductsQuery: useSearchQuery,
} = productsApi;
