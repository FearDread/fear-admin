import { apiSlice } from './apiSlice';
import type { Product } from '@/types/product';

// FEAR API envelope — every list/detail endpoint on the main storefront
// backend returns this shape. See categoriesApi/blogApi/cartApi for the
// same pattern; productsApi should not diverge from it.
interface FearListEnvelope<T> {
    result: T[];
    success: boolean;
    message?: string;
    count: number;
}

interface FearItemEnvelope<T> {
    result: T;
    success: boolean;
    message?: string;
}

export const productsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProducts: builder.query<Product[], void>({
            query: () => '/product/all',
            transformResponse: (response: FearListEnvelope<Product>) => response.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id, id }) => ({ type: 'Product' as const, id: (_id ?? id) as string })),
                        { type: 'Product' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Product' as const, id: 'LIST' }],
        }),

        getProductById: builder.query<Product, string>({
            query: (id) => `/product/${id}`,
            transformResponse: (response: FearItemEnvelope<Product>) => response.result,
            providesTags: (_result, _error, id) => [{ type: 'Product', id }],
        }),

        deleteProduct: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/product/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { success: boolean; message?: string }) => response,
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
            transformResponse: (response: FearListEnvelope<Product>) => response.result,
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