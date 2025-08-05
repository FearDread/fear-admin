// src/services/myApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const USERS_URL = "auth"

const ApiFactory = ( sliceName, endpoints = [] ) => {
    const _this = {
        API_BASE_URL: _this.BASE_URL || "http://localhost:4000/fear/api/",
        API_ENDPOINT: sliceName + "/all",
        API_METHOD: 'POST'
    };

    _this.baseQuery = { baseUrl: _this.API_BASE_URL };
    _this.baseApi = createApi({
            reducerPath: sliceName,
            tagTypes: ["Product", "Order", "User", "Category"],
            baseQuery: fetchBaseQuery(_this.baseQuery),
            endpoints: () => ({})
        });

    _this.inject = (func, endpoint, method) => {
        _this.baseApi.injectEndpoints( (builder) => ({
            [func]: builder.mutation({
                query: (data) => ({
                    url: endpoint,
                    body: data,
                    method,
                })
            })
        }))

        return _this.baseApi;
    }

    _this.create = () => {

        return _this.baseApi;
    }

    return _this;
}

export default ApiFactory;