import { api } from "@/lib/api";
import {
  ApiResponse,
  IndividualPayment,
  CheckoutSession,
  PaginatedResponse,
} from "@/types";

export const paymentApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createPaymentCheckout: builder.mutation<
      ApiResponse<CheckoutSession>,
      { assetId: string }
    >({
      query: ({ assetId }) => {
        const successUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}/checkout/success`
            : "/checkout/success";
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
    }),
    verifyPaymentSession: builder.mutation<ApiResponse, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: "/individual-payments/verify-session",
        method: "POST",
        body: { sessionId },
      }),
      invalidatesTags: ["Asset"],
    }),
    getPaymentHistory: builder.query<
      PaginatedResponse<IndividualPayment>,
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
        return `/individual-payments/payment-history?${params.toString()}`;
      },
      providesTags: ["Asset"],
    }),
    checkPurchase: builder.query<
      ApiResponse<{
        isPurchased: boolean;
        payment: IndividualPayment | null;
      }>,
      string
    >({
      query: (assetId) => `/individual-payments/check/${assetId}`,
      providesTags: (_result, _error, assetId) => [
        { type: "Asset", id: assetId },
      ],
    }),
  }),
});

export const {
  useCreatePaymentCheckoutMutation,
  useVerifyPaymentSessionMutation,
  useGetPaymentHistoryQuery,
  useCheckPurchaseQuery,
} = paymentApi;
