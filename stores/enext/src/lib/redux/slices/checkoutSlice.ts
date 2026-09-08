import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/redux/store';
import type { Address } from '@/types/checkout';

interface CheckoutState {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  sameAsShipping: boolean;

  shippingMethodId: string | null;
  shippingCost: number;
  estimatedDelivery: string | null;

  discountCode: string | null;
  discount: number;

  paymentMethod: 'card' | 'paypal-payment' | 'net-banking' | null;
  paymentIntentId: string | null;
}

const initialState: CheckoutState = {
  shippingAddress: null,
  billingAddress: null,
  sameAsShipping: true,
  shippingMethodId: null,
  shippingCost: 0,
  estimatedDelivery: null,
  discountCode: null,
  discount: 0,
  paymentMethod: null,
  paymentIntentId: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setAddresses(
      state,
      action: PayloadAction<{
        shippingAddress: Address;
        billingAddress: Address;
        sameAsShipping: boolean;
      }>
    ) {
      state.shippingAddress = action.payload.shippingAddress;
      state.billingAddress = action.payload.billingAddress;
      state.sameAsShipping = action.payload.sameAsShipping;
    },
    setShippingMethod(
      state,
      action: PayloadAction<{ id: string; cost: number; estimatedDelivery: string }>
    ) {
      state.shippingMethodId = action.payload.id;
      state.shippingCost = action.payload.cost;
      state.estimatedDelivery = action.payload.estimatedDelivery;
    },
    applyDiscount(state, action: PayloadAction<{ code: string; amount: number }>) {
      state.discountCode = action.payload.code;
      state.discount = action.payload.amount;
    },
    clearDiscount(state) {
      state.discountCode = null;
      state.discount = 0;
    },
    setPaymentIntent(
      state,
      action: PayloadAction<{ paymentMethod: CheckoutState['paymentMethod']; paymentIntentId: string }>
    ) {
      state.paymentMethod = action.payload.paymentMethod;
      state.paymentIntentId = action.payload.paymentIntentId;
    },
    resetCheckout() {
      return initialState;
    },
  },
});

export const {
  setAddresses,
  setShippingMethod,
  applyDiscount,
  clearDiscount,
  setPaymentIntent,
  resetCheckout,
} = checkoutSlice.actions;

export const selectCheckout = (state: RootState) => state.checkout;
export const selectShippingAddress = (state: RootState) => state.checkout.shippingAddress;
export const selectBillingAddress = (state: RootState) => state.checkout.billingAddress;
export const selectShippingMethodId = (state: RootState) => state.checkout.shippingMethodId;
export const selectShippingCost = (state: RootState) => state.checkout.shippingCost;
export const selectEstimatedDelivery = (state: RootState) => state.checkout.estimatedDelivery;
export const selectDiscountCode = (state: RootState) => state.checkout.discountCode;
export const selectDiscount = (state: RootState) => state.checkout.discount;
export const selectPaymentIntentId = (state: RootState) => state.checkout.paymentIntentId;

export default checkoutSlice.reducer;
