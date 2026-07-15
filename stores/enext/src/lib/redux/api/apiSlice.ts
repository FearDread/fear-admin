import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '/api',
    prepareHeaders: (headers) => {
      // e.g. attach auth token from cookie/localStorage if needed
      // headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Post', 'User'], // add tags per resource
  endpoints: () => ({}),
});