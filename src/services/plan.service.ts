import apiClient from "@/lib/api-client";
import { ApiResponse, Plan } from "@/types";

export const planApi = {
  // Get all plans
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    return apiClient.get("/plans");
  },

  // Create plan (admin)
  async createPlan(data: {
    name: string;
    description: string;
    price: number;
    billingCycle: "monthly" | "yearly";
    features: string[];
  }): Promise<ApiResponse<Plan>> {
    return apiClient.post("/plans", data);
  },

  // Update plan (admin)
  async updatePlan(
    id: string,
    data: Partial<Plan>
  ): Promise<ApiResponse<Plan>> {
    return apiClient.patch(`/plans/${id}`, data);
  },
};
