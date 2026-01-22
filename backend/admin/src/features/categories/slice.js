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
  clearError,
  setFilters,
  setEntity,
  clearEntity,
  appendData,
  prependData,
  updateDataItem,
  removeDataItem,
  setLoading,
  setSuccess,
  resetState,
  resetData,
  resetStatus,
  setPagination,
  setCurrentPage,
  setPageSize,
  clearFilters,
  setSearchTerm,
  setSorting,
  toggleSortOrder,

} = slice.actions;

// Export async actions
export const {
  fetch: fetchCategories,
  fetchOne: fetchCategory,
  search: searchCategories,
  create: createCategory,
  update: updateCategory,
  patch: patchCategory,
  delete: deleteCategory,
} = Categories;

export const selectAllCategories = (state) => state.categories.data;
export const selectCurrentCategory = (state) => state.categories.categories || state.categories.category;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesSuccess = (state) => state.categories.success;
export const selectActiveCategory = (state) => state.categories.activeCategory;
export const selectError = (state) => state.categories.error;
export const selectLoading = (state) => state.categories.loading;
export const selectSuccess = (state) => state.categories.success;
export const selectFilters = (state) => state.categories.filtering?.filters || {};
export const selectSearchTerm = (state) => state.categories.filtering?.searchTerm || '';
export const selectCategoryById = (state, categoryId) =>
  state.categories.data.find(category => category.id === categoryId);

export const selectParentCategories = (state) =>
  state.categories.data.filter(category => !category.parentId);

export const selectSubcategoriesByParent = (state, parentId) =>
  state.categories.data.filter(category => category.parentId === parentId);

export const selectVisibleCategories = (state) =>
  state.categories.data.filter(category => category.visible !== false);

export const selectCategoryPath = (state, categoryId) => {
  const categories = state.categories.data;
  const path = [];
  let currentId = categoryId;
  
  while (currentId) {
    const category = categories.find(c => c.id === currentId);
    if (!category) break;
    path.unshift(category);
    currentId = category.parentId;
  }
  
  return path;
};

export const selectCategoryBreadcrumbs = (state, categoryId) => {
  const path = selectCategoryPath(state, categoryId);
  return path.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
};

export const selectCategoryDepth = (state, categoryId) => {
  return selectCategoryPath(state, categoryId).length;
};

export const selectCategoryHasChildren = (state, categoryId) => {
  return state.categories.data.some(cat => cat.parentId === categoryId);
};

export const selectIsCategoryExpanded = (state, categoryId) => {
  return (state.categories.expandedCategories || []).includes(categoryId);
};

export const selectSortedCategories = (state) => {
  const categories = [...state.categories.data];
  const sorting = state.categories.sorting;
  
  if (!sorting?.sortBy) {
    // Default sort by order then name
    return categories.sort((a, b) => {
      if (a.order !== b.order) return (a.order || 0) - (b.order || 0);
      return (a.name || '').localeCompare(b.name || '');
    });
  }
  
  return categories.sort((a, b) => {
    const aVal = a[sorting.sortBy];
    const bVal = b[sorting.sortBy];
    const order = sorting.sortOrder === 'asc' ? 1 : -1;
    
    if (aVal < bVal) return -1 * order;
    if (aVal > bVal) return 1 * order;
    return 0;
  });
};

// Build hierarchical tree structure
export const selectCategoryTreeStructure = (state) => {
  const categories = state.categories.data;
  const roots = categories.filter(cat => !cat.parentId);
  
  const buildTree = (parentId) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => ({
        ...cat,
        children: buildTree(cat.id),
      }));
  };
  
  return roots.map(root => ({
    ...root,
    children: buildTree(root.id),
  }));
};

export default slice;