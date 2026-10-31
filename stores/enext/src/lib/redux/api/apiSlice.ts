import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '@/lib/redux/slices/authSlice';

/**
 * Environment-aware base URL.
 *  - Browser: relative `/fear/api` (goes through the Next rewrite → Express).
 *  - Server (RSC, generateMetadata, sitemap.ts, ISR): Node's fetch needs an
 *    absolute URL. Without this every server-side `store.dispatch(...initiate())`
 *    — product/blog pages, sitemap, JSON-LD — fails with "Invalid URL".
 */
const baseUrl =
  typeof window === 'undefined'
    ? (process.env.INTERNAL_API_BASE_URL ??
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        'http://localhost:4000/fear/api')
    : '/fear/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include', // send/receive the FEAR session cookie on every request
});

// Any 401 clears client-side auth state instead of leaving the UI showing a
// "logged in" user against a dead session. Cookie-session auth: no refresh.
const baseQueryWithAuthHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logout(true));
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: [
    'Product',
    'Category',
    'Brand',
    'Post',
    'Blog',
    'Cart',
    'Auth',
    'User',
    'Review',
    'Wishlist',
    'Order',
    'Address',
    'Payment',
  ],
  endpoints: () => ({}),
});
