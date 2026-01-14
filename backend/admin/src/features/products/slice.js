// features/products/productSlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import ProductService from "./service";

export const productFactory = FeatureFactory('product', {
  toggleFeatured: (state, action) => {
    const productId = action.payload;
    const product = state.data.find(p => p.id === productId);
    if (product) {
      product.featured = !product.featured;
    }
  },

  setViewMode: (state, action) => {
    state.viewMode = action.payload; // 'grid' or 'list'
  },
});

export const { slice, asyncActions: Product } = productFactory.create({
  service: ProductService,
  operations: { fetch: true, search: true, fetchOne: true },
  includeCommonReducers: true
});

export const {
  // Common reducers from FeatureFactory
  setEntity,
  clearEntity,
  setData,
  appendData,
  prependData,
  updateDataItem,
  removeDataItem,
  setLoading,
  setSuccess,
  setError,
  clearError,
  resetState,
  resetData,
  resetStatus,
  setPagination,
  setCurrentPage,
  setPageSize,
  setFilters,
  clearFilters,
  setSearchTerm,
  setSorting,
  toggleSortOrder,
  setSelectedItems,
  toggleItemSelection,
  selectAll,
  clearSelection,
  updateMetadata,
  markAsStale,
  markAsFresh,
  // Custom product reducers
  setStockStatus,
  updatePrice,
  toggleFeatured,
  addVariant,
  removeVariant,
  setViewMode,
} = slice.actions;

export const {
  fetch: fetchProducts,
  fetchOne: fetchProduct,
  search: searchProducts,
  getProductsByCategory,
  getProductsByBrand,
  getFeaturedProducts,
  getRecommendations,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
} = Product;

// Export selectors
export const selectProducts = state => state.products.data;
export const selectAllProducts = (state) => state.products.data;
export const selectCurrentProduct = (state) => state.products.currentProduct || state.products.product;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectSuccess = (state) => state.products.success;
export const selectLoadingState = (state) => state.products.loadingState;
export const selectPagination = (state) => state.products.pagination;
export const selectFilters = (state) => state.products.filtering?.filters || {};
export const selectSearchTerm = (state) => state.products.filtering?.searchTerm || '';
export const selectSorting = (state) => state.products.sorting;
export const selectSelection = (state) => state.products.selection;
export const selectViewMode = (state) => state.products.viewMode || 'list';

// Advanced selectors
export const selectProductById = (state, productId) => 
  state.products.data.find(product => product.id === productId);

export const selectByCategory = (state, categoryId) =>
  state.products.data.filter(product => product.categoryId === categoryId);

export const selectByBrand = (state, brandId) =>
  state.products.data.filter(product => product.brandId === brandId);

export const selectFeaturedProducts = (state) => {
  let products = selectAllProducts(state);
  products = products.filter(product => product.isFeatured === true);
  
  return products;
}

export const selectInStockProducts = (state) =>
  state.products.data.filter(product => product.inStock === true);

export const selectFilteredProducts = (state) => {
  let products = selectAllProducts(state);
  const filters = state.products.filtering?.filters || {};
  const searchTerm = state.products.filtering?.searchTerm || '';
  
  // Apply filters
  if (filters.categoryId) {
    products = products.filter(p => p.categoryId === filters.categoryId);
  }
  if (filters.brandId) {
    products = products.filter(p => p.brandId === filters.brandId);
  }
  if (filters.minPrice) {
    products = products.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    products = products.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.quantity !== undefined) {
    products = products.filter(p => p.quantity === filters.quantity);
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    products = products.filter(p => 
      p.title?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term)
    );
  }
  
  return products;
};

export const selectSortedProducts = (state) => {
  const products = selectFilteredProducts(state);
  const sorting = state.products.sorting;
  
  if (!sorting?.sortBy) return products;
  
  return [...products].sort((a, b) => {
    const aVal = a[sorting.sortBy];
    const bVal = b[sorting.sortBy];
    const order = sorting.sortOrder === 'asc' ? 1 : -1;
    
    if (aVal < bVal) return -1 * order;
    if (aVal > bVal) return 1 * order;
    return 0;
  });
};


// Export reducer
export default slice;