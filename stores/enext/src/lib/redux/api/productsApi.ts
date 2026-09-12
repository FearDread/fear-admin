import { apiSlice } from './apiSlice';
import type { Product } from '@/types/product';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
      query: () => '/product/all',
      transformResponse: (response: unknown): Product[] => {
        if (Array.isArray(response)) return response;
        // Backend may wrap the array, e.g. { success, data } or { products }.
        // Unwrap defensively instead of letting a non-array reach consumers.
        if (response && typeof response === 'object') {
          const obj = response as Record<string, unknown>;

          if (Array.isArray(obj.result)) return obj.result as Product[];
          if (Array.isArray(obj.data)) return obj.data as Product[];
          if (Array.isArray(obj.products)) return obj.products as Product[];
        }
        console.warn(
          '[productsApi] getAllProducts: expected an array, got:',
          response,
        );
        return [];
      },
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/product/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    searchProducts: builder.query<Product[], string>({
      query: (term) => ({
        url: '/product/search',
        params: { q: term },
      }),
      providesTags: [{ type: 'Product', id: 'SEARCH' }],
    }),
  }),
  overrideExisting: true,
});

// Re-exported under the original generic names so nothing importing these
// has to change — only the underlying endpoint keys (which must be unique
// across the whole shared apiSlice) were renamed.
export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetAllProductsQuery: useGetAllQuery,
  useGetProductByIdQuery: useGetByIdQuery,
  useDeleteProductMutation: useDeleteMutation,
  useSearchProductsQuery: useSearchQuery,
} = productsApi;