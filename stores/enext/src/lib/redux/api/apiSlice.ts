import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/fear/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // fetchBaseQuery already sets Content-Type: application/json itself
    // whenever a request actually has a body. Setting it unconditionally
    // here — including on plain GETs — forces the browser to send a CORS
    // preflight (OPTIONS) for every request, since application/json isn't
    // a CORS "simple" content type. That's almost certainly what's
    // triggering the preflight failure.
    prepareHeaders: (headers) => {
      // e.g. attach an auth token once authSlice carries one:
      // const token = (getState() as RootState).auth.token;
      // if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category'],
  endpoints: () => ({}),
});