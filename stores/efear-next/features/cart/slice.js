import { FeatureFactory } from '@feardread/feature-factory';

const CartReducers = {
  // Add item to cart
  addItem: (state, action) => {
    const item = action.payload;
    const existingItem = state.items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += item.quantity || 1;
    } else {
      // Add new item
      state.items.push({
        ...item,
        quantity: item.quantity || 1,
        addedAt: new Date().toISOString(),
      });
    }
    
    // Update totals
    state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    state.total = state.subtotal + (state.shipping || 0) - (state.discount || 0);
  },
  
  // Remove item from cart
  removeItem: (state, action) => {
    const productId = action.payload;
    state.items = state.items.filter(item => item.productId !== productId);
    
    // Update totals
    state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    state.total = state.subtotal + (state.shipping || 0) - (state.discount || 0);
  },
  
  // Update item quantity
  updateQuantity: (state, action) => {
    const { productId, quantity } = action.payload;
    const item = state.items.find(i => i.productId === productId);
    
    if (item) {
      item.quantity = Math.max(1, quantity);
      
      // Update totals
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.total = state.subtotal + (state.shipping || 0) - (state.discount || 0);
    }
  },
  
  // Clear cart
  clearCart: (state) => {
    state.items = [];
    state.itemCount = 0;
    state.subtotal = 0;
    state.total = 0;
    state.discount = 0;
  },
  
  // Apply discount
  applyDiscount: (state, action) => {
    state.discount = action.payload;
    state.total = state.subtotal + (state.shipping || 0) - state.discount;
  },
  
  // Set shipping cost
  setShipping: (state, action) => {
    state.shipping = action.payload;
    state.total = state.subtotal + state.shipping - (state.discount || 0);
  },
};

const cartFactory = FeatureFactory('cart', CartReducers);

const { slice, asyncActions } = cartFactory.create({
  stateOptions: {
    customFields: {
      items: [],
      itemCount: 0,
      subtotal: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      couponCode: null,
    },
  },
  operations: {
    fetch: false,
    fetchOne: false,
    search: false,
    create: false,
    update: false,
    patch: false,
    delete: false,
  },
});

// Export actions
export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyDiscount,
  setShipping,
} = slice.actions;

export const {
  syncCart,
  applyCoupon,
} = asyncActions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartShipping = (state) => state.cart.shipping;
export const selectCartDiscount = (state) => state.cart.discount;

export const selectCartItemById = (state, productId) =>
  state.cart.items.find(item => item.productId === productId);

export const selectIsInCart = (state, productId) =>
  state.cart.items.some(item => item.productId === productId);

export default slice