import { apiSlice } from '@/lib/redux/api/apiSlice';

export interface CartItem {
  productId: string;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

interface AddItemArgs {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface UpdateQuantityArgs {
  productId: string;
  quantity: number;
}

interface ApplyDiscountArgs {
  code: string;
}

interface ShippingEstimateArgs {
  country: string;
  state: string;
  zipCode: string;
}

interface FearEnvelope<T> {
  result: T;
  success: boolean;
  message: string;
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart/all',
      transformResponse: (obj: FearEnvelope<Cart>) => obj.result,
      providesTags: ['Cart'],
    }),

    addItem: builder.mutation<Cart, AddItemArgs>({
      query: (body) => ({
        url: '/cart/items',
        method: 'POST',
        body,
      }),
      transformResponse: (obj: FearEnvelope<Cart>) => obj.result,
      invalidatesTags: ['Cart'],
    }),

    // Optimistic update — quantity buttons need to feel instant rather than
    // waiting on a round trip before the number changes.
    updateQuantity: builder.mutation<Cart, UpdateQuantityArgs>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: 'PATCH',
        body: { quantity },
      }),
      transformResponse: (obj: FearEnvelope<Cart>) => obj.result,
      async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const item = draft.items.find((i) => i.productId === productId);
            if (item) item.quantity = quantity;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Cart'],
    }),

    removeItem: builder.mutation<Cart, string>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: 'DELETE',
      }),
      transformResponse: (obj: FearEnvelope<Cart>) => obj.result,
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            draft.items = draft.items.filter((i) => i.productId !== productId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Cart'],
    }),

    clearCart: builder.mutation<Cart, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      transformResponse: (obj: FearEnvelope<Cart>) => obj.result,
      invalidatesTags: ['Cart'],
    }),

    applyDiscount: builder.mutation<Cart, ApplyDiscountArgs>({
      query: (body) => ({
        url: '/cart/discount',
        method: 'POST',
        body,
      }),
      transformResponse: (obj: FearEnvelope<Cart>) => obj.result,
      invalidatesTags: ['Cart'],
    }),

    // TODO: this endpoint doesn't exist on the FEAR backend yet — the CRA
    // version computed shipping client-side with a hardcoded US/intl split.
    // Backing this with a real endpoint lets the server own shipping-rate
    // logic instead of the frontend.
    estimateShipping: builder.mutation<Cart, ShippingEstimateArgs>({
      query: (body) => ({
        url: '/cart/shipping-estimate',
        method: 'POST',
        body,
      }),
      transformResponse: (obj: FearEnvelope<Cart>) => obj.result,
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useClearCartMutation,
  useApplyDiscountMutation,
  useEstimateShippingMutation,
} = cartApi;