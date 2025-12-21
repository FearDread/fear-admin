// features/brands/brandSlice.js
import { FeatureFactory } from '@feardread/feature-factory';


/**
 * Create the brand feature factory
 */
const brandFactory = FeatureFactory('brand', {});
const { slice, asyncActions: Brands } = brandFactory.create({
  stateOptions: {
    includeFiltering: true,
    includeSorting: true,
  },
  includeCommonReducers: true,
});

// Export all actions
export const {
  // Common reducers
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
  // Custom brand reducers
  setFeaturedBrands,
  toggleFavorite,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  setBrandStats,
  updateBrandStatus,
  toggleBrandActive,
  setBrandViewType,
} = slice.actions;

// Export async actions
export const {
  fetch: fetchBrands,
  fetchOne: fetchBrand,
  search: searchBrands,
  getFeaturedBrands,
  getPopularBrands,
} = Brands;

// Export basic selectors
export const selectAllBrands = (state) => state.brands.data;
export const selectCurrentBrand = (state) => state.brands.brands || state.brands.brand;
export const selectBrandsLoading = (state) => state.brands.loading;
export const selectBrandsError = (state) => state.brands.error;
export const selectBrandsSuccess = (state) => state.brands.success;
export const selectBrandsLoadingState = (state) => state.brands.loadingState;
export const selectFeaturedBrands = (state) => state.brands.featuredBrands || [];
export const selectFavoriteBrands = (state) => state.brands.favoriteBrands || [];
export const selectBrandStats = (state) => state.brands.brandStats || {};
export const selectBrandsPagination = (state) => state.brands.pagination;
export const selectBrandsFilters = (state) => state.brands.filtering?.filters || {};
export const selectBrandsSearchTerm = (state) => state.brands.filtering?.searchTerm || '';
export const selectBrandsSorting = (state) => state.brands.sorting;
export const selectBrandsSelection = (state) => state.brands.selection;
export const selectSelectedBrands = (state) => state.brands.selection?.selectedItems || [];
export const selectBrandsMetadata = (state) => state.brands.metadata;
export const selectBrandViewType = (state) => state.brands.viewType || 'grid';

// Advanced selectors
export const selectBrandById = (state, brandId) =>
  state.brands.data.find(brand => brand.id === brandId);

export const selectBrandsByCategory = (state, categoryId) =>
  state.brands.data.filter(brand => 
    brand.categories && brand.categories.includes(categoryId)
  );

export const selectActiveBrands = (state) =>
  state.brands.data.filter(brand => brand.active !== false);

export const selectIsBrandFavorite = (state, brandId) =>
  (state.brands.favoriteBrands || []).includes(brandId);

export const selectBrandStatsById = (state, brandId) =>
  state.brands.brandStats?.[brandId] || null;

export const selectFeaturedBrandObjects = (state) => {
  const featuredIds = state.brands.featuredBrands || [];
  return state.brands.data.filter(brand => featuredIds.includes(brand.id));
};

export const selectFavoriteBrandObjects = (state) => {
  const favoriteIds = state.brands.favoriteBrands || [];
  return state.brands.data.filter(brand => favoriteIds.includes(brand.id));
};

export const selectFilteredBrands = (state) => {
  let brands = [...state.brands.data];
  const filters = state.brands.filtering?.filters || {};
  const searchTerm = state.brands.filtering?.searchTerm || '';
  
  // Apply active filter
  if (filters.active !== undefined) {
    brands = brands.filter(b => b.active === filters.active);
  }
  
  // Apply category filter
  if (filters.categoryId) {
    brands = brands.filter(b => 
      b.categories && b.categories.includes(filters.categoryId)
    );
  }
  
  // Apply featured filter
  if (filters.featured !== undefined) {
    const featuredIds = state.brands.featuredBrands || [];
    brands = brands.filter(b => featuredIds.includes(b.id) === filters.featured);
  }
  
  // Apply favorite filter
  if (filters.favorite !== undefined) {
    const favoriteIds = state.brands.favoriteBrands || [];
    brands = brands.filter(b => favoriteIds.includes(b.id) === filters.favorite);
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    brands = brands.filter(b => 
      b.name?.toLowerCase().includes(term) ||
      b.description?.toLowerCase().includes(term) ||
      b.slug?.toLowerCase().includes(term)
    );
  }
  
  return brands;
};

export const selectSortedBrands = (state) => {
  const brands = selectFilteredBrands(state);
  const sorting = state.brands.sorting;
  
  if (!sorting?.sortBy) {
    // Default sort by name
    return [...brands].sort((a, b) => 
      (a.name || '').localeCompare(b.name || '')
    );
  }
  
  return [...brands].sort((a, b) => {
    const aVal = a[sorting.sortBy];
    const bVal = b[sorting.sortBy];
    const order = sorting.sortOrder === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * order;
    }
    
    if (aVal < bVal) return -1 * order;
    if (aVal > bVal) return 1 * order;
    return 0;
  });
};

export const selectBrandsByLetter = (state) => {
  const brands = selectSortedBrands(state);
  const grouped = {};
  
  brands.forEach(brand => {
    const letter = (brand.name?.[0] || '#').toUpperCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(brand);
  });
  
  return grouped;
};

export const selectBrandsAlphabetIndex = (state) => {
  const grouped = selectBrandsByLetter(state);
  return Object.keys(grouped).sort();
};

// Async operation status selectors
export const selectOperationStatus = (state, operation) => 
  state.brands.async?.operations?.[operation] || {
    loading: false,
    success: false,
    error: null,
    lastRun: null,
  };

export const selectIsOperationLoading = (state, operation) =>
  state.brands.async?.operations?.[operation]?.loading || false;

// Export reducer
export default slice;