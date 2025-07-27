import { createAsyncThunk } from "@reduxjs/toolkit"
import API from "./api"

// Async Thunk Factory Function
// This factory creates a specific createAsyncThunk for a given 'itemType'
export const ThunkFactory = {

  create: (entity, prefix) => { 

    return (
      createAsyncThunk(

        `${entity}/${prefix}`,

        async ( params, thunkApi ) => {
          let url = `${entity}/${prefix}`;
          console.log('params = ', params);
          if ( prefix == 'one' ) url = `${entity}/${params.id}`

          return API.get(url, (prefix == 'search') ? {params} : {})                           
            
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
          console.log('params = ', data);
          return API.post(`${entity}/${prefix}`, data)
            
            .then((response) => {

              return response.data.result;

            })
            
            .catch((error) => thunkApi.rejectWithValue(error.message) )
        }
      )
    )
  }
}

export default ThunkFactory;
