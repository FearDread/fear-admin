import { apiSlice } from './apiSlice';

export interface Post {
  id: number;
  title: string;
  body: string;
}

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/blog/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Post' as const, id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),

    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/post/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    updatePost: builder.mutation<Post, Pick<Post, 'id'> & Partial<Post>>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Post', id }],
    }),

    deletePost: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
