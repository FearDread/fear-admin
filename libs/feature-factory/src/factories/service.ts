// src/services/myApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const USERS_URL = "auth"

const ApiFactory = ( sliceName ) => {
    const _this = {};
    _this.API_BASE_URL = _this.base_url || "http://localhost:4000/fear/api/";
    _this.baseQuery = { baseUrl: _this.API_BASE_URL };
        
    _this.baseApi = createApi({
            reducerPath: sliceName,
            tagTypes: ["Product", "Order", "User", "Category"],
            baseQuery: fetchBaseQuery(_this.baseQuery),
            endpoints: () => ({})
        });

    _this.create = (routes) => {
        const endpoints = (routes) ? routes : () => ({});
        console.log('routes = ', routes);
        const api = _this.baseApi.injectEndpoints((builder) => (routes));

        return api;
    }

    return _this;
}

export default ApiFactory;