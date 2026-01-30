// features/reviews/reviewSlice.js
import { FeatureFactory } from '@feardread/feature-factory';
import ReviewService from "./service";

export const reviewFactory = FeatureFactory('review', {
  toggleHelpful: (state, action) => {
    const reviewId = action.payload;
    const review = state.data.find(r => r.id === reviewId);
    if (review) {
      review.isHelpful = !review.isHelpful;
      review.helpfulCount = review.isHelpful 
        ? (review.helpfulCount || 0) + 1 
        : Math.max(0, (review.helpfulCount || 0) - 1);
    }
  },

  setRatingFilter: (state, action) => {
    state.ratingFilter = action.payload; // number 1-5 or null
  },

  setViewMode: (state, action) => {
    state.viewMode = action.payload; // 'recent', 'helpful', 'rating'
  },

  updateReviewRating: (state, action) => {
    const { reviewId, rating } = action.payload;
    const review = state.data.find(r => r.id === reviewId);
    if (review) {
      review.rating = rating;
    }
  },

  toggleVerified: (state, action) => {
    const reviewId = action.payload;
    const review = state.data.find(r => r.id === reviewId);
    if (review) {
      review.verified = !review.verified;
    }
  },

  markAsReported: (state, action) => {
    const reviewId = action.payload;
    const review = state.data.find(r => r.id === reviewId);
    if (review) {
      review.reported = true;
    }
  },

  addReply: (state, action) => {
    const { reviewId, reply } = action.payload;
    const review = state.data.find(r => r.id === reviewId);
    if (review) {
      review.replies = review.replies || [];
      review.replies.push(reply);
    }
  },
});

export const { slice, asyncActions: Review } = reviewFactory.create({
  service: ReviewService,
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
  // Custom review reducers
  toggleHelpful,
  setRatingFilter,
  setViewMode,
  updateReviewRating,
  toggleVerified,
  markAsReported,
  addReply,
} = slice.actions;

export const {
  fetch: fetchReviews,
  fetchOne: fetchReview,
  search: searchReviews,
  create: submitReview,
  getReviewsByProduct,
  getReviewsByUser,
  getVerifiedReviews,
  getFeaturedReviews,
  getRecentReviews,
} = Review;

// Export selectors
export const selectReviews = state => state.reviews.data;
export const selectAllReviews = (state) => state.reviews.data;
export const selectCurrentReview = (state) => state.reviews.currentReview || state.reviews.review;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;
export const selectReviewsSuccess = (state) => state.reviews.success;
export const selectReviewsLoadingState = (state) => state.reviews.loadingState;
export const selectReviewsPagination = (state) => state.reviews.pagination;
export const selectReviewsFilters = (state) => state.reviews.filtering?.filters || {};
export const selectReviewsSearchTerm = (state) => state.reviews.filtering?.searchTerm || '';
export const selectReviewsSorting = (state) => state.reviews.sorting;
export const selectReviewsSelection = (state) => state.reviews.selection;
export const selectReviewsViewMode = (state) => state.reviews.viewMode || 'recent';
export const selectReviewsRatingFilter = (state) => state.reviews.ratingFilter || null;

// Advanced selectors
export const selectReviewById = (state, reviewId) => 
  state.reviews.data.find(review => review.id === reviewId);

export const selectReviewsByProduct = (state, productId) =>
  state.reviews.data.filter(review => review.productId === productId);

export const selectReviewsByUser = (state, userId) =>
  state.reviews.data.filter(review => review.userId === userId);

export const selectVerifiedReviews = (state) => {
  let reviews = selectAllReviews(state);
  reviews = reviews.filter(review => review.verified === true);
  
  return reviews;
};

export const selectReviewsByRating = (state, rating) =>
  state.reviews.data.filter(review => review.rating === rating);

export const selectHighRatedReviews = (state) =>
  state.reviews.data.filter(review => review.rating >= 4);

export const selectLowRatedReviews = (state) =>
  state.reviews.data.filter(review => review.rating <= 2);

export const selectHelpfulReviews = (state) =>
  state.reviews.data.filter(review => (review.helpfulCount || 0) > 5);

export const selectFilteredReviews = (state) => {
  let reviews = selectAllReviews(state);
  const filters = state.reviews.filtering?.filters || {};
  const searchTerm = state.reviews.filtering?.searchTerm || '';
  const ratingFilter = state.reviews.ratingFilter;
  
  // Apply filters
  if (filters.productId) {
    reviews = reviews.filter(r => r.productId === filters.productId);
  }
  if (filters.userId) {
    reviews = reviews.filter(r => r.userId === filters.userId);
  }
  if (filters.verified !== undefined) {
    reviews = reviews.filter(r => r.verified === filters.verified);
  }
  if (filters.minRating) {
    reviews = reviews.filter(r => r.rating >= filters.minRating);
  }
  if (filters.maxRating) {
    reviews = reviews.filter(r => r.rating <= filters.maxRating);
  }
  if (ratingFilter) {
    reviews = reviews.filter(r => r.rating === ratingFilter);
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    reviews = reviews.filter(r => 
      r.title?.toLowerCase().includes(term) ||
      r.content?.toLowerCase().includes(term) ||
      r.userName?.toLowerCase().includes(term)
    );
  }
  
  return reviews;
};

export const selectSortedReviews = (state) => {
  const reviews = selectFilteredReviews(state);
  const sorting = state.reviews.sorting;
  const viewMode = state.reviews.viewMode;
  
  // Apply view mode sorting
  if (viewMode === 'helpful') {
    return [...reviews].sort((a, b) => 
      (b.helpfulCount || 0) - (a.helpfulCount || 0)
    );
  }
  
  if (viewMode === 'rating') {
    return [...reviews].sort((a, b) => b.rating - a.rating);
  }
  
  if (viewMode === 'recent') {
    return [...reviews].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  
  // Apply custom sorting if specified
  if (!sorting?.sortBy) return reviews;
  
  return [...reviews].sort((a, b) => {
    const aVal = a[sorting.sortBy];
    const bVal = b[sorting.sortBy];
    const order = sorting.sortOrder === 'asc' ? 1 : -1;
    
    if (aVal < bVal) return -1 * order;
    if (aVal > bVal) return 1 * order;
    return 0;
  });
};

// Calculate average rating for a product
export const selectAverageRatingByProduct = (state, productId) => {
  const reviews = selectReviewsByProduct(state, productId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

// Get rating distribution for a product
export const selectRatingDistribution = (state, productId) => {
  const reviews = selectReviewsByProduct(state, productId);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });
  
  return distribution;
};

// Export reducer
export default slice;