import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Placeholder — replace with the real shape once features/wishlist/slice is converted.
export interface WishlistItem {
  id: string;
  [key: string]: unknown;
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      state.items.push(action.payload);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export const selectIsInWishlist = (state: RootState, id: string) =>
  state.wishlist.items.some((item) => item.id === id);
export default wishlistSlice.reducer;