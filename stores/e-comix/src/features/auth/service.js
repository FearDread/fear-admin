import FeatureFactory from "../factory";

const authApi = FeatureFactory('auth').api.create(builder => ({
    login: builder.mutation({
      query: (data) => ({
        url: `auth/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `auth/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `auth/logout`,
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `user/profile`,
        method: "PUT",
        body: data,
      }),
    })
}));

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation
} = authApi;