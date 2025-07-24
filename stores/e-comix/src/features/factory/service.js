// src/services/myApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const USERS_URL = "auth"

const ApiFactory = ( sliceName, endpoints = (builder) => {}) => {
    const _this = {};
    _this.API_BASE_URL = _this.base_url || "http://localhost:4000/fear/api/";
    _this.baseQuery = { baseUrl: _this.API_BASE_URL };
        
    _this.baseApi = createApi({
            reducerPath: sliceName,
            tagTypes: ["Product", "Order", "User", "Category"],
            baseQuery: fetchBaseQuery(_this.baseQuery),
            endpoints: (builder) => ({
                login: builder.mutation({
                    query: (data) => ({
                        url: `${USERS_URL}/login`,
                        method: "POST",
                        body: data,
                    }),
                }),
                register: builder.mutation({
                    query: (data) => ({
                        url: `${USERS_URL}/register`,
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

    _this.create = () => {
        return _this.baseApi;
    }

    return _this;
}

export default ApiFactory;