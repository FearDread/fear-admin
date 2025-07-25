import { createSlice, createEntityAdapter, combineReducers } from '@reduxjs/toolkit';
import ThunkFactory from './thunk';
//import ApiFactory from './service';

export const StateFactory = (namespace) => ({
    [namespace]: {},
    data: [],
    loading: false,
    success: false,
    error: null
});

export function FeatureFactory(entity, reducers = {}, endpoints = null) {

    const factory = {
        entity,
        reducers,
        //api: ApiFactory,
        thunk: ThunkFactory,
        state: StateFactory,
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

    factory.create = (options = {service: null, initialState: null}) => {
        const { service, initialState } = options;
        const sliceName = factory.entity;

        const fetch = factory.thunk.create(sliceName, 'all');
        const fetchOne = factory.thunk.create(sliceName, 'one');
        const search = factory.thunk.create(sliceName, 'search');

        const factorySlice = createSlice({
            name: sliceName,
            initialState: StateFactory(sliceName),
            reducers: factory.reducers,
            extraReducers: (builder) => {
                builder
                .addCase(fetch.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetch.fulfilled, (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.data = action.payload;
                })
                .addCase(fetch.rejected, (state, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = action.error;
                })
                .addCase(fetchOne.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchOne.fulfilled, (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state[sliceName] = action.payload[0];
                })
                .addCase(fetchOne.rejected, (state, action) => {
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

        const asyncActions = factory.inject({ fetch, fetchOne, search }, (service) ? service : {});

        return {
            slice: factorySlice,
            asyncActions
        };
    }
    
    console.log('factory :: ', factory);
    return factory; 
}

export default FeatureFactory;