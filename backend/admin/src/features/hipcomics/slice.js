// features/hipcomic/slice.js
import { createSelector } from '@reduxjs/toolkit';
import { FeatureFactory } from '@feardread/feature-factory';

export const hipcomicFactory = FeatureFactory('hipcomic', {
    setViewMode: (state, action) => {
        state.viewMode = action.payload; // 'grid' or 'list'
    },
});

export const { slice, asyncActions: Hipcomic } = hipcomicFactory.create({
    operations: {
        fetch: true,
        fetchOne: true,
        delete: true,
        search: false,
        create: false,
        update: false,
        patch: false,
    },
    includeCommonReducers: true,
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
    // Custom hipcomic reducers
    setViewMode,
} = slice.actions;

export const {
    fetch: fetchHipcomic,
    fetchOne: fetchHipcomicItem,
    delete: deleteHipcomicItem,
} = Hipcomic;

// ---------------------------------------------------------------- selectors
// The reducer must be registered in the store under the key `hipcomic`.

export const selectAllHipcomic = (state) => state.hipcomic.data;
export const selectCurrentHipcomicItem = (state) =>
    state.hipcomic.currentHipcomic || state.hipcomic.hipcomic;
export const selectLoading = (state) => state.hipcomic.loading;
export const selectError = (state) => state.hipcomic.error;
export const selectSuccess = (state) => state.hipcomic.success;
export const selectLoadingState = (state) => state.hipcomic.loadingState;
export const selectPagination = (state) => state.hipcomic.pagination;
export const selectFilters = (state) => state.hipcomic.filtering?.filters || {};
export const selectSearchTerm = (state) => state.hipcomic.filtering?.searchTerm || '';
export const selectSorting = (state) => state.hipcomic.sorting;
export const selectSelection = (state) => state.hipcomic.selection;
export const selectViewMode = (state) => state.hipcomic.viewMode || 'list';

// Advanced selectors
export const selectHipcomicById = (state, itemId) =>
    state.hipcomic.data.find(
        (item) => item.id === itemId || item._id === itemId || item.hipcomicId === itemId
    );

export const selectByPublisher = (state, publisherSlug) =>
    state.hipcomic.data.filter((item) => item.publisherSlug === publisherSlug);

export const selectBySeries = (state, series) =>
    state.hipcomic.data.filter((item) => item.series === series);

export const selectKeyIssues = createSelector([selectAllHipcomic], (items) =>
    items.filter((item) => item.keyIssue === true)
);

export const selectHipcomicPublishers = createSelector([selectAllHipcomic], (items) =>
    [...new Set(items.map((item) => item.publisherSlug).filter(Boolean))].sort()
);

export const selectHipcomicStats = createSelector([selectAllHipcomic], (items) => ({
    total: items.length,
    totalValue: items.reduce((sum, item) => sum + (item.fmv || 0), 0),
    keyIssues: items.filter((item) => item.keyIssue).length,
    unpriced: items.filter((item) => item.fmv == null).length,
}));

const selectFilteringState = (state) => state.hipcomic.filtering;
const selectSortingState = (state) => state.hipcomic.sorting;

export const selectFilteredHipcomic = createSelector(
    [selectAllHipcomic, selectFilteringState],
    (items, filtering) => {
        const filters = filtering?.filters || {};
        const term = (filtering?.searchTerm || '').trim().toLowerCase();
        let result = items;

        // Apply filters
        if (filters.publisherSlug) {
            result = result.filter((i) => i.publisherSlug === filters.publisherSlug);
        }
        if (filters.keyOnly) {
            result = result.filter((i) => i.keyIssue === true);
        }
        if (filters.minFmv != null) {
            result = result.filter((i) => i.fmv != null && i.fmv >= filters.minFmv);
        }
        if (filters.maxFmv != null) {
            result = result.filter((i) => i.fmv != null && i.fmv <= filters.maxFmv);
        }
        if (filters.minGrade != null) {
            result = result.filter((i) => i.gradeNumeric != null && i.gradeNumeric >= filters.minGrade);
        }

        // Apply search
        if (term) {
            result = result.filter(
                (i) =>
                    i.title?.toLowerCase().includes(term) ||
                    i.series?.toLowerCase().includes(term) ||
                    i.variant?.toLowerCase().includes(term) ||
                    i.publisherSlug?.toLowerCase().includes(term) ||
                    i.hipcomicId?.toLowerCase().includes(term)
            );
        }

        return result;
    }
);

const byIssue = (a, b) =>
    String(a.issue ?? '').localeCompare(String(b.issue ?? ''), undefined, { numeric: true });

export const selectSortedHipcomic = createSelector(
    [selectFilteredHipcomic, selectSortingState],
    (items, sorting) => {
        if (!sorting?.sortBy) return items;

        const { sortBy } = sorting;
        const order = sorting.sortOrder === 'asc' ? 1 : -1;

        return [...items].sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            // Missing values (e.g. no FMV) always sort last, whatever the direction
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            const cmp =
                typeof aVal === 'string'
                    ? aVal.localeCompare(bVal, undefined, { numeric: true })
                    : aVal - bVal;

            // Within a series, keep issues in numeric order
            return (cmp || (sortBy === 'series' ? byIssue(a, b) : 0)) * order;
        });
    }
);

// Export reducer
export default slice;