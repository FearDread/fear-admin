import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import InstanceFactory from "../api/factory.js";

const StateFactory = (entity, data = null) => ({
    [entity]: data,
    loading: false,
    success: false,
    error: null
});

const FeatureFactory = (sliceName, endpoint, options = {}) => {
    const apiEndpoint = `${sliceName}/${endpoint}`;
    const API = (options.instance) ? options.instance : InstanceFactory('http://localhost:4000/fear/api');

    const fetch = createAsyncThunk(
        apiEndpoint,
        async (_, { rejectWithValue }) => {
            return await API.get(apiEndpoint)
                .then((response) => {
                    if (response.data && response.data.success) {
                        return response.data.result;
                    }
                    return response.data;
                })
                .catch((error) => {
                    return rejectWithValue('Error :: ', error.message);
                })
        }
    );

    const fetchOne = createAsyncThunk(
        `${sliceName}/one`,
        async (id, { rejectWithValue }) => {
            return await API.get(`${sliceName}/${id}`)
                .then((response) => {
                    if (response.data && response.data.success) {
                        return response.data.result;
                    }
                })
                .catch((error) => {
                    return rejectWithValue('Error :: ', error);
                })
        }
    );

    const search = createAsyncThunk(
        `${sliceName}/search`,
        async (query, { rejectWithValue }) => {
            return await API.get(`${sliceName}/search?${query}`)
                .then((response) => {
                    if (response.data && response.data.success) {
                        return response.data.result;
                    }
                })
                .catch((error) => {
                    return rejectWithValue('Error :: ', error.message);
                })
        }
    );

    const slice = createSlice({
        name: sliceName,
        initialState: StateFactory(sliceName),
        reducers: {
            clearData: (state) => {
                state[sliceName] = null;
            }
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
                .addCase(fetchOne.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchOne.fulfilled, (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state[sliceName] = action.payload;
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
                    state[sliceName] = action.payload;
                })
                .addCase(search.rejected, (state, action) => {
                    state.error = action.error;
                    state.loading = false;
                    state.success = false;
                })
        }
    })

    return {
        reducer: slice.reducer,
        actions: slice.actions,
        asyncActions: {
            fetch,
            fetchOne,
            search,
            service: (options.service) ? options.service : null
        },

    }

}

export default FeatureFactory;