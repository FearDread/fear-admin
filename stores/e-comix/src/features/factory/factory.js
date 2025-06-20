import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../api";

const StateFactory = (entity, data = null) => ({
    [entity]: data,
    loading: false,
    success: false,
    error: null
});
const FeatureFactory = (name, endpoint, options = {}) => {
    const { initialData, transform } = options;
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
    );  

    const fetchOne = (id) => {
        return createAsyncThunk(
        `${name}/${id}`,
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
    };

    const search = (query) => {
        return createAsyncThunk(
        `${name}/?${query}`,
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
    }

    const slice = createSlice({
        name,
        initialState: StateFactory(name, initialData),
        reducers: {},
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
        }
    })

    return {
        reducer: slice.reducer,
        actions: slice.actions,
        asyncActions: {
            fetch,
            fetchOne,
            search
        }
    }

}

export default FeatureFactory;