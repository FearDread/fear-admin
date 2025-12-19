import { ThunkFactory } from "./thunk";
import { StateFactory } from "./state";

/**
 * Common reducer actions that can be dynamically added to any slice
 */
export const createReducers = (entity, adapter) => ({
  // Entity management
  setEntity: (state, action) => {
    state[entity] = action.payload;
    state.error = null;
  },

  clearEntity: (state) => {
    state[entity] = null;
    state.data = [];
  },

  // Data management
  setData: (state, action) => {
    state.data = action.payload;
    state.error = null;
  },

  appendData: (state, action) => {
    state.data = [...state.data, ...action.payload];
  },

  prependData: (state, action) => {
    state.data = [...action.payload, ...state.data];
  },

  updateDataItem: (state, action) => {
    const { id, updates } = action.payload;
    const index = state.data.findIndex(item => item.id === id);
    if (index !== -1) {
      state.data[index] = { ...state.data[index], ...updates };
    }
  },

  removeDataItem: (state, action) => {
    const id = action.payload;
    state.data = state.data.filter(item => item.id !== id);
  },

  // Loading state management
  setLoading: (state, action) => {
    state.loading = action.payload;
  },

  setSuccess: (state, action) => {
    state.success = action.payload;
  },

  setError: (state, action) => {
    state.error = action.payload;
    state.loading = false;
    state.success = false;
  },

  clearError: (state) => {
    state.error = null;
  },

  // Reset operations
  resetState: (state, action) => {
    const namespace = action.payload?.namespace || entity;
    const options = action.payload?.options || {};
    return StateFactory(namespace, options);
  },

  resetData: (state) => {
    state.data = [];
    state[entity] = null;
    state.error = null;
  },

  resetStatus: (state) => {
    state.loading = false;
    state.success = false;
    state.error = null;
  },

  // Pagination reducers (if enabled)
  setPagination: (state, action) => {
    if (state.pagination) {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },

  setCurrentPage: (state, action) => {
    if (state.pagination) {
      state.pagination.currentPage = action.payload;
    }
  },

  setPageSize: (state, action) => {
    if (state.pagination) {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    }
  },

  // Filtering reducers (if enabled)
  setFilters: (state, action) => {
    if (state.filtering) {
      state.filtering.filters = action.payload;
      state.filtering.activeFilters = Object.keys(action.payload).filter(
        key => action.payload[key] !== null && action.payload[key] !== undefined
      );
    }
  },

  clearFilters: (state) => {
    if (state.filtering) {
      state.filtering.filters = {};
      state.filtering.activeFilters = [];
      state.filtering.searchTerm = '';
    }
  },

  setSearchTerm: (state, action) => {
    if (state.filtering) {
      state.filtering.searchTerm = action.payload;
    }
  },

  // Sorting reducers (if enabled)
  setSorting: (state, action) => {
    if (state.sorting) {
      state.sorting.sortBy = action.payload.sortBy;
      state.sorting.sortOrder = action.payload.sortOrder || 'asc';
    }
  },

  toggleSortOrder: (state) => {
    if (state.sorting) {
      state.sorting.sortOrder = state.sorting.sortOrder === 'asc' ? 'desc' : 'asc';
    }
  },

  // Selection reducers (if enabled)
  setSelectedItems: (state, action) => {
    if (state.selection) {
      state.selection.selectedItems = action.payload;
      state.selection.selectedIds = action.payload.map(item => item.id);
    }
  },

  toggleItemSelection: (state, action) => {
    if (state.selection) {
      const id = action.payload;
      const index = state.selection.selectedIds.indexOf(id);

      if (index > -1) {
        state.selection.selectedIds.splice(index, 1);
        state.selection.selectedItems = state.selection.selectedItems.filter(
          item => item.id !== id
        );
      } else {
        const item = state.data.find(item => item.id === id);
        if (item) {
          state.selection.selectedIds.push(id);
          state.selection.selectedItems.push(item);
        }
      }

      state.selection.allSelected =
        state.selection.selectedIds.length === state.data.length && state.data.length > 0;
    }
  },

  selectAll: (state) => {
    if (state.selection) {
      state.selection.selectedItems = [...state.data];
      state.selection.selectedIds = state.data.map(item => item.id);
      state.selection.allSelected = true;
    }
  },

  clearSelection: (state) => {
    if (state.selection) {
      state.selection.selectedItems = [];
      state.selection.selectedIds = [];
      state.selection.allSelected = false;
    }
  },

  // Metadata reducers (if enabled)
  updateMetadata: (state, action) => {
    if (state.metadata) {
      state.metadata = { ...state.metadata, ...action.payload };
    }
  },

  markAsStale: (state) => {
    if (state.metadata) {
      state.metadata.stale = true;
    }
  },

  markAsFresh: (state) => {
    if (state.metadata) {
      state.metadata.stale = false;
      state.metadata.lastFetch = new Date().toISOString();
    }
  },
});

/**
 * Creates standard async thunks with configurable operations
 */
export const createThunks = (entity, operations = {}) => {
  const defaultOperations = {
    fetch: true,
    fetchOne: true,
    search: true,
    create: true,
    update: true,
    patch: true,
    delete: true,
  };

  const config = { ...defaultOperations, ...operations };
  const thunks = {};

  if (config.fetch) {
    thunks.fetch = ThunkFactory.create(entity, 'all');
  }

  if (config.fetchOne) {
    thunks.fetchOne = ThunkFactory.create(entity, 'one');
  }

  if (config.search) {
    thunks.search = ThunkFactory.post(entity, 'search');
  }

  if (config.create) {
    thunks.create = ThunkFactory.post(entity, 'create');
  }

  if (config.update) {
    thunks.update = ThunkFactory.put(entity, 'update');
  }

  if (config.patch) {
    thunks.patch = ThunkFactory.patch(entity, 'patch');
  }

  if (config.delete) {
    thunks.delete = ThunkFactory.delete(entity, 'delete');
  }

  return thunks;
};

/**
 * Adds standard async action handlers to builder with enhanced logic
 */
export const addHandlers = (builder, asyncActions, entity) => {
  Object.entries(asyncActions).forEach(([key, action]) => {
    builder
      .addCase(action.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loadingState = 'pending';

        if (state.async?.operations) {
          state.async.operations[key] = {
            loading: true,
            success: false,
            error: null,
            lastRun: new Date().toISOString(),
          };
        }
        console.log('pending state = ', state);
      })
      .addCase(action.fulfilled, (state, actionPayload) => {
        state.loading = false;
        state.success = true;
        state.loadingState = 'fulfilled';

        // Handle different response structures
        const payload = actionPayload.payload;
        console.log('fulfilled state = ', state);
        console.log('loading state = false (success)', payload);
        // Update data based on operation type
        if (key === 'fetch' || key === 'search') {
          state.data = Array.isArray(payload) ? payload : (payload?.data || []);
        } else if (key === 'fetchOne') {
          state[entity] = Array.isArray(payload) ? payload[0] : payload;
        } else if (key === 'create') {
          if (Array.isArray(state.data)) {
            state.data.push(payload);
          }
        } else if (key === 'update' || key === 'patch') {
          if (Array.isArray(state.data)) {
            const index = state.data.findIndex(item => item.id === payload.id);
            if (index !== -1) {
              state.data[index] = payload;
            }
          }
          if (state[entity]?.id === payload.id) {
            state[entity] = payload;
          }
        } else if (key === 'delete') {
          if (Array.isArray(state.data)) {
            state.data = state.data.filter(item => item.id !== actionPayload.meta.arg?.id);
          }
        }

        // Update metadata
        if (state.metadata) {
          state.metadata.lastUpdate = new Date().toISOString();
          state.metadata.stale = false;
          if (key === 'fetch' || key === 'fetchOne' || key === 'search') {
            state.metadata.lastFetch = new Date().toISOString();
          }
        }

        // Update async operations tracking
        if (state.async?.operations) {
          state.async.operations[key] = {
            loading: false,
            success: true,
            error: null,
            lastRun: new Date().toISOString(),
          };
        }
        console.log('fully fulfilled state :: ', state);
      })
      .addCase(action.rejected, (state, actionPayload) => {
        state.loading = false;
        state.success = false;
        state.error = actionPayload.error?.message || actionPayload.payload || 'An error occurred';
        state.loadingState = 'rejected';

        if (state.async?.operations) {
          state.async.operations[key] = {
            loading: false,
            success: false,
            error: state.error,
            lastRun: new Date().toISOString(),
          };
        }
        console.log('Rejected state = ', state);
      });
  });
};


export const UtilsFactory = {
    createReducers,
    createThunks,
    addHandlers
}

export default UtilsFactory;