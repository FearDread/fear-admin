/**
 * features/auth/authApi.ts
 *
 * ⚠️ REBUILD, NOT A DIFF. Per project notes, `authApi` already exists as one
 * of the injected endpoint sets on the shared `apiSlice` — merge this against
 * the real file (dedupe endpoint names, keep any tagTypes it already adds)
 * rather than overwriting it.
 *
 * Replaces the old `features/user/slice` async thunks (loginUser,
 * loginWithGoogle, loginWithFacebook, registerUser, forgotPassword) with
 * RTK Query endpoints injected into the shared `apiSlice`.
 *
 * Auth is cookie-session based (see project conventions) — the server sets
 * an httpOnly session cookie on success, so responses only need to carry the
 * `user` object. `credentials: 'include'` + the 401 → logout handling is
 * already configured globally on `apiSlice`'s baseQuery.
 *
 * FEAR API envelope: single-object auth endpoints still come back wrapped as
 * `{ result, success, message }` just like list endpoints, so every query
 * unwraps `result` via `transformResponse`.
 *
 * Verify the exact backend routes below (`/auth/login`, `/auth/register`,
 * etc.) against the real Express routes once the backend brand/cart
 * endpoints work lands — these are carried over 1:1 from the paths already
 * referenced in the uploaded CRA source (`/api/users/verify-reset-token/:token`,
 * `/api/users/reset-password/:token`) but rebased onto `/fear/api` per the
 * apiSlice convention.

import { apiSlice } from '@/lib/redux/api/apiSlice';
import { setCurrentUser, setIsAuthenticated, setAuthError, resetAuthState } from '../slices/authSlice';
import type { User } from '@/types/user';

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
  /** ID token / credential JWT returned by @react-oauth/google's GoogleLogin 
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

interface AuthResponse {
  user: User;
}

interface MessageResponse {
  message: string;
}

interface VerifyResetTokenResponse {
  valid: boolean;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { result: AuthResponse }) => response.result,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthError(null));
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data.user));
          dispatch(setIsAuthenticated(true));
        } catch (err: any) {
          dispatch(setAuthError(err?.error?.data?.message || 'Invalid email or password'));
        }
      },
      invalidatesTags: ['Cart'],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { result: AuthResponse }) => response.result,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthError(null));
        try {
          await queryFulfilled;
          // Intentionally does NOT set isAuthenticated here — matches original
          // behavior of redirecting to /login after a successful registration
          // rather than auto-signing the user in.
        } catch (err: any) {
          dispatch(setAuthError(err?.error?.data?.message || 'Registration failed'));
        }
      },
    }),

    googleLogin: builder.mutation<AuthResponse, GoogleLoginRequest>({
      query: (body) => ({
        url: '/auth/google',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { result: AuthResponse }) => response.result,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthError(null));
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data.user));
          dispatch(setIsAuthenticated(true));
        } catch (err: any) {
          dispatch(setAuthError(err?.error?.data?.message || 'Google sign-in failed'));
        }
      },
      invalidatesTags: ['Cart'],
    }),

    facebookLogin: builder.mutation<AuthResponse, FacebookLoginRequest>({
      query: (body) => ({
        url: '/auth/facebook',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { result: AuthResponse }) => response.result,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthError(null));
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data.user));
          dispatch(setIsAuthenticated(true));
        } catch (err: any) {
          dispatch(setAuthError(err?.error?.data?.message || 'Facebook sign-in failed'));
        }
      },
      invalidatesTags: ['Cart'],
    }),

    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { result: MessageResponse }) => response.result,
    }),

    verifyResetToken: builder.query<VerifyResetTokenResponse, string>({
      query: (token) => `/auth/verify-reset-token/${token}`,
      transformResponse: (response: { result: VerifyResetTokenResponse }) => response.result,
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
      transformResponse: (response: { result: MessageResponse }) => response.result,
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(resetAuthState());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    /** Hydrates session state on app load — see StoreProvider's AuthHydrator. 
    getSession: builder.query<AuthResponse, void>({
      query: () => '/auth/session',
      transformResponse: (response: { result: AuthResponse }) => response.result,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCurrentUser(data.user));
          dispatch(setIsAuthenticated(true));
        } catch {
          dispatch(setCurrentUser(null));
          dispatch(setIsAuthenticated(false));
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
} = authApi;
*/
/** 

* authApi.ts
*
* RTK Query endpoints for auth + the current-user session, consolidated so
* the account views don't need a hand-maintained `features/user/slice.js`
* at all. This is written to be **merged into the project's existing
* `authApi.ts`** (the one the `(auth)/[...auth]` route and `AuthHydrator`
* already use) rather than dropped in alongside it — see MERGE_NOTES.md for
* exactly what to reconcile.
*
* Why fold `getCurrentUser` / `updateProfile` / `changePassword` in here
* instead of a separate `userProfileApi.ts` (as an earlier pass of this
* conversion did): they all read and write the same "current user" cache
* entry, tagged `{ type: 'User', id: 'CURRENT' }`. Splitting them across two
* files meant `updateProfile` had no way to invalidate the tag
* `getCurrentUser` provides, so a profile edit wouldn't refresh the
* sidebar's name/avatar without a manual refetch. One file, one tag, no
* seam.
*
* `useCurrentUser()` at the bottom is the direct replacement for the old
* `userSlice` selectors — `selectCurrentUser`, `selectIsAuthenticated`,
* `selectUserLoading`, `selectLastLoginAt` all collapse into one hook backed
* by `useGetCurrentUserQuery`'s cache entry, so components call it once
* instead of four separate `useAppSelector` calls.
*/

