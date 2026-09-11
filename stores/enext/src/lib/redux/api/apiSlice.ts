import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '@/lib/redux/slices/authSlice';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/fear/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/fear/api',
  credentials: 'include', // send/receive the FEAR session cookie on every request
});

// Wraps the base query so any 401 clears client-side auth state instead of
// leaving the UI showing a "logged in" user against a dead session.
//
// This does NOT attempt token refresh — FEAR API auth is a session cookie,
// not a refresh-token pair, as far as I know. If that assumption is wrong
// (e.g. there's a real /auth/refresh endpoint), this is the place to add a
// refresh-then-retry step before falling back to logout.
const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ['Product', 'Category', 'Brand', 'Cart', 'Auth', 'User'],
  endpoints: () => ({}),
});