/**
 * features/cart/cartApi.ts
 *
 * Cart is intentionally NOT backed by a Redux slice. All cart state lives
 * in the RTK Query cache under the 'Cart' tag. This matches the project
 * principle: "Cart is entirely off Redux onto cartApi (no cart: reducer
 * key in store)".
 *
 * If you need local-only UI state (e.g. "is the mini-cart drawer open"),
 * that belongs in a component's useState, not here and not in a slice.
 *
 * NOTE: verify this import path against your real apiSlice location.
 */
import { apiSlice } from '@/lib/redux/api/apiSlice';

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
    variant?: string | null;
    lineTotal: number;
}

export interface Cart {
    id: string;
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    discount: number;
    total: number;
    coupon?: {
        code: string;
        amount: number;
    } | null;
}

export interface AddToCartRequest {
    productId: string;
    quantity: number;
    variant?: string;
}

export interface UpdateCartItemRequest {
    itemId: string;
    quantity: number;
}

export interface ApplyCouponRequest {
    code: string;
}

export interface ShippingEstimateRequest {
    postalCode: string;
    country: string;
}

export interface ShippingEstimate {
    method: string;
    cost: number;
    estimatedDays: number;
}

// FEAR API envelope — every list/object response is wrapped like this
interface FearEnvelope<T> {
    result: T;
    success: boolean;
    message: string;
    count?: number;
}

// ─────────────────────────────────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────────────────────────────────

export const cartApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<Cart, void>({
            query: () => '/cart/user',
            transformResponse: (response: FearEnvelope<Cart>) => response.result,
            providesTags: (result) =>
                result
                    ? [
                        { type: 'Cart' as const, id: 'CURRENT' },
                        ...result.items.map((item) => ({ type: 'Cart' as const, id: item.id })),
                    ]
                    : [{ type: 'Cart' as const, id: 'CURRENT' }],
        }),

        addToCart: builder.mutation<Cart, AddToCartRequest>({
            query: (body) => ({
                url: '/cart/items',
                method: 'POST',
                body,
            }),
            transformResponse: (response: FearEnvelope<Cart>) => response.result,
            invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
        }),

        updateCartItem: builder.mutation<Cart, UpdateCartItemRequest>({
            query: ({ itemId, quantity }) => ({
                url: `/cart/items/${itemId}`,
                method: 'PATCH',
                body: { quantity },
            }),
            transformResponse: (response: FearEnvelope<Cart>) => response.result,
            // Optimistic update so the qty stepper feels instant on the cart page
            async onQueryStarted({ itemId, quantity }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        const item = draft.items.find((i) => i.id === itemId);
                        if (item) {
                            item.quantity = quantity;
                            item.lineTotal = item.price * quantity;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
        }),

        removeCartItem: builder.mutation<Cart, string>({
            query: (itemId) => ({
                url: `/cart/items/${itemId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: FearEnvelope<Cart>) => response.result,
            async onQueryStarted(itemId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        draft.items = draft.items.filter((i) => i.id !== itemId);
                        draft.itemCount = draft.items.reduce((sum, i) => sum + i.quantity, 0);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
        }),

        clearCart: builder.mutation<Cart, void>({
            query: () => ({
                url: '/cart',
                method: 'DELETE',
            }),
            transformResponse: (response: FearEnvelope<Cart>) => response.result,
            invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
        }),

        applyCoupon: builder.mutation<Cart, ApplyCouponRequest>({
            query: (body) => ({
                url: '/cart/coupon',
                method: 'POST',
                body,
            }),
            transformResponse: (response: FearEnvelope<Cart>) => response.result,
            invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
        }),

        removeCoupon: builder.mutation<Cart, void>({
            query: () => ({
                url: '/cart/coupon',
                method: 'DELETE',
            }),
            transformResponse: (response: FearEnvelope<Cart>) => response.result,
            invalidatesTags: [{ type: 'Cart', id: 'CURRENT' }],
        }),

        // ⚠️ BACKEND GAP: /cart/shipping-estimate does not exist on the Express
        // FEAR API yet (see MERGE_NOTES.md). This endpoint will 404 until that
        // route is implemented. Left here so CheckoutShipping can wire up
        // against it now and it starts working the moment the backend lands.
        getShippingEstimate: builder.query<ShippingEstimate[], ShippingEstimateRequest>({
            query: ({ postalCode, country }) => ({
                url: '/cart/shipping-estimate',
                params: { postalCode, country },
            }),
            transformResponse: (response: FearEnvelope<ShippingEstimate[]>) => response.result,
            providesTags: [{ type: 'Cart', id: 'SHIPPING_ESTIMATE' }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
    useApplyCouponMutation,
    useRemoveCouponMutation,
    useGetShippingEstimateQuery,
    useLazyGetShippingEstimateQuery,
} = cartApi;