import { createAsyncThunk } from "@reduxjs/toolkit"
import API from "./api"
import axios from "axios";

// Async Thunk Factory Function
// This factory creates a specific createAsyncThunk for a given 'itemType'
const ThunkFactory = {
  create: (entity, prefix) => {
    //consolelog('api - ', API.get())
    return (
      // Return type of the payload creator
      // Type of the first argument to the payload creator (e.g., itemId)
      // Type of the thunkAPI.rejectWithValue argument
      createAsyncThunk(
        // Action type prefix
        `${entity}/all`,
        async (id = 'all', { rejectWithValue }) => {
          try {

            const response = await API.get(`${entity}/${id}`)
            console.log('resp = ', response);
            return response.data.result;

          } catch (error) {
            return rejectWithValue(error.message);
          }
        }
      )
    )
  }
}

export default ThunkFactory;
