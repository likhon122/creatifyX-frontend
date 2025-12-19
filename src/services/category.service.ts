import apiClient from "@/lib/api-client";
import { ApiResponse, Category } from "@/types";

export const categoryApi = {
  // Get all categories
  async getCategories(
    parentCategory?: boolean
  ): Promise<ApiResponse<Category[]>> {
    const params =
      parentCategory !== undefined ? `?parentCategory=${parentCategory}` : "";
    return apiClient.get(`/categories${params}`);
  },

  // Get single category
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return apiClient.get(`/categories/${id}`);
  },

  // Create category (admin)
  async createCategory(
    data: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    return apiClient.post("/categories", data);
  },

  // Update category (admin)
  async updateCategory(
    id: string,
    data: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    return apiClient.patch(`/categories/${id}`, data);
  },
};
