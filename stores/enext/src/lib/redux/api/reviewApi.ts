import { apiSlice } from '@/lib/redux/api/apiSlice';

export interface Review {
  id: string;
  productId: string;
  username: string;
  email: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewListEnvelope {
  result: Review[];
  success: boolean;
  message: string;
  count: number;
}

interface ReviewEnvelope {
  result: Review;
  success: boolean;
  message: string;
}

export interface SubmitReviewArgs {
  productId: string;
  username: string;
  email: string;
  rating: number;
  title?: string;
  comment: string;
}

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<Review[], string>({
      query: (productId) => `/reviews/product/${productId}`,
      transformResponse: (response: ReviewListEnvelope) => response.result,
      providesTags: (result, _err, productId) =>
        result
          ? [
              ...result.map((r) => ({ type: 'Review' as const, id: r.id })),
              { type: 'Review' as const, id: `LIST-${productId}` },
            ]
          : [{ type: 'Review' as const, id: `LIST-${productId}` }],
    }),

    submitReview: builder.mutation<Review, SubmitReviewArgs>({
      query: (body) => ({
        url: '/reviews',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ReviewEnvelope) => response.result,
      // Optimistic insert so the review appears in the list instantly,
      // then reconciled with the server's copy (real id/createdAt) once
      // the request resolves. Rolled back on failure.
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;
        const optimisticReview: Review = {
          id: tempId,
          productId: args.productId,
          username: args.username,
          email: args.email,
          rating: args.rating,
          title: args.title,
          comment: args.comment,
          verified: false,
          helpfulCount: 0,
          createdAt: new Date().toISOString(),
        };

        const patch = dispatch(
          reviewsApi.util.updateQueryData(
            'getProductReviews',
            args.productId,
            (draft) => {
              draft.unshift(optimisticReview);
            },
          ),
        );

        try {
          const { data: savedReview } = await queryFulfilled;
          dispatch(
            reviewsApi.util.updateQueryData(
              'getProductReviews',
              args.productId,
              (draft) => {
                const idx = draft.findIndex((r) => r.id === tempId);
                if (idx !== -1) draft[idx] = savedReview;
              },
            ),
          );
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (_result, _err, args) => [
        { type: 'Review', id: `LIST-${args.productId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductReviewsQuery, useSubmitReviewMutation } = reviewsApi;