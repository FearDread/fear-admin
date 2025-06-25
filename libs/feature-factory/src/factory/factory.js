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
    const apiInstance = InstanceFactory({
        API_BASE_URL: 'http://fear.master.com:4000/fear/api',
        JWT_TOKEN: 'fear-x-token'
    });

    const fetch = createAsyncThunk(
        apiEndpoint,
        async (_, { rejectWithValue }) => {
            return await apiInstance.get(apiEndpoint)
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
            return await apiInstance.get(`${sliceName}/${id}`)
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
            return await apiInstance.get(`${sliceName}/search?${query}`)
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
        sliceName,
        initialState: StateFactory(sliceName, initialData),
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
        instance: apiInstance,
        asyncActions: {
            fetch,
            fetchOne,
            search,
            service: (options.service) ? options.service : null
        },

    }

}

export default FeatureFactory;