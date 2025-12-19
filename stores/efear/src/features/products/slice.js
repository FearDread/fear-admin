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

// Async operation status selectors
export const selectOperationStatus = (state, operation) => 
  state.products.async?.operations?.[operation] || {
    loading: false,
    success: false,
    error: null,
    lastRun: null,
  };

export const selectIsOperationLoading = (state, operation) =>
  state.products.async?.operations?.[operation]?.loading || false;

// Export reducer
export default slice;