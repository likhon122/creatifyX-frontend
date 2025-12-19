import { api } from "@/lib/api";
import { ApiResponse, Review, PaginatedResponse } from "@/types";

export const reviewApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAssetReviews: builder.query<
      PaginatedResponse<Review>,
      {
        assetId: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ assetId, page, limit }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", String(page));
        if (limit) params.append("limit", String(limit));
        return `/reviews/asset/${assetId}?${params.toString()}`;
      },
      providesTags: (result, _error, { assetId }) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Review" as const,
                id: _id,
              })),
              { type: "Review", id: `ASSET_${assetId}` },
            ]
          : [{ type: "Review", id: `ASSET_${assetId}` }],
    }),
    getAuthorReviews: builder.query<ApiResponse<Review[]>, void>({
      query: () => "/reviews/author/my-reviews",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Review" as const,
                id: _id,
              })),
              { type: "Review", id: "AUTHOR_LIST" },
            ]
          : [{ type: "Review", id: "AUTHOR_LIST" }],
    }),
    getReview: builder.query<ApiResponse<Review>, string>({
      query: (reviewId) => `/reviews/${reviewId}`,
      providesTags: (_result, _error, reviewId) => [
        { type: "Review", id: reviewId },
      ],
    }),
    createReview: builder.mutation<
      ApiResponse<Review>,
      {
        assetId: string;
        rating: number;
        comment: string;
      }
    >({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { assetId }) => [
        { type: "Review", id: `ASSET_${assetId}` },
        { type: "Asset", id: assetId },
      ],
    }),
    replyToReview: builder.mutation<
      ApiResponse<Review>,
      { reviewId: string; reply: string }
    >({
      query: ({ reviewId, reply }) => ({
        url: `/reviews/${reviewId}/reply`,
        method: "POST",
        body: { comment: reply },
      }),
      invalidatesTags: (_result, _error, { reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "AUTHOR_LIST" },
      ],
    }),
    deleteReview: builder.mutation<ApiResponse, string>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAssetReviewsQuery,
  useGetAuthorReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useReplyToReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
