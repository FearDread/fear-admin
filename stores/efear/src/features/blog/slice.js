// features/blog/blogSlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import BlogService from "./service";

export const blogFactory = FeatureFactory('blog', {
  togglePublished: (state, action) => {
    const postId = action.payload;
    const post = state.data.find(p => p.id === postId);
    if (post) {
      post.published = !post.published;
    }
  },

  toggleFeatured: (state, action) => {
    const postId = action.payload;
    const post = state.data.find(p => p.id === postId);
    if (post) {
      post.featured = !post.featured;
    }
  },

  setViewMode: (state, action) => {
    state.viewMode = action.payload; // 'grid' or 'list'
  },

  incrementViews: (state, action) => {
    const postId = action.payload;
    const post = state.data.find(p => p.id === postId);
    if (post) {
      post.views = (post.views || 0) + 1;
    }
  },
});

export const { slice, asyncActions: Blog } = blogFactory.create({
  service: BlogService,
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
  // Custom blog reducers
  togglePublished,
  toggleFeatured,
  setViewMode,
  incrementViews,
} = slice.actions;

export const {
  fetch: fetchPosts,
  fetchOne: fetchPost,
  search: searchPosts,
  getPostsByCategory,
  getPostsByAuthor,
  getPostsByTag,
  getFeaturedPosts,
  getRelatedPosts,
  create: createPost,
  update: updatePost,
  delete: deletePost,
} = Blog;

// Export selectors
export const selectPosts = state => state.blog.data;
export const selectAllPosts = (state) => state.blog.data;
export const selectCurrentPost = (state) => state.blog.blog || state.blog.post;
export const selectLoading = (state) => state.blog.loading;
export const selectError = (state) => state.blog.error;
export const selectSuccess = (state) => state.blog.success;
export const selectLoadingState = (state) => state.blog.loadingState;
export const selectPagination = (state) => state.blog.pagination;
export const selectFilters = (state) => state.blog.filtering?.filters || {};
export const selectSearchTerm = (state) => state.blog.filtering?.searchTerm || '';
export const selectSorting = (state) => state.blog.sorting;
export const selectSelection = (state) => state.blog.selection;
export const selectViewMode = (state) => state.blog.viewMode || 'list';

// Advanced selectors
export const selectPostById = (state, postId) => 
  state.blog.data.find(post => post.id === postId);

export const selectByCategory = (state, categoryId) =>
  state.blog.data.filter(post => post.categoryId === categoryId);

export const selectByAuthor = (state, authorId) =>
  state.blog.data.filter(post => post.authorId === authorId);

export const selectByTag = (state, tag) =>
  state.blog.data.filter(post => post.tags?.includes(tag));

export const selectFeaturedPosts = (state) => {
  let posts = selectAllPosts(state);
  posts = posts.filter(post => post.featured === true);
  
  return posts;
};

export const selectPublishedPosts = (state) =>
  state.blog.data.filter(post => post.published === true);

export const selectDraftPosts = (state) =>
  state.blog.data.filter(post => post.published !== true);

export const selectFilteredPosts = (state) => {
  let posts = selectAllPosts(state);
  const filters = state.blog.filtering?.filters || {};
  const searchTerm = state.blog.filtering?.searchTerm || '';
  
  // Apply filters
  if (filters.categoryId) {
    posts = posts.filter(p => p.categoryId === filters.categoryId);
  }
  if (filters.authorId) {
    posts = posts.filter(p => p.authorId === filters.authorId);
  }
  if (filters.tag) {
    posts = posts.filter(p => p.tags?.includes(filters.tag));
  }
  if (filters.published !== undefined) {
    posts = posts.filter(p => p.published === filters.published);
  }
  if (filters.featured !== undefined) {
    posts = posts.filter(p => p.featured === filters.featured);
  }
  if (filters.dateFrom) {
    posts = posts.filter(p => new Date(p.createdAt) >= new Date(filters.dateFrom));
  }
  if (filters.dateTo) {
    posts = posts.filter(p => new Date(p.createdAt) <= new Date(filters.dateTo));
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    posts = posts.filter(p => 
      p.title?.toLowerCase().includes(term) ||
      p.content?.toLowerCase().includes(term) ||
      p.excerpt?.toLowerCase().includes(term) ||
      p.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }
  
  return posts;
};

export const selectSortedPosts = (state) => {
  const posts = selectFilteredPosts(state);
  const sorting = state.blog.sorting;
  
  if (!sorting?.sortBy) return posts;
  
  return [...posts].sort((a, b) => {
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