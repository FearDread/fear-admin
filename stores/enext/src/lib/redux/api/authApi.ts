/**
 * lib/redux/api/authApi.ts
 *
 * RTK Query endpoints for auth + session, rebuilt directly against the real
 * backend controller (`backend/.../auth/index.js`). Two things about that
 * controller matter for every endpoint below and are NOT the FEAR list/detail
 * envelope used elsewhere in the app:
 *
 *   1. Response shape is `{ success, message, data: { ... } }` — a `data`
 *      envelope, not `{ result }`. `transformResponse` unwraps `response.data`.
 *   2. Auth is a JWT in an httpOnly `jwt` cookie (`res.cookie('jwt', token, ...)`
 *      on login/register/refresh, `res.clearCookie('jwt', ...)` on logout).
 *      The client never touches the token directly — `credentials: 'include'`
 *      on apiSlice's baseQuery is what makes the cookie ride along.
 *
 * Routes that exist on the backend today: login, register, logout,
 * GET /auth/me, PUT /auth/refresh-token, PUT /auth/update-profile,
 * PUT /auth/update-preferences, POST /auth/google, POST /auth/google/link,
 * DELETE /auth/google/unlink.
 *
 * Routes that do NOT exist on the backend (no export in the controller):
 * forgot-password, verify-reset-token, reset-password, change-password,
 * facebook login. Their endpoints are kept below (ForgotPasswordForm /
 * ResetPasswordForm / DetailsView / FacebookAuthButton already call them)
 * but are marked as backend gaps — they will 404 until those routes are
 * implemented server-side. See MERGE_NOTES.md.
 *
 * `useCurrentUser()` at the bottom reads straight from `authSlice` rather
 * than issuing its own query — `getSession` (backed by GET /auth/me) is the
 * single source of truth for "who am I", and every mutation that changes
 * the session (login, register, googleLogin, logout, updateProfile) either
 * writes the slice directly via `onQueryStarted` or invalidates the
 * `{ type: 'User', id: 'CURRENT' }` tag so `getSession` refetches and
 * re-syncs the slice itself. Components should never need to call
 * `useGetSessionQuery()` directly outside of `AuthHydrator`.
 */

import { apiSlice } from '@/lib/redux/api/apiSlice';
import { useAppSelector } from '@/lib/redux/hooks';
import {
    setCurrentUser,
    setIsAuthenticated,
    setAuthError,
    setHydrating,
    logout as logoutAction,
    selectCurrentUser,
    selectIsAuthenticated,
    selectIsAuthHydrating,
} from '@/lib/redux/slices/authSlice';
import type { User } from '@/types/user';

// ─────────────────────────────────────────────────────────────────────────
// Envelope — NOT the FEAR `{ result }` list/detail envelope used elsewhere.
// ─────────────────────────────────────────────────────────────────────────
interface AuthDataEnvelope<T> {
    success: boolean;
    message?: string;
    data: T;
}

// ─────────────────────────────────────────────────────────────────────────
// Request/response payloads
// ─────────────────────────────────────────────────────────────────────────

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
}

export interface GoogleLoginRequest {
    /** ID token / credential JWT returned by @react-oauth/google's GoogleLogin */
    credential: string;
    clientId?: string;
}

export interface LinkGoogleAccountRequest {
    googleId: string;
    email: string;
}

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    phoneNumber?: string;
    bio?: string;
    dateOfBirth?: string;
    avatar?: string;
}

export interface UpdatePreferencesInput {
    language?: string;
    timezone?: string;
    theme?: string;
    notifications?: Record<string, boolean>;
}

interface UserPayload {
    user: User;
}

interface UserAndTokenPayload {
    user: User;
    /** JWT also arrives via the httpOnly cookie — this is exposed for parity
     *  with the backend response only; the client should not persist it. */
    token: string;
}

