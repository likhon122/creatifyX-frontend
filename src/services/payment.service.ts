import apiClient from "@/lib/api-client";
import {
  ApiResponse,
  IndividualPayment,
  CheckoutSession,
  PaginatedResponse,
} from "@/types";

export const paymentApi = {
  // Create checkout session for asset purchase
  async createCheckout(assetId: string): Promise<ApiResponse<CheckoutSession>> {
    const successUrl = `${window.location.origin}/checkout/success?type=payment&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/asset/${assetId}`;
    return apiClient.post("/individual-payments/create-checkout-session", {
      assetId,
      successUrl,
      cancelUrl,
    });
  },

  // Verify checkout session
  async verifySession(sessionId: string): Promise<ApiResponse> {
    return apiClient.post("/individual-payments/verify-session", { sessionId });
  },

  // Get payment history
  async getPaymentHistory(filters?: {
    page?: number;
    limit?: number;
    paymentStatus?: string;
  }): Promise<PaginatedResponse<IndividualPayment>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    return apiClient.get(
      `/individual-payments/payment-history?${params.toString()}`
    );
  },

  // Check if asset is purchased
  async checkPurchase(assetId: string): Promise<
    ApiResponse<{
      isPurchased: boolean;
      payment: IndividualPayment | null;
    }>
  > {
    return apiClient.get(`/individual-payments/check/${assetId}`);
  },
};