import { apiSlice } from './apiSlice';

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

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
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

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ── Session ──────────────────────────────────────────────────────────
        // Cookie-session auth (see project notes: no localStorage/JWT handling),
        // so this just asks the API "who am I, if anyone" — a 401 resolves to
        // `null` via transformErrorResponse rather than surfacing as a hard
        // query error, since "logged out" is an expected, non-error state here.
        getCurrentUser: builder.query<CurrentUser | null, void>({
            query: () => '/auth/me',
            transformResponse: (obj: { result: CurrentUser | null }) => obj.result ?? null,
            transformErrorResponse: (response) => (response.status === 401 ? null : response),
            providesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        login: builder.mutation<CurrentUser, LoginInput>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
            transformResponse: (obj: { result: CurrentUser }) => obj.result,
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        register: builder.mutation<CurrentUser, RegisterInput>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
            transformResponse: (obj: { result: CurrentUser }) => obj.result,
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        logout: builder.mutation<{ success: boolean }, void>({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        forgotPassword: builder.mutation<{ success: boolean; message?: string }, { email: string }>({
            query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
        }),

        resetPassword: builder.mutation<{ success: boolean; message?: string }, { token: string; newPassword: string }>({
            query: ({ token, newPassword }) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { token, newPassword },
            }),
        }),

        // ── Profile (account/details view) ──────────────────────────────────
        updateProfile: builder.mutation<CurrentUser, UpdateProfileInput>({
            query: (body) => ({ url: '/user/profile', method: 'PUT', body }),
            transformResponse: (obj: { result: CurrentUser }) => obj.result,
            invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
        }),

        changePassword: builder.mutation<{ success: boolean; message?: string }, ChangePasswordInput>({
            query: (body) => ({ url: '/user/password', method: 'PUT', body }),
            // No tag invalidation — password changes don't affect anything cached.
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCurrentUserQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = authApi;

/**
 * useCurrentUser()
 *
 * Drop-in replacement for the old userSlice selector quartet:
 *   selectCurrentUser    → currentUser
 *   selectIsAuthenticated→ isAuthenticated
 *   selectUserLoading    → loading
 *   selectLastLoginAt    → lastLoginAt
 *
 * `loading` is `isLoading`, not `isFetching` — it's true only on the very
 * first fetch (e.g. cold navigation before AuthHydrator's initial request
 * resolves), not on every background refetch, so views don't flash a full
 * loading state every time a mutation invalidates the `User` tag.
 */
export function useCurrentUser() {
    const { data: currentUser, isLoading, error } = useGetCurrentUserQuery();

    return {
        currentUser: currentUser ?? null,
        isAuthenticated: Boolean(currentUser),
        loading: isLoading,
        lastLoginAt: currentUser?.lastLoginAt ?? null,
        error,
    };
}