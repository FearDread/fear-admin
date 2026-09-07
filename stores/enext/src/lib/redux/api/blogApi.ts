import { apiSlice } from '@/lib/redux/api/apiSlice';

export interface BlogAuthor {
    name?: string;
    avatar?: string;
    bio?: string;
}

export interface BlogPost {
    _id: string;
    id?: string;
    title: string;
    excerpt?: string;
    content?: string;
    category?: string;
    categoryId?: string;
    images?: { url: string }[];
    thumbnail?: string;
    author?: string;
    authorName?: string;
    authorAvatar?: string;
    authorBio?: string;
    commentsCount?: number;
    comments?: number;
    views?: number;
    publishedDate?: string;
    createdAt?: string;
}

export interface BlogListParams {
    search?: string;
    categoryId?: string | null;
    sortBy?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface CommentPayload {
    postId: string;
    text: string;
    name: string;
    email: string;
    website?: string;
}

// FEAR API envelope every list endpoint returns
interface FearListEnvelope<T> {
    result: T[];
    success: boolean;
    message?: string;
    count: number;
}

interface FearItemEnvelope<T> {
    result: T;
    success: boolean;
    message?: string;
}

export const blogApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBlogPosts: builder.query<BlogPost[], BlogListParams | void>({
            query: (params) => ({
                url: '/blog',
                params: params
                    ? {
                        search: params.search || undefined,
                        categoryId: params.categoryId || undefined,
                        sort: params.sortBy || 'desc',
                        page: params.page,
                        limit: params.limit,
                    }
                    : undefined,
            }),
            transformResponse: (response: FearListEnvelope<BlogPost>) => response.result,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Blog' as const, id: _id })),
                        { type: 'Blog' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Blog' as const, id: 'LIST' }],
        }),

        getBlogPostById: builder.query<BlogPost, string>({
            query: (id) => `/blog/${id}`,
            transformResponse: (response: FearItemEnvelope<BlogPost>) => response.result,
            providesTags: (_result, _error, id) => [{ type: 'Blog' as const, id }],
        }),

        incrementBlogViews: builder.mutation<{ views: number }, string>({
            query: (id) => ({
                url: `/blog/${id}/views`,
                method: 'PATCH',
            }),
            transformResponse: (response: FearItemEnvelope<{ views: number }>) => response.result,
            // View count bump shouldn't force a refetch of the whole post —
            // no invalidatesTags here, same rationale as other fire-and-forget
            // telemetry-style mutations in this codebase.
        }),

        submitBlogComment: builder.mutation<void, CommentPayload>({
            query: ({ postId, ...body }) => ({
                url: `/blog/${postId}/comments`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { postId }) => [{ type: 'Blog' as const, id: postId }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllBlogPostsQuery,
    useGetBlogPostByIdQuery,
    useIncrementBlogViewsMutation,
    useSubmitBlogCommentMutation,
} = blogApi;