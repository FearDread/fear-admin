/**
 * authApi.ts
 */
import { useAppSelector } from '@/lib/redux/hooks';
import { apiSlice } from '@/lib/redux/api/apiSlice';
import { setCurrentUser, setIsAuthenticated, setAuthError, resetAuthState, selectCurrentUser } from '../slices/authSlice';
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
  user: User;
}

interface MessageResponse {
  message: string;
}

interface VerifyResetTokenResponse {
  valid: boolean;
}

/** Message-only endpoints: tolerate `{ message }`, `{ result: { message } }` or `{ data: { message } }`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toMessage = (r: any): MessageResponse => ({
  message: r?.message ?? r?.result?.message ?? r?.data?.message ?? '',
});
const unwrap = <T,>(r: any): T => (r?.result ?? r?.data ?? null) as T;

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
        query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        transformResponse: unwrap<AuthResponse>,
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
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (response: { result: AuthResponse }) => response.result,
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
      query: (body) => ({ url: '/auth/facebook', method: 'POST', body }),
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
          dispatch(resetAuthState());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    // ── Profile ─────────────────────────────────────────────────────────
    updateProfile: builder.mutation<CurrentUser, UpdateProfileInput>({
        query: (body) => ({ url: '/auth/update-profile', method: 'PUT', body }),
        transformResponse: unwrap<CurrentUser>,
        invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    changePassword: builder.mutation<{ success: boolean; message?: string }, ChangePasswordInput>({
      query: (body) => ({ url: '/auth/password', method: 'PUT', body }),
    }),

    getCurrentUser: builder.query<CurrentUser | null, void>({
        query: () => '/auth/me',
        transformResponse: (r: any) => unwrap<any>(r)?.user ?? unwrap<CurrentUser>(r) ?? null,
        providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    /** Hydrates session state on app load — see StoreProvider's AuthHydrator. */
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
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;

/**
 * useCurrentUser() — kept because the account views import it. Prefer the
 * authSlice selectors (selectCurrentUser / selectIsAuthenticated) for new code.
 */
export function useCurrentUser() {
    const reduxUser = useAppSelector(selectCurrentUser);
    const { data, isLoading } = useGetCurrentUserQuery();
    const currentUser = (data ?? reduxUser) as CurrentUser | null;
    return {
        currentUser,
        isAuthenticated: Boolean(currentUser),
        loading: isLoading && !reduxUser,
        lastLoginAt: currentUser?.lastLoginAt ?? null,
    };
}