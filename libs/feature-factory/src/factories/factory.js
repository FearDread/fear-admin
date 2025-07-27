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
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                dest[prop] = source[prop];
            }
        }
        return dest;
    }

    factory.create = (options = { service: null, initialState: null }) => {
        const { service, initialState } = options;
        const sliceName = factory.entity;
        const standard = {
            fetch: factory.thunk.create(sliceName, 'all'),
            fetchOne: factory.thunk.create(sliceName, 'one'),
            search: factory.thunk.create(sliceName, 'search')
        }

        const factorySlice = createSlice({
            name: sliceName,
            initialState: StateFactory(sliceName),
            reducers: factory.reducers,
            extraReducers: (builder) => {
                Object.key(standard).forEach( key => {
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
                                if (act == 'fetchOne') {
                                    state[sliceName] = action.payload[0];
                                }
                            })
                            .addCase(standard[key].rejected, (state, action) => {
                                state.loading = false;
                                state.success = false;
                                state.error = action.error;
                            });
                })
                /*
                for (var act in standard) {
                    if (standard.hasOwnProperty(act)) {
                        builder
                            .addCase(standard[act].pending, (state) => {
                                state.loading = true;
                                state.error = null;
                            })
                            .addCase(standard[act].fulfilled, (state, action) => {
                                state.loading = false;
                                state.success = true;
                                state.data = action.payload;
                                state[sliceName] = action.payload[0];
                                if (act == 'fetchOne') {
                                    state[sliceName] = action.payload[0];
                                }
                            })
                            .addCase(standard[act].rejected, (state, action) => {
                                state.loading = false;
                                state.success = false;
                                state.error = action.error;
                            });
                    }
                }
                                            */
                if (service) {
                    for (var key in service) {
                        if (service.hasOwnProperty(key) && !standard.hasOwnProperty(key)) {
                            builder
                                .addCase(service[key].pending, (state) => {
                                    state.loading = true;
                                    state.error = null;
                                })
                                .addCase(service[key].fulfilled, (state, action) => {
                                    state.loading = false;
                                    state.success = true;
                                    state.data = action.payload;
                                    console.log('action fulfilled :', state.data);
                                })
                                .addCase(service[key].rejected, (state, action) => {
                                    state.loading = false;
                                    state.success = false;
                                    state.error = action.payload;
                                });
                        }
                    }

                }
            }
        });

        const asyncActions = factory.inject(standard, (service) ? service : {});
        console.log('async = ', asyncActions);
        return {
            slice: factorySlice,
            asyncActions
        };
    }
    return factory;
}

export default FeatureFactory;