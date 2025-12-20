// features/categories/categorySlice.js
import { FeatureFactory } from '@feardread/feature-factory';

const reportsFactory = FeatureFactory('category', {});
const { slice, asyncActions: Categories } = reportsFactory.createBasic();

// Export all actions
export const {
  setData,
  selectAll,
  setActiveCategory,
  toggleCategoryVisibility,
} = slice.actions;

// Export async actions
export const {
  fetch: fetchCategories,
  fetchOne: fetchCategory,
  search: searchCategories,
} = Categories;

// Export selectors
export const selectAllCategories = (state) => state.categories.data;
export const selectCurrentCategory = (state) => state.categories.categories || state.categories.category;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesSuccess = (state) => state.categories.success;
export const selectActiveCategory = (state) => state.categories.activeCategory;


export default slice;