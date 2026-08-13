import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Placeholder — replace with the real shape once features/cart/slice is converted.
export interface CartItem {
  id: string;
  productId?: string;
  title?: string;
  image?: string;
  price: number;
  subtotal?: number;
  quantity: number;
  sku?: string;
  [key: string]: unknown;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export default cartSlice.reducer;
