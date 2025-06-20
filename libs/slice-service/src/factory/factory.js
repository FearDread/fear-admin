import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../api/api";


const factory = ((namespace, endpoint, initialState, data) => {
    const _this = {};

    _this.fetch = createAsyncThunk(`${namespace}/${endpoint}`,
        async (_, { rejectWithValue }) => {

            return await API.get(`${namespace}/${endpoint}`)
                .then((response) => {
                    if (response.data) {
                        return { data: response.data.result, slice: namespace };
                    }
                    return { slice: namespace, data: `No Data for ${namespace}` };
                })
                .catch((error) => {
                    return rejectWithValue(error);
                })
        }
    );

    _this.update = createAsyncThunk(`${namespace}/${endpoint}`,
        async (_, { rejectWithValue }) => {
            
            return API.put(`${namespace}/${endpoint}`, data)
            .then((response) => {
             if (response.data) {
                        return { data: response.data.result, slice: namespace };
                    }
                    return { slice: namespace, data: `No Data for ${namespace}` };
            })
            .catch((error) => {
                return rejectWithValue(error);
            })

            }
        );

    _this.slice = createSlice({
            name: namespace,
            initialState: {
                ...initialState,
                loading: false,
                data: null,
                error: null,
            },
            reducers: {
                clearData: (state) => {
                    state.data = null;
                },
            },
            extraReducers: (builder) => {
                builder
                    .addCase(fetchData.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                    })
                    .addCase(fetchData.fulfilled, (state, action) => {
                        state.loading = false;
                        state.data = action.payload.data;
                    })
                    .addCase(fetchData.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                    });
            },
        }),

    _this.actions = _this.slice.actions;
    _this.reducer = _this.slice.reducer;

    return _this;

})();

export default factory;