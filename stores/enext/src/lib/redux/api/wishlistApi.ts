import { apiSlice } from '@/lib/redux/api/apiSlice';
import { FearEnvelope } from '@/types/fear';

export interface WishlistItem {
  id: string; // wishlist entry id (used for removal)
  productId: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  sku?: string;
}

interface WishlistListEnvelope {
  result: WishlistItem[];
  success: boolean;
  message: string;
  count: number;
}

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], void>({
      query: () => '/wishlist',
      // FEAR list envelope unwrap — required for every list endpoint.
      transformResponse: (response: FearEnvelope) => response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.map((w) => ({ type: 'Wishlist' as const, id: w.id })),
              { type: 'Wishlist' as const, id: 'LIST' },
            ]
          : [{ type: 'Wishlist' as const, id: 'LIST' }],
    }),

    addToWishlist: builder.mutation<WishlistItem, WishlistItem>({
      query: (item) => ({ url: '/wishlist', method: 'POST', body: item }),
      async onQueryStarted(item, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData('getWishlist', undefined, (draft) => {
            draft.push(item);
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

    removeFromWishlist: builder.mutation<{ id: string }, string>({
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

    // Backend note: this needs a real /wishlist/move-to-cart endpoint on
    // FEARServer that atomically adds the item to the cart and removes it
    // from the wishlist server-side (the old thunk did these as two
    // separate client-side dispatches, which is what caused the manual
    // push()-to-array patching in the original component).
    moveToCart: builder.mutation<
      { success: boolean },
      { productId: string; quantity: number }
    >({
      query: (body) => ({ url: '/wishlist/move-to-cart', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Wishlist', id: 'LIST' },
        { type: 'Cart', id: 'LIST' },
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