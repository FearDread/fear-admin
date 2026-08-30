import { apiSlice } from '@/lib/redux/api/apiSlice';
import { setCredentials, logout as clearCredentials } from '@/lib/redux/slices/authSlice';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface RegisterArgs {
  name: string;
  email: string;
  password: string;
}

interface ForgotPasswordArgs {
  email: string;
}

interface ResetPasswordArgs {
  token: string;
  password: string;
}

// FEAR API envelope — same shape used across productsApi/categoriesApi/cartApi.
interface FearEnvelope<T> {
  result: T;
  success: boolean;
  message: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthUser, LoginArgs>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (obj: FearEnvelope<AuthUser>) => obj.result,
      invalidatesTags: ['Auth', 'Cart'], // cart is per-session, refetch it post-login
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(setCredentials(user));
        } catch {
          // error surfaces through the mutation hook's own `error` state —
          // nothing to do here besides not touching authSlice.
        }
      },
    }),

    register: builder.mutation<AuthUser, RegisterArgs>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (obj: FearEnvelope<AuthUser>) => obj.result,
      invalidatesTags: ['Auth'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(setCredentials(user));
        } catch {
          // handled by the caller via the mutation's error state
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'Cart'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear local auth state even if the network call fails — a
          // logout button that leaves you "logged in" client-side because
          // the request timed out is worse than a stale session cookie.
          dispatch(clearCredentials());
        }
      },
    }),

    // Session check — call on app load to hydrate authSlice from the
    // existing session cookie, if any.
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => '/auth/me',
      transformResponse: (obj: FearEnvelope<AuthUser>) => obj.result,
      providesTags: ['Auth'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(setCredentials(user));
        } catch {
          dispatch(clearCredentials());
        }
      },
    }),

    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordArgs>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
      transformResponse: (obj: FearEnvelope<{ message: string }>) => obj.result,
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordArgs>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
      transformResponse: (obj: FearEnvelope<{ message: string }>) => obj.result,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;