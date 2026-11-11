/**
 * lib/redux/api/authApi.ts
 *
 * Auth + current-user endpoints, injected into the shared apiSlice.
 * Cookie-session (httpOnly `jwt`) auth: the client never touches the token.
 *
 * Routes match backend/routes/auth.js:
 *   POST /auth/login, /auth/register, /auth/google, /auth/logout
 *   GET  /auth/session, /auth/me
 *   PUT  /auth/update-profile, /auth/update-password
 *   POST /auth/forgot-password, /auth/reset-password/:token
 *   GET  /auth/verify-reset-token/:token
 *
 * Envelope handling: the backend isn't consistent (`{ result }` in some
 * controllers, `{ data }` in others), so every response goes through
 * `unwrap` / `extractUser`, which tolerate both.
 */
import { useAppSelector } from '@/lib/redux/hooks';
import { apiSlice } from '@/lib/redux/api/apiSlice';
import {
    setCurrentUser,
    setIsAuthenticated,
    setAuthError,
    setHydrating,
    resetAuthState,
    selectCurrentUser,
} from '../slices/authSlice';
import type { User } from '@/types/user';

export interface CurrentUser {
    _id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
    phone?: string;
    country?: string;
    avatar?: { secure_url?: string };
    createdAt?: string;
    lastLoginAt?: string;
    orderCount?: number;
    wishlistCount?: number;
    addressCount?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
}

export interface GoogleLoginRequest {
    /** ID token / credential JWT returned by @react-oauth/google's GoogleLogin */
    credential: string;
}

