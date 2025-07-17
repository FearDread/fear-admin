import { createAsyncThunk } from "@reduxjs/toolkit"
import API from "./api"

// Async Thunk Factory Function
// This factory creates a specific createAsyncThunk for a given 'itemType'
export const ThunkFactory = {
  create: (entity, prefix) => {
    prefix = (prefix) ? prefix : 'all'
    
    return (
      createAsyncThunk(

        `${entity}/${prefix}`,

        async (id = prefix, { rejectWithValue }) => {

          return API.get(`${entity}/${id}`)
            
            .then((response) => response.data.result )
            
            .catch((error) => rejectWithValue(error.message) )
        }
      )
    )
  }
}

export default ThunkFactory;
