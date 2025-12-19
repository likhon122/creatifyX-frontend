import apiClient from "@/lib/api-client";
import { ApiResponse, User, PaginatedResponse } from "@/types";

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}

export const userApi = {
  // Get current user
  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get("/users/me");
  },

  // Get profile (alias for getMe)
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get("/users/me");
  },

  // Get user by ID
  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get(`/users/${id}`);
  },

  // Get all users (admin)
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    return apiClient.get(`/users?${params.toString()}`);
  },

  // Update user profile
  async updateProfile(
    id: string,
    formData: FormData
  ): Promise<ApiResponse<User>> {
    return apiClient.upload(`/users/${id}`, formData);
  },

  // Change user status (admin)
  async changeUserStatus(
    id: string,
    status: "active" | "blocked"
  ): Promise<ApiResponse<User>> {
    return apiClient.patch(`/users/change-user-status/${id}`, { status });
  },
};