export interface FacebookLoginRequest {
    accessToken: string;
    userID: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface UpdateProfileInput {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
}

export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

interface AuthResponse {
    user: User | null;
}

interface MessageResponse {
    message: string;
}

interface VerifyResetTokenResponse {
    valid: boolean;
}

/* ── Response helpers ─────────────────────────────────────────────────── */

/** Pull the payload out of `{ result }` or `{ data }` envelopes. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrap = (r: any): any => r?.result ?? r?.data ?? null;

/**
 * The user may be at `payload.user` or be the payload itself
 * (e.g. `{ data: { _id, email, ... } }`). Returns null if neither.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractUser = (r: any): any => {
    const payload = unwrap(r);
    if (!payload) return null;
    return payload.user ?? (payload._id || payload.id || payload.email ? payload : null);
};

/** Auth-style responses: always `{ user }`, never throws on odd shapes. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toAuthResponse = (r: any): AuthResponse => ({ user: extractUser(r) });

/** Message-only endpoints: `{ message }`, `{ result: { message } }` or `{ data: { message } }`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toMessage = (r: any): MessageResponse => ({
    message: r?.message ?? r?.result?.message ?? r?.data?.message ?? '',
});

/** Shared onQueryStarted body for login / google / facebook. */
const makeLoginHandler =
    (fallbackError: string) =>
        async (
            _arg: unknown,
            {
                dispatch,
                queryFulfilled,
            }: {
                dispatch: (a: any) => any;
                queryFulfilled: Promise<{ data: AuthResponse }>;
            },
        ) => {
            dispatch(setAuthError(null));
            try {
                const { data } = await queryFulfilled;
                const user = data?.user ?? null;
                if (!user) {
                    dispatch(setAuthError('Signed in, but the server returned no user.'));
                    return;
                }
                dispatch(setCurrentUser(user));
                dispatch(setIsAuthenticated(true));
            } catch (err: any) {
                dispatch(setAuthError(err?.error?.data?.message || fallbackError));
            }
        };

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
            transformResponse: toAuthResponse,
            onQueryStarted: makeLoginHandler('Invalid email or password'),
            // Refetch /auth/me and the (now user-scoped) cart after login.
            invalidatesTags: ['Cart', { type: 'User', id: 'CURRENT' }],
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
            transformResponse: toAuthResponse,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                dispatch(setAuthError(null));
                try {
                    await queryFulfilled;
                    // Intentionally NOT authenticating here — redirect to /login instead.
                } catch (err: any) {
                    dispatch(setAuthError(err?.error?.data?.message || 'Registration failed'));
                }
            },
        }),

        googleLogin: builder.mutation<AuthResponse, GoogleLoginRequest>({
            query: (body) => ({ url: '/auth/google', method: 'POST', body }),
            transformResponse: toAuthResponse,
            onQueryStarted: makeLoginHandler('Google sign-in failed'),
            invalidatesTags: ['Cart', { type: 'User', id: 'CURRENT' }],
        }),

        facebookLogin: builder.mutation<AuthResponse, FacebookLoginRequest>({
            query: (body) => ({ url: '/auth/facebook', method: 'POST', body }),
            transformResponse: toAuthResponse,
            onQueryStarted: makeLoginHandler('Facebook sign-in failed'),
            invalidatesTags: ['Cart', { type: 'User', id: 'CURRENT' }],
        }),

        // ── Account recovery ────────────────────────────────────────────────
        forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
            query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
            transformResponse: toMessage,
        }),

        verifyResetToken: builder.query<VerifyResetTokenResponse, string>({
            query: (token) => `/auth/verify-reset-token/${encodeURIComponent(token)}`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transformResponse: (r: any): VerifyResetTokenResponse => ({
                valid: r?.valid ?? r?.result?.valid ?? r?.data?.valid ?? true,
            }),
            keepUnusedDataFor: 0,
        }),

        resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
            query: ({ token, password }) => ({
                url: `/auth/reset-password/${encodeURIComponent(token)}`,
                method: 'POST',
                body: { password },
            }),
            transformResponse: toMessage,
        }),

        logout: builder.mutation<void, void>({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    // resetAuthState restores isHydrating: true, but no hydrator will
                    // re-run, so flip it off to avoid anything waiting on it forever.
                    dispatch(resetAuthState());
                    dispatch(setHydrating(false));
                    dispatch(apiSlice.util.resetApiState());
                }
            },
        }),

        // ── Profile ─────────────────────────────────────────────────────────
        updateProfile: builder.mutation<CurrentUser, UpdateProfileInput>({
            query: (body) => ({ url: '/auth/update-profile', method: 'PUT', body }),
            transformResponse: (r: unknown) => extractUser(r) as CurrentUser,
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        changePassword: builder.mutation<{ success: boolean; message?: string }, ChangePasswordInput>({
            query: (body) => ({ url: '/auth/update-password', method: 'PUT', body }),
        }),

        getCurrentUser: builder.query<CurrentUser | null, void>({
            query: () => '/auth/me',
            transformResponse: (r: unknown) => (extractUser(r) as CurrentUser | null) ?? null,
            providesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        /** Hydrates session state on app load — see StoreProvider's AuthHydrator. */
        getSession: builder.query<AuthResponse, void>({
            query: () => '/auth/session',
            transformResponse: toAuthResponse,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const user = data?.user ?? null;
                    dispatch(setCurrentUser(user));
                    dispatch(setIsAuthenticated(Boolean(user)));
                } catch {
                    // 401 for a logged-out visitor is expected, not an error state.
                    dispatch(setCurrentUser(null));
                    dispatch(setIsAuthenticated(false));
                } finally {
                    dispatch(setHydrating(false));
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGoogleLoginMutation,
    useFacebookLoginMutation,
    useForgotPasswordMutation,
    useVerifyResetTokenQuery,
    useResetPasswordMutation,
    useLogoutMutation,
    useGetSessionQuery,
    useLazyGetSessionQuery,
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = authApi;

/**
 * useCurrentUser() — kept because the account views import it. Prefers the
 * live /auth/me result and falls back to the Redux user (set by login /
 * getSession), so a slow or failed /me can't strand the UI on a spinner.
 *
 * `loading` is true only while we genuinely have no user AND /me is still
 * in flight for the first time.
 */
export function useCurrentUser() {
    const reduxUser = useAppSelector(selectCurrentUser);
    const { data, isLoading } = useGetCurrentUserQuery();

    const currentUser = (data ?? reduxUser ?? null) as CurrentUser | null;

    return {
        currentUser,
        isAuthenticated: Boolean(currentUser),
        loading: isLoading && !reduxUser,
        lastLoginAt: currentUser?.lastLoginAt ?? null,
    };
}