// lib/redux/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '@/lib/redux/slices/authSlice';

// In the browser, a relative baseUrl resolves against window.location and
// goes through Next's rewrite proxy (next.config.js) so requests are
// same-origin — that's what avoids CORS and lets the `jwt` cookie ride
// along with credentials: 'include'.
//
// On the server (Server Components, route handlers, or the makeStore()
// dispatches in page.tsx/blog/page.tsx), there is no browser location to
// resolve a relative URL against — Node's fetch throws "Failed to parse
// URL from /fear/api/..." (surfaces as "Invalid URL") for anything that
// isn't absolute. Server-side calls go straight to the Express API instead,
// bypassing the rewrite entirely since nothing here is a real browser
// request that needs same-origin/CORS handling.
const isServer = typeof window === 'undefined';

const SERVER_API_BASE_URL =
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:4000/fear/api';

const baseUrl = isServer ? SERVER_API_BASE_URL : '/fear/api';

const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include', // send/receive the FEAR session cookie on every request
});

// Wraps the base query so any 401 clears client-side auth state instead of
// leaving the UI showing a "logged in" user against a dead session.
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
    tagTypes: ['Product', 'Category', 'Brand', 'Post', 'Cart', 'Auth', 'User', 'Review', 'Wishlist'],
    endpoints: () => ({}),
});