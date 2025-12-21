// features/products/productSlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import ProductService from "./service";

export const productFactory = FeatureFactory('product', ProductService);

export const { slice, asyncActions: Product } = productFactory.create({
  operations: { fetch: true, search: true, fetchOne: true },
  includeCommonReducers: true
});

export const selectProducts = state => state.products.data;
// Export all actions (common + custom)
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

// Export async actions
export const {
  fetch: fetchProducts,
  fetchOne: fetchProduct,
  search: searchProducts,
  getProductsByCategory,
  getProductsByBrand,
  getFeaturedProducts,
  getRecommendations,
} = Product;

// Export selectors
export const selectAllProducts = (state) => state.products.data;
export const selectCurrentProduct = (state) => state.products.products || state.products.product;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsSuccess = (state) => state.products.success;
export const selectProductsLoadingState = (state) => state.products.loadingState;
export const selectProductsPagination = (state) => state.products.pagination;
export const selectProductsFilters = (state) => state.products.filtering?.filters || {};
export const selectProductsSearchTerm = (state) => state.products.filtering?.searchTerm || '';
export const selectProductsSorting = (state) => state.products.sorting;
export const selectProductsSelection = (state) => state.products.selection;
export const selectProductsViewMode = (state) => state.products.viewMode || 'grid';

// Advanced selectors
export const selectProductById = (state, productId) => 
  state.products.data.find(product => product.id === productId);

export const selectProductsByCategory = (state, categoryId) =>
  state.products.data.filter(product => product.categoryId === categoryId);

export const selectProductsByBrand = (state, brandId) =>
  state.products.data.filter(product => product.brandId === brandId);

export const selectFeaturedProducts = (state) =>
  state.products.data.filter(product => product.featured === true);

export const selectInStockProducts = (state) =>
  state.products.data.filter(product => product.inStock === true);

export const selectFilteredProducts = (state) => {
  let products = [...state.products.data];
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
  if (filters.inStock !== undefined) {
    products = products.filter(p => p.inStock === filters.inStock);
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    products = products.filter(p => 
      p.name?.toLowerCase().includes(term) ||
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