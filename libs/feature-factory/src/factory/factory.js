import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../api/api.js";

const StateFactory = (entity, data = null) => ({
    [entity]: data,
    loading: false,
    success: false,
    error: null
});

const FeatureFactory = (name, endpoint, options = {}) => {
    const { initialData, service } = options;
    const apiurl = `${name}/${endpoint}`;

    const fetch = createAsyncThunk(
        apiurl,
        async (_, { rejectWithValue }) => {
            return await API.get(apiurl)
                .then((response) => {
                    if (response.data && response.data.success) {
                        return response.data.result;
                    }
                })
                .catch((error) => {
                    return rejectWithValue('Error :: ', error);
                })
        }
    )  

    const fetchOne = async (id) => {
        return createAsyncThunk(
        `${name}/${id}`,
        async (_, { rejectWithValue }) => {
            return await API.get(`${name}/${id}`)
                .then((response) => {
                    if (response.data && response.data.success) {
                        return response.data.result;
                    }
                })
                .catch((error) => {
                    return rejectWithValue('Error :: ', error);
                })
            }
        )
    }

    const search = async (query) => {
        return createAsyncThunk(
        `${name}/search?${query}`,
        async (_, { rejectWithValue }) => {
            return await API.get(`${name}/search?${query}`)
                .then((response) => {
                    if (response.data && response.data.success) {
                        return response.data.result;
                    }
                })
                .catch((error) => {
                    return rejectWithValue('Error :: ', error);
                })
            }
        )
    }

    const slice = createSlice({
        name,
        initialState: StateFactory(name, initialData),
        reducers: {
            clearData: (state) => {
                state[name] = null;
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
                    state[name] = action.payload;
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
                    state[name] = action.payload;
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
                    state[name] = action.payload;
                })
                .addCase(search.rejected, (state, action) => {
                    state.error = action.error;
                    state.loading = false;
                    state.success = false;
                })
        }
    })

    return {
        API,
        reducer: slice.reducer,
        actions: slice.actions,
        asyncActions: {
            fetch,
            fetchOne,
            search,
            services: (service) ? service : {}
        },

    }

}

export default FeatureFactory;