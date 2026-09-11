// src/features/api/brandsApi.ts

import { apiSlice } from './apiSlice';
import type { Brand, Product } from '@/types';

interface FearApiEnvelope<T> {
    result: T;
    success: boolean;
    message: string;
    count: number;
}

interface GetBrandProductsArgs {
    brandId: string;
    page?: number;
    limit?: number;
    sort?: string;
}

interface ToggleFavoriteBrandArgs {
    brandId: string;
}

interface ToggleFavoriteBrandResponse {
    brandId: string;
    isFavorite: boolean;
}

export const brandsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Single brand — name/logo/description on ProductDetailsClient
        getBrandById: builder.query<Brand, string>({
            query: (brandId) => `/brands/${brandId}`,
            transformResponse: (response: FearApiEnvelope<Brand>) => response.result,
            providesTags: (result, error, brandId) => [{ type: 'Brand', id: brandId }],
        }),

        // "More from this brand" — related products strip on ProductDetailsClient
        getBrandProducts: builder.query<
            { products: Product[]; count: number },
            GetBrandProductsArgs
        >({
            query: ({ brandId, page = 1, limit = 8, sort }) => ({
                url: `/brands/${brandId}/products`,
                params: { page, limit, ...(sort ? { sort } : {}) },
            }),
            transformResponse: (response: FearApiEnvelope<Product[]>) => ({
                products: response.result,
                count: response.count,
            }),
            providesTags: (result, error, { brandId }) => [
                { type: 'Brand', id: `PRODUCTS-${brandId}` },
            ],
        }),

        // Full brand list — shop/filter sidebars
        getAllBrands: builder.query<Brand[], void>({
            query: () => '/brands',
            transformResponse: (response: FearApiEnvelope<Brand[]>) => response.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Brand' as const, id })),
                        { type: 'Brand' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Brand' as const, id: 'LIST' }],
        }),

        // Favorited brand IDs for the current session user
        getFavoriteBrandIds: builder.query<string[], void>({
            query: () => '/brands/favorites',
            transformResponse: (response: FearApiEnvelope<string[]>) => response.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((id) => ({ type: 'Brand' as const, id: `FAV-${id}` })),
                        { type: 'Brand' as const, id: 'FAVORITES' },
                    ]
                    : [{ type: 'Brand' as const, id: 'FAVORITES' }],
        }),

        // Toggle favorite status — optimistic update for instant star/heart flip
        toggleFavoriteBrand: builder.mutation<ToggleFavoriteBrandResponse, ToggleFavoriteBrandArgs>({
            query: ({ brandId }) => ({
                url: `/brands/${brandId}/favorite`,
                method: 'POST',
            }),
            transformResponse: (response: FearApiEnvelope<ToggleFavoriteBrandResponse>) =>
                response.result,
            async onQueryStarted({ brandId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    brandsApi.util.updateQueryData('getFavoriteBrandIds', undefined, (draft) => {
                        const idx = draft.indexOf(brandId);
                        if (idx === -1) {
                            draft.push(brandId);
                        } else {
                            draft.splice(idx, 1);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, { brandId }) => [
                { type: 'Brand', id: `FAV-${brandId}` },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetBrandByIdQuery,
    useGetBrandProductsQuery,
    useGetAllBrandsQuery,
    useGetFavoriteBrandIdsQuery,
    useToggleFavoriteBrandMutation,
} = brandsApi;