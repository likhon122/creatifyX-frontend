import { api } from "@/lib/api";
import {
  ApiResponse,
  Subscription,
  CheckoutSession,
  PaginatedResponse,
} from "@/types";

export interface CreateSubscriptionData {
  plan: string;
  user?: string;
  organization?: string;
  status?: "active" | "canceled" | "expired" | "past_due";
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodStart: string | Date;
  currentPeriodEnd: string | Date;
  cancelAtPeriodEnd?: boolean;
}

export const subscriptionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createCheckout: builder.mutation<
      ApiResponse<CheckoutSession>,
      { planId: string }
    >({
      query: ({ planId }) => {
        const successUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/checkout/success?type=subscription`
            : "/checkout/success?type=subscription";
        const cancelUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/plans`
            : "/plans";

        return {
          url: "/subscriptions/checkout",
          method: "POST",
          body: { planId, successUrl, cancelUrl },
        };
      },
    }),
    verifyCheckout: builder.mutation<ApiResponse, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: "/subscriptions/checkout/verify",
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: ["Subscription"],
    }),
    createSubscription: builder.mutation<
      ApiResponse<Subscription>,
      CreateSubscriptionData
    >({
      query: (data) => ({
        url: "/subscriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),
    getSubscriptions: builder.query<
      PaginatedResponse<Subscription>,
      {
        page?: number;
        limit?: number;
        status?: string;
      } | void
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
          });
        }
        return `/subscriptions?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Subscription" as const,
                id: _id,
              })),
              { type: "Subscription", id: "LIST" },
            ]
          : [{ type: "Subscription", id: "LIST" }],
    }),
    getSubscription: builder.query<ApiResponse<Subscription>, string>({
      query: (id) => `/subscriptions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Subscription", id }],
    }),
    getMySubscription: builder.query<ApiResponse<Subscription>, void>({
      query: () => "/subscriptions/me",
      providesTags: [{ type: "Subscription", id: "ME" }],
    }),
    updateSubscription: builder.mutation<
      ApiResponse<Subscription>,
      {
        id: string;
        data: Partial<CreateSubscriptionData>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/subscriptions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Subscription", id },
        { type: "Subscription", id: "LIST" },
      ],
    }),
    cancelSubscription: builder.mutation<ApiResponse<Subscription>, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "PATCH",
        body: { status: "canceled", cancelAtPeriodEnd: true },
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Subscription", id },
        { type: "Subscription", id: "LIST" },
        { type: "Subscription", id: "ME" },
      ],
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  useVerifyCheckoutMutation,
  useCreateSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetSubscriptionQuery,
  useGetMySubscriptionQuery,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;

// Alias for backward compatibility
export const useVerifySubscriptionSessionMutation =
  subscriptionApi.endpoints.verifyCheckout.useMutation;
