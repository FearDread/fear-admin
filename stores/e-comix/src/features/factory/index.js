import { createSlice, createEntityAdapter, combineReducers } from '@reduxjs/toolkit';
import ThunkFactory from './thunk';
import StateFactory from "./state";
//import ApiFactory from './service';


export function FeatureFactory(entity, reducers = {}, endpoints = null) {

    const _this = {
        entity,
        reducers,
        //api: ApiFactory,
        thunk: ThunkFactory,
        state: StateFactory,
        adapter: createEntityAdapter(),
    
    manager: (initialReducers) => {
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
    },
    inject: (source, dest) => {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                dest[prop] = source[prop];
            }
        }
        return dest;
    },
    create: (options = { service: null, initialState: null }) => {
        const { service, initialState } = options;
        const sliceName = _this.entity;
        const standard = {
            fetch: _this.thunk.create(sliceName, 'all'),
            fetchOne: _this.thunk.create(sliceName, 'one'),
            search: _this.thunk.create(sliceName, 'search')
        }

        const factorySlice = createSlice({
            name: sliceName,
            initialState: StateFactory(sliceName),
            reducers: _this.reducers,
            extraReducers: (builder) => {
                Object.keys(standard).forEach(key => {
                    builder
                        .addCase(standard[key].pending, (state) => {
                            state.loading = true;
                            state.error = null;
                        })
                        .addCase(standard[key].fulfilled, (state, action) => {
                            state.loading = false;
                            state.success = true;
                            state.data = action.payload;
                            state[sliceName] = action.payload[0];
                            if (key == 'fetchOne') {
                                state[sliceName] = action.payload[0];
                            }
                        })
                        .addCase(standard[key].rejected, (state, action) => {
                            state.loading = false;
                            state.success = false;
                            state.error = action.error;
                        });
                })
                if (service) {
                    Object.keys(service).forEach(key => {
                        if (service[key] != standard[key]) {
                        builder
                            .addCase(service[key].pending, (state) => {
                                state.loading = true;
                                state.error = null;
                            })
                            .addCase(service[key].fulfilled, (state, action) => {
                                state.loading = false;
                                state.success = true;
                                state.data = action.payload;
                                state[sliceName] = action.payload[0]
                            })
                            .addCase(service[key].rejected, (state, action) => {
                                state.loading = false;
                                state.success = false;
                                state.error = action.payload;
                            });
                        }
                    }) 
                }}
            }
        )
    
        const asyncActions = _this.inject(standard, (service) ? service : {});

        return {
            slice: factorySlice,
            asyncActions
        };
    }}

    return _this;
}

export default FeatureFactory;