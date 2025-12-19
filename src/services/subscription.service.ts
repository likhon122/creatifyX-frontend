import apiClient from "@/lib/api-client";
import {
  ApiResponse,
  Subscription,
  CheckoutSession,
  PaginatedResponse,
} from "@/types";

export const subscriptionApi = {
  // Create checkout session
  async createCheckout(planId: string): Promise<ApiResponse<CheckoutSession>> {
    const successUrl = `${window.location.origin}/checkout/success?type=subscription&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${window.location.origin}/plans`;
    return apiClient.post("/subscriptions/checkout", {
      planId,
      successUrl,
      cancelUrl,
    });
  },

  // Verify checkout session
  async verifyCheckout(sessionId: string): Promise<ApiResponse> {
    return apiClient.post("/subscriptions/checkout/verify", { sessionId });
  },

  // Get all subscriptions (admin)
  async getSubscriptions(filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Subscription>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    return apiClient.get(`/subscriptions?${params.toString()}`);
  },

  // Get single subscription
  async getSubscription(id: string): Promise<ApiResponse<Subscription>> {
    return apiClient.get(`/subscriptions/${id}`);
  },

  // Update subscription (admin)
  async updateSubscription(
    id: string,
    status: "active" | "canceled" | "past_due" | "expired"
  ): Promise<ApiResponse<Subscription>> {
    return apiClient.patch(`/subscriptions/${id}`, { status });
  },
};
