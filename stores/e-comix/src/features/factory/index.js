import { createSlice, createEntityAdapter, combineReducers } from '@reduxjs/toolkit';
import ThunkFactory from './thunk';

export const stateGenerator = (namespace, data = null) => ({
    [namespace]: data,
    loading: false,
    success: false,
    error: null
});

export function FeatureFactory(entity, reducers = {
    fetchStart: (state) => {
        state.loading = true;
        state.error = null;
    },
    fetchSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
    },
    fetchFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    searchStart: (state) => {
        state.loading = true;
        state.error = null;
    },
    searchSuccess: (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
    },
    searchFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
}) {
    
    const factory = {
        entity,
        reducers,
        state: stateGenerator(entity, []) ,
        adapter: createEntityAdapter() 
    };
    
    factory.manager = (initialReducers) => {
        const reducers = { ...initialReducers };
        let combinedReducer = combineReducers(reducers);

        return {
            reduce: (state, action) => combinedReducer(state, action),
            add: (key, reducer) => {
                if (!key || reducers[key]) return;
                reducers[key] = reducer;
                combinedReducer = combineReducers(reducers);
            },
            remove: (key) => {
                if (!key || !reducers[key]) return;
                delete reducers[key];
                combinedReducer = combineReducers(reducers);
            },
            getReducerMap: () => reducers,
        };
    }

    factory.inject = (source, dest) => {
        for( var prop in source ) {
            if(source.hasOwnProperty(prop)) {
                dest[prop] = source[prop];
             }
        }
        return dest;
    }



    factory.create = (options = {service: null, initialState: {}}) => {
        const { service, initialState } = options;
        const sliceName = factory.entity;

        const fetch = ThunkFactory.create(sliceName, 'all');
        const search = ThunkFactory.create(sliceName, 'search');

        const apiSlice = createSlice({
            name: sliceName,
            initialState: {
                data: {},
                loading: false,
                success: false,
                error: null
            },
            reducers: factory.reducers,
            extraReducers: (builder) => {
                builder
                .addCase(fetch.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetch.fulfilled, (state, action) => {
                    console.log('action = ', action);
                    state.loading = false;
                    state.success = true;
                    state.data = action.payload;
                })
                .addCase(fetch.rejected, (state, action) => {
                    state.error = action.error;
                    state.loading = false;
                    state.success = false;
                })
                .addCase(search.pending, (state) => {
                    state.loading = true;
                })
                .addCase(search.fulfilled, (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = action.payload;
                })
                .addCase(search.rejected, (state, action) => {
                    state.error = action.error;
                    state.loading = false;
                    state.success = false;
                })

        }});

        const { fetchStart, fetchSuccess, fetchFailure } = apiSlice.actions;
        //apiSlice.search = search;
        //apiSlice.fetch = fetch;
        const asyncActions = { fetch, search };
        
        if (options.service) {
            factory.inject(options.service, asyncActions);
        }
        
        console.log('slice = ', apiSlice);
        return {
            slice: apiSlice,
            asyncActions
        };
    }

    return factory; 
}

export default FeatureFactory;