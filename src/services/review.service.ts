import apiClient from "@/lib/api-client";
import { ApiResponse, Review, PaginatedResponse } from "@/types";

export const reviewApi = {
  // Get reviews for asset
  async getAssetReviews(
    assetId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Review>> {
    const params = new URLSearchParams();
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    return apiClient.get(`/reviews/asset/${assetId}?${params.toString()}`);
  },

  // Get single review
  async getReview(reviewId: string): Promise<ApiResponse<Review>> {
    return apiClient.get(`/reviews/${reviewId}`);
  },

  // Create review
  async createReview(data: {
    assetId: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<Review>> {
    return apiClient.post("/reviews", data);
  },

  // Reply to review (author)
  async replyToReview(
    reviewId: string,
    reply: string
  ): Promise<ApiResponse<Review>> {
    return apiClient.post(`/reviews/${reviewId}/reply`, { reply });
  },

  // Delete review (admin)
  async deleteReview(reviewId: string): Promise<ApiResponse> {
    return apiClient.delete(`/reviews/${reviewId}`);
  },
};
