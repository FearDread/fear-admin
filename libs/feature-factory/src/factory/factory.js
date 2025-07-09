import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../api/api.js";

/**
 * Creates object state instance.
 * @param {string} entity - The namespace of the state 
 * @param {object} [data={}] - Optional default data.
 * @returns {object} An object containing state data
 */
const StateFactory = (entity, data = null) => ({
    [entity]: data,
    loading: false,
    success: false,
    error: null
});

/**
 * Creates and configures an Axios instance.
 * @param {string} baseURL - The base URL for API requests.
 * @param {object} [headers={}] - Optional default headers for requests.
 * @returns {object} An object containing configured Axios methods (get, post, put, delete).
 */
const FeatureFactory = (sliceName, endpoint, options = {
    service: null,
    initialState: []
}) => {
    
    let apiEndpoint = `${sliceName}/${endpoint}`;

    const fetch = createAsyncThunk(
        apiEndpoint,
        async (params, { rejectWithValue }) => {
            try {
                if (params) {
                    console.log('params = ', params);
                    if (params.id) {
                        apiEndpoint = `${sliceName}/${params.id}`;
                    } else if (params.query) {
                        apiEndpoint = `${sliceName}/search?${query}`
                    }
                }
                const response = await API.get(apiEndpoint);
                return response.data.result;

            } catch (error) {
                return rejectWithValue('Error :: ', error.message);
            }

        }
    );

    const slice = createSlice({
        name: sliceName,
        initialState: StateFactory(sliceName, options.initialState),
        reducers: {},
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
        }
    })
    console.log('Factory Slice = ', slice);

    return {
        slice,
        fetch,
        reducer: slice.reducer,
        actions: slice.actions,
        service: options.service
    }
}

export default FeatureFactory;