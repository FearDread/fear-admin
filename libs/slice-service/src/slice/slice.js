

const slicer = (entity) => {
    const state = {
        [entity]: {},
        isError: false,
        isSuccess: false,
        isLoading: false,
    };

    const slice = createSlice({
        name: entity,
        initialState: state,
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getAllProducts.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(addRating.rejected, (state, action) => {
                    state.isError = true;
                    state.isLoading = false;
                    state.isSuccess = false;
                    state.message = action.error;
                });
        },
    });

    //export default slice.reducer;
}

export default slicer.slice.reducer;
