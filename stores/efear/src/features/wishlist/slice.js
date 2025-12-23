import { FeatureFactory, ThunkFactory } from '@feardread/feature-factory';

const WishlistReducers = {
  // Add item to wishlist
  addToWishlist: (state, action) => {
    const item = action.payload;
    const exists = state.items.find(i => i.id === item.id);
    
    if (!exists) {
      state.items.push({
        ...item,
        addedAt: new Date().toISOString(),
      });
      state.itemCount = state.items.length;
    }
  },
  
  // Remove from wishlist
  removeFromWishlist: (state, action) => {
    const productId = action.payload;
    state.items = state.items.filter(item => item.id !== productId);
    state.itemCount = state.items.length;
  },
  
  // Clear wishlist
  clearWishlist: (state) => {
    state.items = [];
    state.itemCount = 0;
  },
  
  // Toggle wishlist item
  toggleWishlist: (state, action) => {
    const item = action.payload;
    const index = state.items.findIndex(i => i.id === item.id);
    
    if (index > -1) {
      state.items.splice(index, 1);
    } else {
      state.items.push({
        ...item,
        addedAt: new Date().toISOString(),
      });
    }
    state.itemCount = state.items.length;
  },
};

const WishlistService = {
  // Sync wishlist with server
  syncWishlist: ThunkFactory.custom('wishlist', 'sync', {
    method: 'POST',
  }),
  
  // Move item to cart
  moveToCart: ThunkFactory.custom('wishlist', 'move-to-cart', {
    method: 'POST',
  }),
};

/**
 * Create wishlist feature
 */
const wishlistFactory = FeatureFactory('wishlist', WishlistReducers);

const { slice, asyncActions: Wishlist } = wishlistFactory.create({ 
  service: WishlistService,
  stateOptions: {
    customFields: {
      items: [],
      itemCount: 0,
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
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} = slice.actions;

export const {
  syncWishlist,
  moveToCart,
} = Wishlist;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistItemCount = (state) => state.wishlist.itemCount;

export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items.some(item => item.id === productId);

export const selectWishlistItemById = (state, productId) =>
  state.wishlist.items.find(item => item.id === productId);

export { slice };
export default slice