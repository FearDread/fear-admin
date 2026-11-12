import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '@/lib/redux/slices/authSlice';

const isServer = typeof window === 'undefined';

/**
 * Browser: relative URL, so requests go through the Next rewrite (/fear/api/* -> Express)
 * and the httpOnly `jwt` cookie stays first-party.
 */
const BASE_URL = isServer
    ? (process.env.API_INTERNAL_URL ??
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        'http://localhost:4000/fear/api'
    ).replace(/\/+$/, '')
    : '/fear/api';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include', // send/receive the FEAR session cookie on every browser request
    timeout: 10_000, // a stalled proxy now errors instead of hanging hydration forever
});

/**
 * Endpoints that legitimately return 401 for a logged-out visitor or a bad
 * password. A 401 from these must NOT wipe session state: e.g. a late 401 from
 * the initial /auth/session probe would otherwise log out a user who just
 * signed in.
 */
const AUTH_PROBES = [
    '/auth/session',
    '/auth/me',
    '/auth/login',
    '/auth/google',
    '/auth/facebook',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-reset-token',
];

const baseQueryWithAuthHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const url = typeof args === 'string' ? args : args.url;
        const isProbe = AUTH_PROBES.some((p) => url.startsWith(p));

        if (!isProbe && !isServer) {

            try {
                const probe = await rawBaseQuery('/auth/session', api, extraOptions);
                if (probe.error?.status === 401) api.dispatch(logout());
            } catch {
                // A failed probe (network blip, timeout) is inconclusive: keep the session.
            }
        }
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