import { createSlice, createAsyncThunk, createEntityAdapter, combineReducers } from '@reduxjs/toolkit';
import API from "./api.js";

export const stateGenerator = (namespace, data = null) => ({
    [namespace]: data,
    loading: false,
    success: false,
    error: null
});

export function FeatureFactory(entity, reducers = {}) {
    
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

    factory.slicer = (endpoint, options = {service: null, initialState: null}) => {

        const sliceName = factory.entity;
        const apiEndpoint = `${sliceName}/${endpoint}`;

        const fetch = createAsyncThunk(
            `${sliceName}/all`,
            async (_, { dispatch, rejectWithValue }) => {

                dispatch(fetchStart());

                try {
                    const response = await API.get(apiEndpoint);
                    return response.data.result;
                    if (response.success) {

                        dispatch(fetchSuccess(response.data.result));

                    }
                    console.log('Failed to fetch :', response);
                    dispatch(fetchFailure(response));
                } catch (error) {
                    if (error instanceof Error) {
                        dispatch(fetchFailure(error.message));
                    }
                    return rejectWithValue(error)
                }
            }
        )
        const fetchOne = createAsyncThunk(
            `${sliceName}/one`,
            async ({ id }, { dispatch, rejectWithValue }) => {
                try {
                    const response = await API.get(`${sliceName}/${id}`)
                    if (response.success) {
                        dispatch(fetchSuccess(response.data.result));
                    }
                    console.log('Failed to fetch one :', response);
                    dispatch(fetchFailure(response));

                } catch (error) {
                    if (error instanceof Error) {
                        dispatch(fetchFailure(error.message));
                    }
                    return rejectWithValue(error);
                }
            }
        )
        const search = createAsyncThunk(
            `${sliceName}/search`,
            async ({ query = '' }, { dispatch, rejectWithValue }) => {
                try {
                    const response = API.get(`${sliceName}?search=${query}`)
                    if (response.success) {
                        dispatch(fetchSuccess(response.data.result));
                    }
                    console.log('Failed to search :', response);
                    dispatch(fetchFailure(response));
                } catch (error) {
                    return rejectWithValue(error);
                }
            }
        )

        const apiSlice = createSlice({
            name: sliceName,
            initialState: {
                [sliceName]: options.initialState || {},
                loading: false,
                success: false,
                error: null
            },
            reducers: {
                fetchStart: (state) => {
                    state.loading = true;
                    state.error = null;
                },
                fetchSuccess: (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state[sliceName] = action.payload;
                },
                fetchFailure: (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            },
            extraReducers: (builder) => {
            builder
                .addCase(fetch.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetch.fulfilled, (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state[sliceName] = action.payload;
                })
                .addCase(fetch.rejected, (state, action) => {
                    state.error = action.error;
                    state.loading = false;
                    state.success = false;
                })
        }});

        const { fetchStart, fetchSuccess, fetchFailure } = apiSlice.actions;

        const sliceObj = {
            slice: apiSlice,
            asyncActions: {
                search,
                fetch,
                fetchOne,
            }
        };

        if (options.service) {
            factory.inject(options.service, sliceObj.asyncActions );
        }

        console.log('slice = ', sliceObj);
        return sliceObj;
    }

    return factory;
}

export default FeatureFactory;