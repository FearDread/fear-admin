// src/services/myApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const ApiFactory = ( endpoints = (builder) => {}) => {
    const _this = {};
    _this.API_BASE_URL = options.base_url || "http://localhost:4000/fear/api";
    _this.baseQuery = { baseUrl: _this.API_BASE_URL };
        _this.baseApi = createApi({
            reducerPath: entity,
            tagTypes: ["Product", "Order", "User", "Category"],
            baseQuery: fetchBaseQuery(_this.baseQuery),
            endpoints: (builder) => ({
                login: builder.mutation({
                    query: (data) => ({
                        url: `${USERS_URL}/auth`,
                        method: "POST",
                        body: data,
                    }),
                }),
                register: builder.mutation({
                    query: (data) => ({
                        url: `${USERS_URL}`,
                        method: "POST",
                        body: data,
                    }),
                }),
                logout: builder.mutation({
                    query: () => ({
                        url: `${USERS_URL}/logout`,
                        method: "POST",
                    }),
                }),
                profile: builder.mutation({
                    query: (data) => ({
                        url: `${USERS_URL}/profile`,
                        method: "PUT",
                        body: data,
                    }),
                })
            }),
        });

    _this.create = (sliceName) => {
        _this.api = _this.baseApi.injectEndpoints(endpoints);
        console.log('api slice = ', _this.api)
        return _this.api;
    }
    return _this;
}

export default ApiFactory;