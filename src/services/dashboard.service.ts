import apiClient from "@/lib/api-client";
import { ApiResponse, AuthorAnalytics, AdminAnalytics } from "@/types";

export const dashboardApi = {
  // Get author analytics
  async getAuthorAnalytics(): Promise<ApiResponse<AuthorAnalytics>> {
    return apiClient.get("/dashboard/author");
  },

  // Get admin analytics
  async getAdminAnalytics(): Promise<ApiResponse<AdminAnalytics>> {
    return apiClient.get("/dashboard/admin");
  },

  // Backfill earnings (admin, one-time)
  async backfillEarnings(): Promise<
    ApiResponse<{ success: boolean; updated: number }>
  > {
    return apiClient.post("/dashboard/backfill-earnings");
  },
};
