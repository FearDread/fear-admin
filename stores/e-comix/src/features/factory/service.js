// src/services/myApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const ApiFactory = (entity, options = {}) => {

    const baseApi = createApi({
        reducerPath: entity,
        baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/fear/api/' }),
        endpoints: () => ({}), // Initially empty
    });

    const entityApi = baseApi.injectEndpoints({
        endpoints: (builder) => ({
            fetch: builder.query({
                query: () => entity,
            })
        }),
    });

    return entityApi;
        
}

export default ApiFactory;