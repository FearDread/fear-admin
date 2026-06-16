import { FeatureFactory, ThunkFactory } from '@feardread/feature-factory';

const WishlistReducers = {
addToWishlist: (state, action) => {
    const item = action.payload;
    const exists = state.data.find(i => i.productId === item.productId || i.id === item.id);
    
    if (!exists) {
      state.data.push({
        id: item.id || item.productId || Date.now().toString(),
        productId: item.productId || item.id,
        ...item,
        addedAt: new Date().toISOString()
      });
      state.itemCount = state.data.length;
      state.success = true;
      state.error = null;
    } else {
      state.error = 'Item already in wishlist';
    }
  },

  // Remove item from wishlist
  removeFromWishlist: (state, action) => {
    const productId = action.payload;
    state.data = state.data.filter(item => 
      item.productId !== productId && item.id !== productId
    );
    state.itemCount = state.data.length;
    state.success = true;
    state.error = null;
  },

  // Clear entire wishlist
  clearWishlist: (state) => {
    state.data = [];
    state.itemCount = 0;
    state.success = true;
  },

  // Move item to cart
  moveToCart: (state, action) => {
    const productId = action.payload;
    const item = state.data.find(i => 
      i.productId === productId || i.id === productId
    );
    
    if (item) {
      state.data = state.data.filter(i => 
        i.productId !== productId && i.id !== productId
      );
      state.itemCount = state.data.length;
      state.movedToCart = item;
      state.success = true;
    }
  },

  // Toggle item in wishlist (add if not exists, remove if exists)
  toggleWishlist: (state, action) => {
    const item = action.payload;
    const index = state.data.findIndex(i => 
      i.productId === item.productId || i.id === item.id
    );
    
    if (index !== -1) {
      state.data.splice(index, 1);
    } else {
      state.data.push({
        id: item.id || item.productId || Date.now().toString(),
        productId: item.productId || item.id,
        ...item,
        addedAt: new Date().toISOString()
      });
    }
    state.itemCount = state.data.length;
    state.success = true;
  },

  // Update wishlist item count
  updateItemCount: (state) => {
    state.itemCount = state.data.length;
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


const wishlistFactory = FeatureFactory('wishlist', WishlistReducers, {
  service: WishlistService,
  includeEntityState: true,
  includePagination: false,
  includeFiltering: true,
  includeSorting: true,
  includeSelection: true,
  customFields: {
    items: [],
    movedToCart: null,
    itemInWishlist: false,
    totalItems: 0
  }
});

// Create wishlist slice
const { slice, asyncActions: Wishlist } = wishlistFactory.create();

export const {
  setSorting,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  toggleWishlist,
  isInWishlist,
  setData,
  setLoading,
  setError,
  updateItemCount
} = slice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist?.data || [];
export const selectWishlistCount = (state) => state.wishlist?.data?.length || 0;
export const selectWishlistLoading = (state) => state.wishlist?.loading || false;
export const selectWishlistError = (state) => state.wishlist?.error || null;
export const selectIsInWishlist = (state, productId) => {
  const items = state.wishlist?.data || [];
  return items.some(item => item.productId === productId);
};
export const selectWishlistSorting = (state) => state.wishlist?.sorting || { sortBy: 'addedAt', sortOrder: 'desc' };
export const selectWishlistTotalValue = (state) => {
  const items = state.wishlist?.data || [];
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};



export default slice