import { apiSlice } from './apiSlice';
import type { FearEnvelope } from '@/types/fear';

export interface WishlistItem {
  id: string; // wishlist entry id (used for removal) — normalized from _id
  productId: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  sku?: string;
  category?: string;
  addedAt?: string;
}

export type WishlistInput = Omit<WishlistItem, 'id' | 'addedAt'>;

type RawItem = Omit<WishlistItem, 'id'> & { id?: string; _id?: string };

interface FearItemEnvelope<T> {
  result: T;
  success: boolean;
  message: string;
}

// Mongo returns `_id`; the UI keys on `id`.
const normalize = (w: RawItem): WishlistItem => ({
  ...w,
  id: w.id ?? w._id ?? w.productId,
});

interface MoveToCartArgs {
  id: string; // wishlist entry id
  productId: string;
  quantity?: number;
}

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => '/wishlist',
      transformResponse: (response: FearEnvelope<RawItem>) => response.result.map(normalize),
      providesTags: (result) =>
        result
          ? [
              ...result.map((w) => ({ type: 'Wishlist' as const, id: w.id })),
              { type: 'Wishlist' as const, id: 'LIST' },
            ]
          : [{ type: 'Wishlist' as const, id: 'LIST' }],
    }),

    addToWishlist: builder.mutation<WishlistItem, WishlistInput>({
      query: (body) => ({ url: '/wishlist', method: 'POST', body }),
      transformResponse: (response: FearItemEnvelope<RawItem>) => normalize(response.result),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
            if (draft.some((w) => w.productId === item.productId)) return;
            draft.push({ ...item, id: `temp-${item.productId}` });
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    removeFromWishlist: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/wishlist/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
            const idx = draft.findIndex((w) => w.id === id);
            if (idx !== -1) draft.splice(idx, 1);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    // Composes two existing routes (POST /cart/items, DELETE /wishlist/:id)
    // so no new backend endpoint is needed. Not atomic: if the DELETE fails
    // after the cart add succeeds, the item is in both — harmless, and the
    // user can just remove it.
    moveToCart: builder.mutation<{ success: boolean }, MoveToCartArgs>({
      async queryFn({ id, productId, quantity = 1 }, _api, _extra, baseQuery) {
        const added = await baseQuery({
          url: '/cart/items',
          method: 'POST',
          body: { productId, quantity },
        });
        if (added.error) return { error: added.error };

        const removed = await baseQuery({ url: `/wishlist/${id}`, method: 'DELETE' });
        if (removed.error) return { error: removed.error };

        return { data: { success: true } };
      },
      invalidatesTags: [
        { type: 'Wishlist', id: 'LIST' },
        { type: 'Cart', id: 'CURRENT' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
} = wishlistApi;
