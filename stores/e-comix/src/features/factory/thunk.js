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

        async ( params, thunkApi ) => {
          console.log('params = ', params);
          return API.get(`${entity}/${prefix}`, params)
            
            .then((response) => response.data.result )
            
            .catch((error) => thunkApi.rejectWithValue(error.message) )
        }
      )
    )
  },
  post: (entity, prefix) => {
    return ( 
      createAsyncThunk(
        
        `${entity}/${prefix}`,

        async ( data, thunkApi ) => {

          return API.post(`${entity}/${prefix}`, data)
            
            .then((response) => response.data )
            
            .catch((error) => thunkApi.rejectWithValue(error.message) )
        }
      )
    )
  }
}

export default ThunkFactory;
