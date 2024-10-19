import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cruds } from "@feardread/crud-service";

const productState = {
    product: {},
    products: [],
    error: false,
    success: false,
    loading: false,
};

  
export const getAllProducts = createAsyncThunk(
    "product/get",
    async (data, thunkAPI) => {
      try {
        return await cruds.all('product');
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const getAProduct = createAsyncThunk(
    "product/getAProduct",
    async (id, thunkAPI) => {
      try {
        return await cruds.read('product', id);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  
  export const addToWishlist = createAsyncThunk(
    "product/wishlist",
    async (prodId, thunkAPI) => {
      try {
        return await cruds.wishlist(product);
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

  export const productSlice = createSlice({
    name: "product",
    initialState: productState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAllProducts.pending, (state) => {
          state.loading = true;
        })
        .addCase(getAllProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.error = false;
          state.success = true;
          state.products = action.payload;
        })
        .addCase(getAllProducts.rejected, (state, action) => {
          state.error = true;
          state.loading = false;
          state.success = false;
          state.message = action.error;
        })
        .addCase(addToWishlist.pending, (state) => {
          state.loading = true;
        })
        .addCase(addToWishlist.fulfilled, (state, action) => {
          state.loading = false;
          state.error = false;
          state.success = true;
          state.addToWishlist = action.payload;
          state.message = "Product Added to Wishlist!";
        })
        .addCase(addToWishlist.rejected, (state, action) => {
          state.loading = false;
          state.error = true;
          state.success = false;
          state.message = action.error;
        })
        .addCase(getAProduct.pending, (state) => {
          state.loading = true;
        })
        .addCase(getAProduct.fulfilled, (state, action) => {
          state.loading = false;
          state.error = false;
          state.success = true;
          state.product = action.payload;
          state.message = "Product Fetched Successfully";
        })
        .addCase(getAProduct.rejected, (state, action) => {
          state.error = true;
          state.loading = false;
          state.success = false;
          state.message = action.error;
        })
        .addCase(addRating.pending, (state) => {
          state.loading = true;
        })
        .addCase(addRating.fulfilled, (state, action) => {
          state.loading = false;
          state.error = false;
          state.success = true;
          state.rating = action.payload;
          state.message = "Rating Added Successfully";
          if (state.success) {
            toast.success("Rating Added Successfully");
          }
        })
        .addCase(addRating.rejected, (state, action) => {
          state.error = true;
          state.loading = false;
          state.success = false;
          state.message = action.error;
        });
    },
  });
  
  export default productSlice.reducer;