import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/redux/store';

export interface WishlistItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some((i) => i.productId === action.payload.productId);
      if (!exists) state.items.push(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    toggleWishlistItem(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some((i) => i.productId === action.payload.productId);
      if (exists) {
        state.items = state.items.filter((i) => i.productId !== action.payload.productId);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlistItem, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistCount = (state: RootState) => state.wishlist.items.length;
export const selectIsInWishlist = (productId: string) => (state: RootState) =>
  state.wishlist.items.some((i) => i.productId === productId);

export default wishlistSlice.reducer;