interface PreferencesPayload {
    preferences: UpdatePreferencesInput;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ── Session ──────────────────────────────────────────────────────────
        /**
         * Hydrates session state on app load (see StoreProvider's AuthHydrator)
         * and is the endpoint every other mutation's tag invalidation refetches
         * to re-sync `authSlice`. A 401 is expected/normal for a logged-out
         * visitor, not a real error.
         */
        getSession: builder.query<User | null, void>({
            query: () => '/auth/me',
            transformResponse: (response: AuthDataEnvelope<UserPayload>) => response.data.user,
            transformErrorResponse: (response) => (response.status === 401 ? null : response),
            providesTags: [{ type: 'User', id: 'CURRENT' }],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(setCurrentUser(user));
                    dispatch(setIsAuthenticated(Boolean(user)));
                } catch {
                    dispatch(setCurrentUser(null));
                    dispatch(setIsAuthenticated(false));
                } finally {
                    // Runs whether the session check succeeded or failed — this is
                    // what lets isHydrating-gated UI (e.g. AccountClient) stop
                    // rendering null once the very first check resolves either way.
                    dispatch(setHydrating(false));
                }
            },
        }),

        login: builder.mutation<User, LoginRequest>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
            transformResponse: (response: AuthDataEnvelope<UserAndTokenPayload>) => response.data.user,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                dispatch(setAuthError(null));
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(setCurrentUser(user));
                    dispatch(setIsAuthenticated(true));
                } catch (err: any) {
                    dispatch(setAuthError(err?.error?.data?.message || 'Invalid email or password'));
                }
            },
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }, 'Cart'],
        }),

        register: builder.mutation<User, RegisterRequest>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
            transformResponse: (response: AuthDataEnvelope<UserAndTokenPayload>) => response.data.user,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                dispatch(setAuthError(null));
                try {
                    // Registration also sets the `jwt` cookie server-side, but the
                    // app's UX (LoginForm's `?message=`) intentionally redirects to
                    // /login instead of auto-signing in — matches original behavior.
                    await queryFulfilled;
                } catch (err: any) {
                    dispatch(setAuthError(err?.error?.data?.message || 'Registration failed'));
                }
            },
        }),

        logout: builder.mutation<void, void>({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    dispatch(logoutAction());
                    dispatch(apiSlice.util.resetApiState());
                }
            },
        }),

        refreshToken: builder.mutation<User, void>({
            query: () => ({ url: '/auth/refresh-token', method: 'PUT' }),
            transformResponse: (response: AuthDataEnvelope<UserAndTokenPayload>) => response.data.user,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(setCurrentUser(user));
                    dispatch(setIsAuthenticated(true));
                } catch {
                    dispatch(setCurrentUser(null));
                    dispatch(setIsAuthenticated(false));
                }
            },
        }),

        // ── Profile ──────────────────────────────────────────────────────────
        /**
         * NOTE: the backend's `updateProfile` does NOT accept/update `email` —
         * only firstName/lastName/displayName/phoneNumber/bio/dateOfBirth/avatar.
         * DetailsView currently sends `email` in its payload; the backend will
         * silently ignore it. Either add email-change support server-side or
         * strip it from the form payload to avoid a misleading "saved" state.
         */
        updateProfile: builder.mutation<User, UpdateProfileInput>({
            query: (body) => ({ url: '/auth/update-profile', method: 'PUT', body }),
            transformResponse: (response: AuthDataEnvelope<UserPayload>) => response.data.user,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(setCurrentUser(user));
                } catch {
                    // surfaced via the mutation's own `error` in the component
                }
            },
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        updatePreferences: builder.mutation<UpdatePreferencesInput, UpdatePreferencesInput>({
            query: (body) => ({ url: '/auth/update-preferences', method: 'PUT', body }),
            transformResponse: (response: AuthDataEnvelope<PreferencesPayload>) => response.data.preferences,
        }),

        // ── Google OAuth ─────────────────────────────────────────────────────
        googleLogin: builder.mutation<User, GoogleLoginRequest>({
            query: (body) => ({ url: '/auth/google', method: 'POST', body }),
            transformResponse: (response: AuthDataEnvelope<UserAndTokenPayload>) => response.data.user,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                dispatch(setAuthError(null));
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(setCurrentUser(user));
                    dispatch(setIsAuthenticated(true));
                } catch (err: any) {
                    dispatch(setAuthError(err?.error?.data?.message || 'Google sign-in failed'));
                }
            },
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }, 'Cart'],
        }),

        linkGoogleAccount: builder.mutation<User, LinkGoogleAccountRequest>({
            query: (body) => ({ url: '/auth/google/link', method: 'POST', body }),
            transformResponse: (response: AuthDataEnvelope<UserPayload>) => response.data.user,
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        unlinkGoogleAccount: builder.mutation<User, void>({
            query: () => ({ url: '/auth/google/unlink', method: 'DELETE' }),
            transformResponse: (response: AuthDataEnvelope<UserPayload>) => response.data.user,
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        // ── ⚠️ Backend gaps — no matching export in the controller today ──────
        // Kept so LoginForm/RegisterForm/ForgotPasswordForm/ResetPasswordForm/
        // FacebookAuthButton/DetailsView keep compiling; each 404s until the
        // corresponding route + controller export is added server-side.

        facebookLogin: builder.mutation<User, { accessToken: string; userID: string }>({
            query: (body) => ({ url: '/auth/facebook', method: 'POST', body }),
            transformResponse: (response: AuthDataEnvelope<UserAndTokenPayload>) => response.data.user,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                dispatch(setAuthError(null));
                try {
                    const { data: user } = await queryFulfilled;
                    dispatch(setCurrentUser(user));
                    dispatch(setIsAuthenticated(true));
                } catch (err: any) {
                    dispatch(setAuthError(err?.error?.data?.message || 'Facebook sign-in failed'));
                }
            },
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }, 'Cart'],
        }),

        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
            transformResponse: (response: AuthDataEnvelope<{ message: string }>) => response.data,
        }),

        verifyResetToken: builder.query<{ valid: boolean }, string>({
            query: (token) => `/auth/verify-reset-token/${token}`,
            transformResponse: (response: AuthDataEnvelope<{ valid: boolean }>) => response.data,
        }),

        resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
            query: ({ token, password }) => ({
                url: `/auth/reset-password/${token}`,
                method: 'POST',
                body: { password },
            }),
            transformResponse: (response: AuthDataEnvelope<{ message: string }>) => response.data,
        }),

        changePassword: builder.mutation<
            { success: boolean; message?: string },
            { currentPassword: string; newPassword: string }
        >({
            query: (body) => ({ url: '/auth/change-password', method: 'PUT', body }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSessionQuery,
    useLazyGetSessionQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useUpdateProfileMutation,
    useUpdatePreferencesMutation,
    useGoogleLoginMutation,
    useLinkGoogleAccountMutation,
    useUnlinkGoogleAccountMutation,
    useFacebookLoginMutation,
    useForgotPasswordMutation,
    useVerifyResetTokenQuery,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi;

/**
 * useCurrentUser()
 *
 * Reads straight from `authSlice` — NOT a fresh network call. `getSession`
 * (GET /auth/me, fired once by AuthHydrator on app load) is what populates
 * this state, and every session-changing mutation above either writes the
 * slice directly or invalidates `{ type: 'User', id: 'CURRENT' }` so
 * `getSession` refetches and re-syncs it. Components just need "who's
 * logged in right now", not another round trip.
 */
export function useCurrentUser() {
    const currentUser = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isHydrating = useAppSelector(selectIsAuthHydrating);

    return {
        currentUser,
        isAuthenticated,
        loading: isHydrating,
        lastLoginAt: currentUser?.lastLoginAt ?? null,
    };
}