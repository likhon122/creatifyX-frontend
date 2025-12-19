import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/types";

export interface Watermark {
  _id: string;
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  isActive: boolean;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const watermarkService = {
  // Upload watermark
  async uploadWatermark(formData: FormData): Promise<ApiResponse<Watermark>> {
    return apiClient.upload("/watermarks/upload", formData);
  },

  // Get active watermark
  async getActiveWatermark(): Promise<ApiResponse<Watermark>> {
    return apiClient.get("/watermarks/active");
  },

  // Get all watermarks
  async getAllWatermarks(): Promise<ApiResponse<Watermark[]>> {
    return apiClient.get("/watermarks");
  },

  // Set active watermark
  async setActiveWatermark(id: string): Promise<ApiResponse<Watermark>> {
    return apiClient.patch(`/watermarks/${id}/activate`, {});
  },

  // Delete watermark
  async deleteWatermark(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/watermarks/${id}`);
  },
};
