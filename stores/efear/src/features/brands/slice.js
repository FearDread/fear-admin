// features/categories/categorySlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import { brandService } from "./service";

const brandFactory = FeatureFactory('brands', brandService);
const { slice, asyncActions: Brands } = brandFactory.createBasic();

export const {
     setLoading,
  setSuccess,
  setError,
  clearError,
} = slice.actions;

// Export async actions
export const {
  fetch: fetchBrands,
  fetchOne: fetchBrand,
  search: searchBrands,
} = Brands;


export const selectAllBrands = (state) => state.brands.data;
export const selectCurrentBrand = (state) => state.brands.brands || state.brands.brand;
export const selectBrandsLoading = (state) => state.brands.loading;
export const selectBrandsError = (state) => state.brands.error;
export const selectBrandsSuccess = (state) => state.brands.success;
export const selectBrandsLoadingState = (state) => state.brands.loadingState;
export const selectFeaturedBrands = (state) => state.brands.featuredBrands || [];
export const selectFavoriteBrands = (state) => state.brands.favoriteBrands || [];


export default slice;