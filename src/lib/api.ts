import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const authStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("auth-storage")
        : null;
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        const token = state?.accessToken;
        if (token) {
          headers.set("Authorization", token);
        }
      } catch (error) {
        console.error("Error parsing auth storage:", error);
      }
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      "/auth/access-token",
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as { data: { accessToken: string } };
      const accessToken = data.data.accessToken;

      // Store the new token
      const authStorage =
        typeof window !== "undefined"
          ? localStorage.getItem("auth-storage")
          : null;
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          parsed.state.accessToken = accessToken;
          if (typeof window !== "undefined") {
            localStorage.setItem("auth-storage", JSON.stringify(parsed));
          }
        } catch (err) {
          console.error("Error updating auth storage:", err);
        }
      }

      // Retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        window.location.href = "/auth/login";
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Asset",
    "Category",
    "Plan",
    "Subscription",
    "Contact",
    "Review",
    "Dashboard",
    "Payment",
  ],
  // Keep cache for 60 seconds
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth", "User"],
    }),

    // Asset Endpoints
    getAssets: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              searchParams.append(key, String(value));
            }
          });
        }
        return `/assets?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({
                type: "Asset" as const,
                id: _id,
              })),
              { type: "Asset", id: "LIST" },
            ]
          : [{ type: "Asset", id: "LIST" }],
    }),
    getAsset: builder.query({
      query: (id) => `/assets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Asset", id }],
    }),
    createAsset: builder.mutation({
      query: (formData) => ({
        url: "/assets",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Asset", id: "LIST" }, "Dashboard"],
    }),
    updateAsset: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/assets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
      ],
    }),
    deleteAsset: builder.mutation({
      query: (id) => ({
        url: `/assets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Asset", id: "LIST" }, "Dashboard"],
    }),
    getMyAssets: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });
        }
        return `/assets/my-assets?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Asset", id: "MY_LIST" }],
    }),
    getMyPendingAssets: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });
        }
        return `/assets/my-assets?status=pending_review&${searchParams.toString()}`;
      },
      providesTags: [{ type: "Asset", id: "PENDING_LIST" }],
    }),
    getPendingAssets: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });
        }
        return `/assets?status=pending_review&${searchParams.toString()}`;
      },
      providesTags: [{ type: "Asset", id: "ADMIN_PENDING" }],
    }),
    approveAsset: builder.mutation({
      query: (id) => ({
        url: `/assets/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "ADMIN_PENDING" },
        "Dashboard",
      ],
    }),
    rejectAsset: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/assets/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "ADMIN_PENDING" },
        "Dashboard",
      ],
    }),
    incrementView: builder.mutation({
      query: (id) => ({
        url: `/asset-stats/${id}/view`,
        method: "POST",
      }),
    }),
    recordDownload: builder.mutation({
      query: (id) => ({
        url: `/asset-stats/${id}/download`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Asset", id },
        "Dashboard",
      ],
    }),

    // Category Endpoints
    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Category"],
    }),

    // Plan Endpoints
    getPlans: builder.query({
      query: () => "/plans",
      providesTags: ["Plan"],
    }),

    // Subscription Endpoints
    createSubscriptionCheckout: builder.mutation({
      query: ({ planId }) => {
        const successUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/checkout/success?type=subscription&session_id={CHECKOUT_SESSION_ID}`
            : "/checkout/success?type=subscription&session_id={CHECKOUT_SESSION_ID}";
        const cancelUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/plans`
            : "/plans";
        return {
          url: "/subscriptions/create-checkout-session",
          method: "POST",
          body: { planId, successUrl, cancelUrl },
        };
      },
      invalidatesTags: ["Subscription", "User"],
    }),
    verifySubscriptionSession: builder.mutation({
      query: ({ sessionId }) => ({
        url: "/subscriptions/verify-session",
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: ["Subscription", "User", "Auth"],
    }),
    getMySubscription: builder.query({
      query: () => "/subscriptions/my-subscription",
      providesTags: ["Subscription"],
    }),
    cancelSubscription: builder.mutation({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      invalidatesTags: ["Subscription", "User", "Auth"],
    }),

    // Payment (Individual Purchase) Endpoints
    createPaymentCheckout: builder.mutation({
      query: ({ assetId }) => {
        const successUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/checkout/success?type=payment&session_id={CHECKOUT_SESSION_ID}`
            : "/checkout/success?type=payment&session_id={CHECKOUT_SESSION_ID}";
        const cancelUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/asset/${assetId}`
            : `/asset/${assetId}`;
        return {
          url: "/individual-payments/create-checkout-session",
          method: "POST",
          body: { assetId, successUrl, cancelUrl },
        };
      },
      invalidatesTags: ["Payment"],
    }),
    verifyPaymentSession: builder.mutation({
      query: ({ sessionId }) => ({
        url: "/individual-payments/verify-session",
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: ["Payment", "Asset"],
    }),
    getPaymentHistory: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              searchParams.append(key, String(value));
            }
          });
        }
        return `/individual-payments/payment-history?${searchParams.toString()}`;
      },
      providesTags: ["Payment"],
    }),
    checkPurchase: builder.query({
      query: (assetId) => `/individual-payments/check/${assetId}`,
      providesTags: (_result, _error, assetId) => [
        { type: "Payment", id: assetId },
      ],
    }),

    // Dashboard/Analytics Endpoints
    getAdminAnalytics: builder.query({
      query: () => "/dashboard/admin",
      providesTags: ["Dashboard"],
    }),
    getAuthorAnalytics: builder.query({
      query: () => "/dashboard/author",
      providesTags: ["Dashboard"],
    }),

    // Review Endpoints
    getAssetReviews: builder.query({
      query: ({ assetId, page, limit }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", String(page));
        if (limit) params.append("limit", String(limit));
        return `/reviews/asset/${assetId}?${params.toString()}`;
      },
      providesTags: (_result, _error, { assetId }) => [
        { type: "Review", id: assetId },
      ],
    }),
    createReview: builder.mutation({
      query: ({ assetId, ...data }) => ({
        url: `/reviews/asset/${assetId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { assetId }) => [
        { type: "Review", id: assetId },
        { type: "Asset", id: assetId },
      ],
    }),

    // Contact Endpoint
    createContact: builder.mutation({
      query: (data) => ({
        url: "/contacts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contact"],
    }),

    // User Endpoints
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Auth"],
    }),
  }),
});

// Export hooks for all endpoints
export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,

  // Assets
  useGetAssetsQuery,
  useGetAssetQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useGetMyAssetsQuery,
  useGetMyPendingAssetsQuery,
  useGetPendingAssetsQuery,
  useApproveAssetMutation,
  useRejectAssetMutation,
  useIncrementViewMutation,
  useRecordDownloadMutation,

  // Categories
  useGetCategoriesQuery,

  // Plans
  useGetPlansQuery,

  // Subscriptions
  useCreateSubscriptionCheckoutMutation,
  useVerifySubscriptionSessionMutation,
  useGetMySubscriptionQuery,
  useCancelSubscriptionMutation,

  // Payments
  useCreatePaymentCheckoutMutation,
  useVerifyPaymentSessionMutation,
  useGetPaymentHistoryQuery,
  useCheckPurchaseQuery,

  // Dashboard
  useGetAdminAnalyticsQuery,
  useGetAuthorAnalyticsQuery,

  // Reviews
  useGetAssetReviewsQuery,
  useCreateReviewMutation,

  // Contact
  useCreateContactMutation,

  // User
  useUpdateProfileMutation,
} = api;
