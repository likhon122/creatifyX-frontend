import { api } from "@/lib/api";
import { ApiResponse, AuthorAnalytics, AdminAnalytics } from "@/types";

export const dashboardApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAuthorAnalytics: builder.query<ApiResponse<AuthorAnalytics>, void>({
      query: () => "/dashboard/author",
      providesTags: ["Dashboard"],
    }),
    getAdminAnalytics: builder.query<ApiResponse<AdminAnalytics>, void>({
      query: () => "/dashboard/admin",
      providesTags: ["Dashboard"],
    }),
    backfillEarnings: builder.mutation<
      ApiResponse<{ success: boolean; updated: number }>,
      void
    >({
      query: () => ({
        url: "/dashboard/backfill-earnings",
        method: "POST",
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetAuthorAnalyticsQuery,
  useGetAdminAnalyticsQuery,
  useBackfillEarningsMutation,
} = dashboardApi;
