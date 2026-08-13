import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/fear/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/fear/api',
    prepareHeaders: (headers) => {
      // e.g. attach an auth token once authSlice carries one:
      //const token = (getState() as RootState).auth.token;
      //if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category'],
  endpoints: () => ({}),
});